require 'optparse'
require 'metabolizer'

include Plasma

class Clicky < Metabolizer
  attr_accessor :verbose
  attr_accessor :outpool

  @@webURl = "http://localhost:7787/sluice/niteworks/"

  def initialize(*hoses)
    puts "starting Clicky daemon" if @verbose
    super(*hoses)
    @verbose = false
    @outpool = ''
    @descrips = ['sluice', 'prot-spec v1.0', 'psa', 'poked-it']
    @outdescrips = ['sluice', 'prot-spec v1.0', 'request', 'web' ]
    appendMetabolizer(@descrips) { |p| receive p }
  end

  def receive(p)
    ing = p.ingests
    puts "Got click protein from sluice" if @verbose

    if ing['id'].nil?
      puts "Id is empty, node was not clicked" if @verbose
      return
    end
# puts ing
    if ing['kind'] == 'tweet_blue' || ing['kind'] == 'tweet_green'

      if (ing['attrs']['media'].length > 0)
        ingests = {'windshield' => [{
          'name' => 'dashboard',
          'feld' => 'left',
          'loc' => [0,0],
          'size' => [1.0, 1.0],
          'url' =>  'http://localhost:3000/?id=' + ing['attrs']['tweetId']
          },  {
          'name' => 'photos',
          'feld' => 'right',
          'loc' => [-0.25,-0.25],
          'size' => [0.25, 0.25],
          'url' => ing['attrs']['media']
          }]}



      else  
        ingests = {'windshield' => [{
          'name' => 'dashboard',
          'feld' => 'left',
          'loc' => [0,0],
          'size' => [1.0, 1.0],
          'url' =>  'http://localhost:3000/?id=' + ing['attrs']['tweetId']
          },  {
          'name' => 'photos',
          'feld' => 'right',
          'loc' => [-2,-2],
          'size' => [0.25, 0.25],
          'url' => ''
          }]}

      end
        

        hose = Pool.participate @outpool
        hose.deposit(Protein.new(@outdescrips, ingests))
        hose.withdraw()
        puts ("Web panel request sent") if @verbose
    end 
  end
end

pool = 'sluice-to-edge'
outpool = 'edge-to-sluice'

verbose = true
respire = 0.1

optparse = OptionParser.new do |opt|
  opt.on('--pool=MANDATORY', '-p', String, "Input Pool (#{pool})") { |x| pool = x }
  opt.on('--outpool=MANDATORY', '-o', String, "Output Pool (#{outpool})") { |x| outpool = x }
  opt.on('--respire=MANDATORY',  '-r', Float, "Respire (#{respire})") { |x| respire = x }
end
optparse.parse!

if verbose
  puts "pool:    #{pool}"
  puts "outpool:    #{outpool}"
  puts "respire: #{respire}"
end

w = Clicky.new pool
w.outpool = outpool
w.verbose = verbose

trap 'SIGINT', proc {
  puts "Ending Clicky daemon" if w.verbose
  w.quit = true
}

w.metabolize respire
