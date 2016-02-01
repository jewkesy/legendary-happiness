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

  $.getJSON('/twitter/getuser/NoGarlicNoOnion', function(data) {
    console.log(data);

    $('#userimage').attr("src", data.profile_image_url);

    tableContent += '<tr>';
    
    tableContent += '<td>' + data.name + '</td>'
    tableContent += '<td>' + data.screen_name + '</td>';
    tableContent += '<td>' + data.location + '</td>';
    tableContent += '<td>' + data.description + '</td>';
    tableContent += '<td>' + data.entities.url.urls[0].expanded_url + '</td>';

    tableContent += '</tr>';

    $('#userList tbody').html(tableContent);
  });
}