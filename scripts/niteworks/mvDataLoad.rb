require 'rubygems'
require 'metabolizer'
require 'thread'
require 'mongo'
require 'optparse'
require 'date'

include Plasma
include Mongo

@@verbose = false
@@sluiceHost = 'localhost'
@@mongoDB = 'localhost'
@@chunks = 100

# Parse options using OptionParser
optparse = OptionParser.new do |opt|
  opt.on('--verbose', '-v') { @@verbose = true }
  opt.on('-s', '--sluice SLUICEHOST', 'Sluice host') do |x|
    @@sluiceHost = x
  end
  opt.on('-m', '--mongodb MONGOHOST', 'MongoDB host') do |x|
    @@mongoDB = x
  end
  opt.on('-c', '--chunks CHUNKS', 'Chunk size') do |x|
    @@chunks = x
  end
end
optparse.parse!

if @@verbose
  puts "sluiceHost: " + @@sluiceHost.to_s
  puts "mongoDB: " + @@mongoDB.to_s
  puts "chunks: " + @@chunks.to_s
end

class Hearty < Metabolizer
  attr_accessor :verbose

  @outdescrips = ['sluice', 'prot-spec v1.0', 'topology', 'add' ]
  @hose
  @db

  def initialize(*hoses)
    puts "starting MV Data Load daemon" if @verbose
    super(*hoses)
    @descrips = ['sluice', 'prot-spec v1.0', 'psa', 'heartbeat']
    @count = 0
    appendMetabolizer(@descrips) { |p| receive p }
  end

  def receive(p)
    puts "Got heartbeat protein from sluice" if @@verbose

    LoadData()

    puts "Data has all loaded, I'm outta here"
    exit 1
  end

  def LoadPOIs()
    puts 'loading POIs'
    uniqueItems = Set.new
    arrItems = []
    kind = 'poi'

    uniqueId = kind + '_poi_1'
    uniqueItems.add(uniqueId)
    ing = BuildIngest(uniqueId, 48.9244627, 2.3579705, kind, { 'Text' => 'Stade De France', 'timestamp' => 1447449600000 }); # 9:20
    arrItems.push(ing) 

    uniqueId = kind + '_poi_2'
    uniqueItems.add(uniqueId)
    ing = BuildIngest(uniqueId, 48.8716804,2.3659606, kind, { 'Text' => 'Le Petit Cambodge', 'timestamp' => 1447449900000 }); # 9:25
    arrItems.push(ing) 

    uniqueId = kind + '_poi_3'
    uniqueItems.add(uniqueId)
    ing = BuildIngest(uniqueId, 48.868166,2.3715372, kind, { 'Text' => 'Rue de la Fountaine au Roi', 'timestamp' => 1447450320000 }); # 9:32
    arrItems.push(ing) 

    uniqueId = kind + '_poi_4'
    uniqueItems.add(uniqueId)
    ing = BuildIngest(uniqueId, 48.8791313,2.3476176, kind, { 'Text' => 'Le Belle Equipe', 'timestamp' => 1447450560000 }); # 9:36
    arrItems.push(ing) 

    uniqueId = kind + '_poi_5'
    uniqueItems.add(uniqueId)
    ing = BuildIngest(uniqueId, 48.8713992,2.2599972, kind, { 'Text' => 'Boulevard Voltaire', 'timestamp' => 1447450800000 }); # 9:40
    arrItems.push(ing) 

    uniqueId = kind + '_poi_6'
    uniqueItems.add(uniqueId)
    ing = BuildIngest(uniqueId, 48.8630134,2.368421, kind, { 'Text' => 'Bataclan', 'timestamp' => 1447450800000 }); # 9:40
    arrItems.push(ing) 
        
    PokeProtein(Protein.new(['sluice', 'prot-spec v1.0', 'topology', 'add' ], { 'topology' => arrItems }))
    puts 'POIs loaded: ' + uniqueItems.size.to_s  
  end

  def LoadTweetsGreen()


    #   {"twitter.coordinates.coordinates": {"$exists": false  }, "twitter.place.bounding_box.coordinates": { "$exists": true} }
    uniqueItems = Set.new
    arrItems = []
    progress = 0
   
    filter =    { 'twitter.coordinates.coordinates'  => { '$exists' => false   }, 'twitter.place.bounding_box.coordinates' => {  '$exists' => true } }

    projection = ['twitter.coordinates', 'twitter.id_str', 'twitter.text', 'twitter.user.id_str', 'twitter.user.name', 'twitter.user.screen_name', 'twitter.retweet_count', 'twitter.timestamp_ms', 'twitter.place', 'twitter.entities.media']

    @db.collection("tweets").find(filter , :fields => projection).each do |row|

      tweet = row['twitter']

      kind = 'tweet_green'

      uniqueId = kind + tweet['id_str']
      if (uniqueItems.include?(uniqueId))
        next
      end
      uniqueItems.add(uniqueId)
      
      if (tweet['entities']['media'].nil?)
        imgUrl = ''
      else
        if (tweet['entities']['media'][0]['type'] == 'photo')        
          imgUrl = tweet['entities']['media'][0]['media_url']
        else
          imgUrl =''
        end
      end

      attrs = {
        'tweetId' => tweet['id_str'],
        'Text' => tweet['text'].to_s,
        'user' => tweet['user']['screen_name'].to_s,
        'ReTweetCount' => tweet['retweet_count'].to_s,
        'hashtagScore' => BuildHashTagWeights(tweet['text'].downcase),
        'media' => imgUrl,
        'timestamp' => tweet['timestamp_ms'].to_i
      }

      lon = tweet['place']['bounding_box']['coordinates'][0][0][1]
      lat = tweet['place']['bounding_box']['coordinates'][0][0][0]

      ing = BuildIngest(kind + '_' + tweet['id_str'], lon, lat, kind, attrs);

      arrItems.push(ing) 
      progress += 1

      if (progress >= @@chunks.to_i)
        PokeProtein(Protein.new(['sluice', 'prot-spec v1.0', 'topology', 'add' ], { 'topology' => arrItems }))
        progress = 0
        arrItems = []
      end
    end
    PokeProtein(Protein.new(['sluice', 'prot-spec v1.0', 'topology', 'add' ], { 'topology' => arrItems }))
    puts 'Blue Tweets loaded: ' + uniqueItems.size.to_s  


  end

  def LoadTweetsBlue()
    uniqueItems = Set.new
    arrItems = []
    progress = 0
    # filter = { }   #      {"twitter.coordinates.coordinates": {"$exists":true  } }   { 'LAT' => { '$exists' => true } }
    filter =    { 'twitter.coordinates.coordinates'  => { '$exists' => true   } }

    projection = ['twitter.coordinates', 'twitter.id_str', 'twitter.text', 'twitter.user.id_str', 'twitter.user.name', 'twitter.user.screen_name', 'twitter.retweet_count', 'twitter.timestamp_ms', 'twitter.entities.media']

    @db.collection("tweets").find(filter , :fields => projection).each do |row|


      tweet = row['twitter']

      if (tweet['coordinates'].nil?)      
        next
      end  

      kind = 'tweet_blue'

      uniqueId = kind + tweet['id_str']
      if (uniqueItems.include?(uniqueId))
        next
      end
      uniqueItems.add(uniqueId)

      if (tweet['entities']['media'].nil?)
        imgUrl = ''
      else
        if (tweet['entities']['media'][0]['type'] == 'photo')        
          imgUrl = tweet['entities']['media'][0]['media_url']
        else
          imgUrl =''
        end
      end
        
      attrs = {
        'tweetId' => tweet['id_str'],
        'Text' => tweet['text'].to_s,
        'user' => tweet['user']['screen_name'].to_s,
        'ReTweetCount' => tweet['retweet_count'].to_s,
        'media' => imgUrl,
        'hashtagScore' => BuildHashTagWeights(tweet['text'].downcase),
        'timestamp' => tweet['timestamp_ms'].to_i
      }
      ing = BuildIngest(kind + '_' + tweet['id_str'], tweet['coordinates']['coordinates'][1], tweet['coordinates']['coordinates'][0], kind, attrs);

      arrItems.push(ing) 
      progress += 1

      if (progress >= @@chunks.to_i)
        PokeProtein(Protein.new(['sluice', 'prot-spec v1.0', 'topology', 'add' ], { 'topology' => arrItems }))
        progress = 0
        arrItems = []
      end
    end
    PokeProtein(Protein.new(['sluice', 'prot-spec v1.0', 'topology', 'add' ], { 'topology' => arrItems }))
    puts 'Blue Tweets loaded: ' + uniqueItems.size.to_s        
  end


  def LoadData()
    puts "Start time: " + Time.now.inspect
    @hose = Plasma::Pool.participate 'tcp://' + @@sluiceHost + '/topo-to-sluice'
  	mongo_client = MongoClient.new(@@mongoDB, 27017, :pool_size => 5)
  	@db = mongo_client.db("niteworks")

    # t1 = Thread.new{ LoadBranches() }
    # t2 = Thread.new{ LoadBuildingSocs() }
    # t3 = Thread.new{ LoadIntroducers() }
    # t4 = Thread.new{ LoadCustomers() }
    # t5 = Thread.new{ LoadLoans() }
    t4 = Thread.new{LoadPOIs()}
    t5 = Thread.new{LoadTweetsGreen()}
    t6 = Thread.new{LoadTweetsBlue()}
    t6.join
    t5.join
    t4.join
    # t1.join
    # t2.join
    # t3.join
    # t4.join
    # t5.join

    @hose.withdraw()
    puts "End time: " + Time.now.inspect
  end

  def BuildAddr(line1 = '', line2 = '', line3 = '', line4 = '')


    return line1
  end

  def BuildKind(prefix, gender, age)

    g = 'm'

    if (gender.downcase == 'female')
      g = 'f'
    end

    case age
    when 0..15
      a = 0
    when 16..24
      a = 16
    when 25..54
      a = 25
    when 55..200
      a = 55
    else
      a = age
    end

    retVal = prefix + '_' + g + '_' + a.to_s;
    return retVal;
  end


  def BuildHashTagWeights(text)

    #parisattacks
    #prayforparis
    #paris
    #isis
    #trump2016

    retVal = 0

    if text.include? "#parisattacks"
       retVal += 5
    end
    if text.include? "#prayforparis"
       retVal += 4
    end
    if text.include? "#paris"
       retVal += 3
    end
    if text.include? "#isis"
       retVal += 2
    end
    if text.include? "#trump2016"
       retVal += 1
    end

    return retVal.round(1).to_s

  end  

  def BuildIngest(itemId, latitiude, longitude, kind, attributesContent)
# puts attributesContent['time']

# timestamp: 2008-04-03 18:26:07
# 'time' => Time.at(tweet['timestamp_ms'].to_i / 1000).to_datetime

  theTime = Time.at(attributesContent['timestamp'].to_i / 1000).to_datetime.to_s
theTime.sub! 'T', ' '
# puts theTime

    ingest = {
      'attrs' => attributesContent,
      'id' => itemId,
      'loc' => [latitiude.to_f, longitude.to_f, 0.0],
      'kind' => kind,
      'timestamp' => theTime 
    }

    return ingest
  end

  def PokeProtein(protein)
      @hose.deposit(protein)
  end
end

pool = 'sluice-to-heart'

respire = 0.1

h = Hearty.new pool

sleep(5)

trap 'SIGINT', proc {
  puts "Ending MV Hearty daemon"
  h.quit = true
}

h.metabolize respire
