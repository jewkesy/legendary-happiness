defmodule TweetsTest do
  use ExUnit.Case
  doctest Tweets
  
  @tweet_file "/Users/jb/code/legendary-happiness/share/niteworks/elixir/tweets/data/input/tweets1447407326198.json"
  @tweets_path "/Users/jb/code/legendary-happiness/share/niteworks/elixir/tweets/data/input"
  
  test "Get file list" do
    assert Tweets.getFileList(@tweets_path) |> Enum.count == 8650
  end
  
  @tag timeout: 600000
  #test "Do one file" do
    #assert Tweets.extractInteractions @tweet_file
  #end
  #@tag timeout: 800000
  #test "Import tweets" do  
    #assert @tweets_path |> Tweets.getFileList |> Tweets.get_data |> Enum.count == 8650
  #end
  
end
