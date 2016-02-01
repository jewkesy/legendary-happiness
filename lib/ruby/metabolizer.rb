# This file is called metabolizer.rb.  It contains the class Metabolizer.

require 'Pool'
include Plasma

# Metabolizer metabolizes proteins from a pool based on matching descrips.  The
# descrips may include :anything to allow the metabolizer to match any value for
# that descrip.
# 
# ==== Usage
#
#   hose = Pool.participate('poolname')
#   m = Metabolizer.new(hose)
#   m.appendMetabolizer(['descrip1', 'descrip2', :anything]) do |p|
#     # process protein p here
#   end
#   m.metabolize(0.1)
class Metabolizer
  attr_accessor :gang
  attr_accessor :quit
  # Creates a new Metabolizer.
  # ==== Arguments  
  # * +hoses+ - One or more pool name strings.  A hose will be created for each
  # pool name.
  # 
  # ==== Returns  
  # * A new Metabolizer.
  def initialize(*hoses)
    @gang = HoseGang.new
    hoses.each { |hose| @gang.add_tributary hose }
    @metabolizers = []
    @quit = false
  end

  # Stops the metabolize loop.
  def stop
    @quit = true
  end

  # Gets a hose with the name matching a pool name.
  # ==== Arguments  
  # * +name+ - Name of the pool
  # 
  # ==== Returns  
  # A Hose.
  def getHose(name)
    @gang.tributaries.detect { |x| x.pool_name == name }
  end

  # Adds a metabolizer.
  # ==== Arguments  
  # * +descrips+ - Descrips to match for the metabolizer
  # * +block+ - Code block of the metabolizer
  # 
  # ==== Returns  
  # * A Hose.
  def appendMetabolizer(descrips, &block)
    @metabolizers << [ descrips, block ]
  end

  # Matches two descrip values.
  # ==== Arguments  
  # * +expected+ - Expected descrip value.  The value of :anything will match any value positively.
  # * +descrips+ - Descrip value to match
  # 
  # ==== Returns  
  # true or false
  def descrips_match(expected, descrips)
    begin
      expected.zip(descrips).collect {
        |x, y| (x == :anything || x == y) }.inject(true) {
        |x, y| x && y }
    rescue TypeError => te
      puts "TypeError: #{te}"
    end
  end

  # Helper method for metabolizer.  This method would not be directly used. 
  def metabolize1(protein)
    d = protein.descrips.emit
    @metabolizers.each do |descrips, block|
      block.call protein if descrips_match(descrips, d)
      break if @quit
    end
  end

  # This method begins metabolizing proteins.  This method does not return until
  # stop is called.
  # ==== Arguments  
  # * +timeout+ - Wait value that the metabolize loop uses to sleep.  Defaults to 1.0 second.
  # * +startup_block+ - Optional code block to execute at the start of this method.
  def metabolize(timeout = 1.0, &startup_block)
    startup_block.call(self) if startup_block
    until @quit do
      protein = @gang.next timeout
      metabolize1(protein) if protein
    end
  end
end

# Use this method to trap the SIGINT, or System Exit signal.
# ==== Arguments  
# * +metabolizer+ - Metabolizer to stop
# * +block+ - Optional code block to execute at the start of this method.
# ==== Usage
#  trap_sigint(z) do
#    puts "Ending daemon"
#  end
def trap_sigint(metabolizer, &block)
  trap 'SIGINT', proc {
    block.call if block
    metabolizer.stop
  }
end
