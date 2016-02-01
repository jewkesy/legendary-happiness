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
    $('#username').html(data[0].twitter.user.name);
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
    color: '#f00'
  })

  $.getJSON('/twitter/getuserfriends/' + screenname, function(data) {

    var nodeCount = 1;

    $.each(data.ids, function() {
      var tweetuserid = parseInt(this);
      $.getJSON('/mongo/gettweetuser/' + tweetuserid, function(data2) {
        if(data2.length !=0)
        {
            s.graph.addNode({
              // Main attributes:
              id: 'n' + nodeCount,
              label: data2[0].twitter.user.screen_name + ' : ' + data2[0].twitter.user.followers_count,
              // Display attributes:
              x: Math.round(Math.random()*100) + 1,
              y: Math.round(Math.random()*100) + 1,
              size: Math.log(data2[0].twitter.user.followers_count),
              color: '#f00'
            }).addEdge({
              id: 'e' + (nodeCount-1),
              // Reference extremities:
              source: 'n' + (nodeCount-1),
              target: 'n' + nodeCount
            });

            nodeCount = nodeCount + 1;

            s.refresh();
        }

      });
    });

  });
}