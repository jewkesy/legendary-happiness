defmodule Tweets do
    require Poison
    
    @outputFilename "/Users/jb/code/legendary-happiness/share/niteworks/elixir/tweets/data/output/test_file.json"
    @interactions "interaction"
    @twitter "twitter"
    @delivered_at "delivered_at"
    @outputPath "/Users/jb/code/legendary-happiness/share/niteworks/elixir/tweets/data/output2"
    
    
    @doc """
    Gets the file list to parse
    """
    def getFileList(path) do
        Path.join(path, "*.json") |> Path.wildcard
    end
    
    @doc """
    Gets the data from a file
    """
    def get_data(tweets) do
        Enum.each(tweets, fn(tweet) ->
            spawn(fn() -> 
                extractInteractions tweet
            end)
        end)
        #Enum.map(tweets, &extractInteractions/1)
    end
 
    def extractInteractions(filename) do 
        File.open! filename, fn(pid) ->
            fileData = IO.read(pid, :all) |> Poison.decode |> elem 1
            
            # write the data to a file.
            File.write(filename |> getOutputFilename, fileData |> Poison.encode |> elem 1)
        end
    end
    
    defp getOutputFilename(inputFilename) do
        Path.join(@outputPath, inputFilename |> Path.basename)
    end
end

defmodule TweetsActor do
    Use ExActor
    
    defcall getData(tweets) do
        Enum.each(tweets, &extractInteractions/1)
    end
    
    def extractInteractions(filename) do 
        File.open! filename, fn(pid) ->
            fileData = IO.read(pid, :all) |> Poison.decode |> elem 1
            
            # write the data to a file.
            File.write(filename |> getOutputFilename, fileData |> Poison.encode |> elem 1)
        end
    end
    
    def start_pool do
        {:ok, pool} = :poolboy.start(
            worker_module: TweetsActor, size: 0, max_overflow: 5
        )
        
        pool
    end
    
    def pooled_tweeting(pool, x) do
        :poolboy.transaction(pool, fn(pid) ->
            TweetsActor.getData(pid, x)
        end)
    end
end