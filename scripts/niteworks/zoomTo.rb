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

    # zoomTo(51.279121, -0.769756, 22000)  #Farnborough
    # zoomTo(54.711976144614532, -2.792778845872681, 20.5, 10)  #UK
#    zoomTo(48.9267902, 2.3308999, 20, 10) # Paris Attacks
    #
    zoomTo(20.201122363199918, 23.704901015773963, 1.9486890091833518)


    puts "Zoom To applied, I'm outta here"
    exit 1
  end

  def zoomTo(lat, lon, zoomLevel, speed = 5.0)
    puts "Zooming to #{lat}, #{lon}, #{zoomLevel}"

    outdescrips = ['sluice', 'prot-spec v1.0', 'request', 'zoom']

    ingests = {
        'lat' => lat,
        'lon' => lon,
        'level' => zoomLevel,
        'interp-time' => speed
    }
    p = Protein.new(outdescrips, ingests)
    PokeProtein(p)
  end

  def PokeProtein(protein)
      hose = Pool.participate 'edge-to-sluice'
      hose.deposit(protein)
      hose.withdraw()
  end
end

pool = 'sluice-to-heart'

verbose = true
respire = 0.1

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
