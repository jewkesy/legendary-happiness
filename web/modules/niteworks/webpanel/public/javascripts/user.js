var nodes = [];

$( document ).ready(function() {
  var data = {
    "nodes": [
      {
        "id": "n0",
        "label": "A node",
        "x": 0,
        "y": 0,
        "size": 3
      },
      {
        "id": "n1",
        "label": "Another node",
        "x": 3,
        "y": 1,
        "size": 2
      },
      {
        "id": "n2",
        "label": "And a last one",
        "x": 1,
        "y": 3,
        "size": 1
      }
    ],
    "edges": [
      {
        "id": "e0",
        "source": "n0",
        "target": "n1"
      },
      {
        "id": "e1",
        "source": "n1",
        "target": "n2"
      },
      {
        "id": "e2",
        "source": "n2",
        "target": "n0"
      }
    ]
  };

  s = new sigma({
    graph: data,
    container: 'container',
    settings: {
      defaultNodeColor: '#ec5148'
    }
  });

  populateUserTable();
});

function populateUserTable()
{
  var tableContent = ''

  $.getJSON('/mongo/gettweet/' + $('#tweetid').val(), function(data) {
    console.log(data[0]);

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
  $.getJSON('/twitter/getuserfriends/' + screenname, function(data) {
    console.log(data);

    $.each(data.ids, function() {
      var tweetuserid = parseInt(this);
      $.getJSON('/mongo/gettweetuser/' + tweetuserid, function(data) {
        if(data.length !=0)
        {
          console.log(data);
        }
      });
    });

  });
}