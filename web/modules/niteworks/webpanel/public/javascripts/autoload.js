var maxid = '694614294936313900';
var recordCount = 0;

$( document ).ready(function() {
	var myVar = setInterval(saveTweets, 20000);
});

function saveTweets()
{
	console.log('MaxId:' + maxid);

	$.getJSON('/twitter/gettweets/:maxid', function(data) {
		
		maxid = data.statuses[data.statuses.length -1].id;

		$.each(data.statuses, function() {

			$.ajax({
				type: 'POST',
				data: this,
				url: '/mongo/savetweet',
				dataType: 'JSON'
			}).done(function( response ) {

				//Check for successful (blank) response
				if (response.msg === '') {
					recordCount = recordCount + 1;
					$('#numRecords').html(recordCount);
				}
				else {

					//If something goes wrong, alert the error message that our service returned
					alert('Error: ' + response.msg);
				}
			});
		});

		console.log('Next MaxId:' + maxid);
		$('#nextMaxId').html('Next Max Id:' + maxid);

 	});
}
