require 'optparse'
require 'metabolizer'

include Plasma

class Hearty < Metabolizer
  attr_accessor :verbose
  def initialize(*hoses)
    puts "starting Hearty daemon" if @verbose
    super(*hoses)
    @verbose = false
    @outpool = 'edge-to-sluice'
    @descrips = ['sluice', 'prot-spec v1.0', 'psa', 'heartbeat']
    @sequence = 1
    appendMetabolizer(@descrips) { |p| receive p }
  end

  def receive(p)
    puts "Got heartbeat protein from sluice" if @verbose

    ing = p.ingests
    if ing['location'].nil?
      puts "ERROR: did not find location in ingest"
      return
    end

    url = 'http://localhost:7787/sluice/mutualvision/intro'

    openWebPage(url, 'intro', [0, 0], 'left', [1.0, 1.0]);

    puts "Introduction applied #{url} , I'm outta here"
    exit 1
  end

  def openWebPage(url, name, position, feld, size)
    puts "Loadig url: #{url}, name: #{name}, position: #{position}, feld: #{feld}, size: #{size}"

    outdescrips = ['sluice', 'prot-spec v1.0', 'request', 'web']


	ingests = {
        'windshield' => [
            {
                'feld' => feld,
                'loc' => position,
                'url' => url,
                'name' => name,
                'size' => size
            }
        ]
    }


    p = Protein.new(outdescrips, ingests)
    PokeProtein(p)


# %YAML 1.1
# %TAG ! tag:oblong.com,2009:slaw/
# --- !protein
# descrips:
# - sluice
# - prot-spec v1.0
# - request
# - web
# ingests:
#   windshield:
#   - name: devPageCent
#     feld: center
#     loc:
#     - 0
#     - 0
#     size:
#     - 1.0
#     - 1.0
#     url: http://192.168.25.188:7787/sluice/mutualvision/vernon

  end

  def PokeProtein(protein)
      hose = Pool.participate 'edge-to-sluice'
      hose.deposit(protein)
      hose.withdraw()
  end
end

pool = 'sluice-to-heart'

verbose = true
respire = 1.0

optparse = OptionParser.new do |opt|
  opt.on('--pool=MANDATORY', '-p', String, "Input Pool (#{pool})") { |x| pool = x }
  opt.on('--respire=MANDATORY',  '-r', Float, "Respire (#{respire})") { |x| respire = x }
end
optparse.parse!

if verbose
  puts "pool:    #{pool}"
  puts "respire: #{respire}"
end

h = Hearty.new pool
h.verbose = verbose

trap 'SIGINT', proc {
  puts "Ending Hearty daemon" if h.verbose
  h.quit = true
}

h.metabolize respire
