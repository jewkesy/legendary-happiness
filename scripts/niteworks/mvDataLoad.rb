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
    filter = {}   #   { 'LAT' => { '$exists' => true } }

    @db.collection("tweets").find(filter).each do |row|
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
      ing = BuildIngest(kind + '_' + tweet['id_str'], tweet['coordinates']['coordinates'][0], tweet['coordinates']['coordinates'][1], kind, attrs);
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

  def LoadBranches()
    uniqueItems = Set.new
    kind = 'branch'
    arrItems = []
    @db.collection("branches").find({ 'LAT' => { '$exists' => true } }).each do |row|
      uniqueId = kind + row['LAT'].to_s + row['LON'].to_s
      if (uniqueItems.include?(uniqueId))
        next
      end

      attrs = {
        'name' => row['BRANCH_NAME'],
        'Pipeline Offer' => row['PIPELINE_OFFER'].to_s
      }

      ing = BuildIngest(kind + '_' + row['BRANCH_CODE'].to_s, row['LAT'], row['LON'], kind, attrs);
      
      arrItems.push(ing)        
      uniqueItems.add(uniqueId)
    end
    PokeProtein(Protein.new(['sluice', 'prot-spec v1.0', 'topology', 'add' ], { 'topology' => arrItems }))
    puts kind + ' loaded: ' + uniqueItems.size.to_s
  end

  def LoadBuildingSocs()
    uniqueItems = Set.new
    kind = 'buildsoc'
    arrItems = []
    @db.collection("bs").find({ 'LAT' => { '$exists' => true } }).each do |row|
      uniqueId = kind + row['LAT'].to_s + row['LON'].to_s
      if (uniqueItems.include?(uniqueId))
        next
      end

      attrs = {
        'name' => row['Society'],
        'Postcode' => row['Postcode'],
        'Total Assets 2014' => row['Total Assets 2014'].to_s,
        'Total Assets 2013' => row['Total Assets 2013'].to_s,
        'Management Expenses 2014' => row['Management  Expenses 2014'].to_s,
        'Management Expenses 2013' => row['Management  Expenses 2013'].to_s,
        'Profit/Loss 2014' => row['Profit/Loss 2014'].to_s,
        'Profit/Loss 2013' => row['Profit/Loss 2013'].to_s
      }

      ing = BuildIngest(kind + '_' + row['Society'].to_s, row['LAT'], row['LON'], kind, attrs);
      arrItems.push(ing) 
      uniqueItems.add(uniqueId)
    end
    PokeProtein(Protein.new(['sluice', 'prot-spec v1.0', 'topology', 'add' ], { 'topology' => arrItems }))
    puts kind + ' loaded: ' + uniqueItems.size.to_s
  end

  def LoadIntroducers()
    uniqueItems = Set.new
    kind = 'introducer'
    arrItems = []
    @db.collection("introducers").find({ 'LAT' => { '$exists' => true } }).each do |row|
      # puts row.inspect
      uniqueId = kind + row['LAT'].to_s + row['LON'].to_s
      if (uniqueItems.include?(uniqueId))
        next
      end

      attrs = {
        'name' => row['INTRO_NAME'],
        'Pipeline Offer' => row['LOAN_BALANCE'].to_s
      }

      ing = BuildIngest(kind + '_' + row['INTRO_CODE'].to_s, row['LAT'], row['LON'], kind, attrs);
      arrItems.push(ing) 
      uniqueItems.add(uniqueId)
    end
    PokeProtein(Protein.new(['sluice', 'prot-spec v1.0', 'topology', 'add' ], { 'topology' => arrItems }))
    puts kind + ' loaded: ' + uniqueItems.size.to_s
  end

  def LoadCustomers()
    uniqueItems = Set.new
    arrItems = []
    progress = 0
    @db.collection("customers").find({ 'LAT' => { '$exists' => true } }).each do |row|
      if (row['GENDER'].downcase == 'n/a')
        kind = 'customer_business'
      else
        if (row['AGE'].nil?)
          next
        end
        kind = BuildKind('customer', row['GENDER'], row['AGE'])
      end

      uniqueId = kind + row['LAT'].to_s + row['LON'].to_s
      if (uniqueItems.include?(uniqueId))
        next
      end
      uniqueItems.add(uniqueId)
      
      formattedAddr = BuildAddr(row['ADDRESS_1'].to_s, row['ADDRESS_2'].to_s, row['ADDRESS_3'].to_s, row['POSTCODE'].to_s)

      attrs = {
        'CustmerId' => row['CUST_ID'].to_s,
        'Name' => row['Customer Name'].to_s,
        'Age' => row['AGE'].to_s,
        'Gender' => row['GENDER'].to_s,
        'Address' => formattedAddr,
        'Duration' => row['DURATION'].to_s,
        'TransCount' => row['TRAN_COUNT'].to_s
      }

      ing = BuildIngest(kind + '_' + row['CUST_ID'].to_s, row['LAT'], row['LON'], kind, attrs);
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
    puts 'Customers loaded: ' + uniqueItems.size.to_s    
  end

  def LoadLoans()
    uniqueItems = Set.new
    kind = 'loan'
    arrItems = []
    progress = 0
    @db.collection("loans").find({ 'LAT' => { '$exists' => true } }).each do |row|
      uniqueId = kind + row['LAT'].to_s + row['LON'].to_s
      if (uniqueItems.include?(uniqueId))
        next
      end
      uniqueItems.add(uniqueId)
      # Get unique property values. y = total loan amount
      # x = outstanding value.
      # number of coins to fill = Floor(10 * ((y-x)/y))

      #jenks bins in 100k [0.0, 1.0, 2.0, 3.0, 4.0, 6.0, 8.0, 11.0, 15.0, 20.0, 29.0] 

      y = row['PropertyValuation'].to_f
      x = row['OutstandingBalance'].to_f

      coins = (10 * ((y-x)/y)).floor

      if (coins == 0) 
        coins = 1
      end 
      
      loanSize = (y / 1e5).ceil
      if (loanSize < 1)
        loanSize = 1
      elsif(loanSize > 10)
        loanSize = 10
      end
      kind = 'coin' + loanSize.to_s

      attrs = {
        'name' => row['Account Name'],
        'Rate' => row['Rate'].to_s,
        'Property Valuation' => y.to_s,
        'Loan Date' => row['Loan Date'],
        'Outstanding Balance' => x.to_s,
        'Loan Size' => loanSize.to_s,
        'Coins' => coins.to_s,
        'Arrears' => row['Arrears'].to_s,
        'LTV' => row['LTV'].to_s,
        'LTV_40' => row['LTV_40'].to_s
      }

      ing = BuildIngest(uniqueId, row['LAT'], row['LON'], kind, attrs);
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
    # puts "3 - arrItems size: " + arrItems.size.to_s
    PokeProtein(Protein.new(['sluice', 'prot-spec v1.0', 'topology', 'add' ], { 'topology' => arrItems }))
    puts 'Loans loaded: ' + uniqueItems.size.to_s
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
puts theTime

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
