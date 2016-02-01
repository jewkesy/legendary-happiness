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


  def LoadTweets()
    uniqueItems = Set.new
    arrItems = []
    progress = 0
    # filter = { }   #      {"twitter.coordinates.coordinates": {"$exists":true  } }   { 'LAT' => { '$exists' => true } }
    filter =    { 'twitter.coordinates.coordinates'  => { '$exists' => true   } }
    projection = {  'twitter.coordinates' => 1, 'twitter.id_str' => 1, 'twitter.text' => 1, 'twitter.user.id_str' => 1, 'twitter.user.name' => 1, 'twitter.user.screen_name' => 1, 'retweet_count' => 1, 'timestamp_ms' => 1  }    # { "twitter.coordinates":1, "twitter.id_str":1, "twitter.text":1, "twitter.user.id_str":1, "twitter.user.name" : 1 }

    projection = ['twitter.coordinates', 'twitter.id_str', 'twitter.text', 'twitter.user.id_str', 'twitter.user.name', 'twitter.user.screen_name', 'retweet_count', 'timestamp_ms']


    @db.collection("tweets").find(filter , :fields => projection).each do |row|
# puts row['twitter']

      

  
      tweet = row['twitter']

      if (tweet['coordinates'].nil?)
# puts 'no geo, skipping'        
        next
      end  
# puts row['_id'][0]
# puts tweet
      kind = 'tweet'
# puts tweet['id_str']
      uniqueId = kind + tweet['id_str']
      if (uniqueItems.include?(uniqueId))
        next
      end
      uniqueItems.add(uniqueId)
# puts uniqueId

      attrs = {
        'tweetId' => tweet['id_str'],
        'Text' => tweet['text'].to_s,
        'user' => tweet['user']['screen_name'].to_s,
        'ReTweetCount' => tweet['retweet_count'],
        'timestamp' => tweet['timestamp_ms'].to_i
      }
# puts attrs
      ing = BuildIngest(kind + '_' + tweet['id_str'], tweet['coordinates']['coordinates'][1], tweet['coordinates']['coordinates'][0], kind, attrs);
# puts ing
      arrItems.push(ing) 
      progress += 1
      # puts progress.to_s + ' vs ' + @@chunks.to_s
      if (progress >= @@chunks.to_i)
        # puts "1 - arrItems size: " + arrItems.size.to_s
        PokeProtein(Protein.new(['sluice', 'prot-spec v1.0', 'topology', 'add' ], { 'topology' => arrItems }))
        progress = 0
        arrItems = []
        # puts "2 - arrItems size: " + arrItems.size.to_s
      end
    end
    PokeProtein(Protein.new(['sluice', 'prot-spec v1.0', 'topology', 'add' ], { 'topology' => arrItems }))
    puts 'Tweets loaded: ' + uniqueItems.size.to_s        
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

    t6 = Thread.new{LoadTweets()}
    t6.join

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
