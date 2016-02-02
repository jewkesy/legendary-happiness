var nodes = [];
var s;

$( document ).ready(function() {
  s = new sigma('container');

  populateUserTable();
});

function populateUserTable()
{
  var tableContent = ''

  $.getJSON('/mongo/gettweet/' + $('#tweetid').val(), function(data) {

    $('#profilebackground').css('background-color', '#' + data[0].twitter.user.profile_background_color)
    $('#userimage').attr("src", data[0].twitter.user.profile_image_url);
    
    if(data[0].twitter.user.name.length > 15)
    {
      
      var name = data[0].twitter.user.name.substring(0, 15) + ' ' + data[0].twitter.user.name.substring(15, data[0].twitter.user.name.length);

      $('#username').html(name);
    }
    else
    {
      $('#username').html(data[0].twitter.user.name);
    }
    
    
    $('#screenname').html('@' + data[0].twitter.user.screen_name);
    $('#location').html(data[0].twitter.user.location);
    $('#description').html(data[0].twitter.user.description);
    $('#tweets').html(data[0].twitter.user.statuses_count);
    $('#followers').html(data[0].twitter.user.followers_count);
    $('#following').html(data[0].twitter.user.friends_count);
    $('#tweetuser').html(data[0].twitter.user.name + ' ');
    $('#tweetscreenname').html('@' + data[0].twitter.user.screen_name + ' . ');

    var date = new Date(parseInt(data[0].twitter.timestamp_ms));

    $('#tweetdate').html(date.toString("MMM dd"));
    $('#tweet').html(data[0].twitter.text)

    populateNetwork(data[0].twitter.user.screen_name);

  });
}

function populateNetwork(screenname)
{

  s.graph.addNode({
    // Main attributes:
    id: 'n0',
    label: screenname,
    // Display attributes:
    x: 0,
    y: 0,
    size: 2,
    color: '#0084B4'
  })

  $.getJSON('/twitter/getuserfriends/' + screenname, function(data) {

    var nodeCount = 1;

    $.each(data.ids, function() {
      var tweetuserid = parseInt(this);
      $.getJSON('/mongo/gettweetuser/' + tweetuserid, function(data2) {
        if(data2.length !=0)
        {
            var randomX = Math.round(Math.random()*100) + 1;
            var randomY = Math.round(Math.random()*100) + 1;

            if(randomX % 2)
            {
              randomX = 1 - randomX
            }

            if(randomY % 2)
            {
              randomY = 1 - randomY
            }

            s.graph.addNode({
              // Main attributes:
              id: 'n' + nodeCount,
              label: data2[0].twitter.user.screen_name + ' : ' + data2.length,
              // Display attributes:
              x: randomX,
              y: randomY,
              size: data2.length,
              color: '#0084B4'
            }).addEdge({
              id: 'e' + (nodeCount-1),
              // Reference extremities:
              source: 'n0',
              target: 'n' + nodeCount
            });

            nodeCount = nodeCount + 1;

            s.refresh();
        }

      });
    });

  });
}