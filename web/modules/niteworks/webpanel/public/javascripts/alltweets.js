$( document ).ready(function() {

	$.getJSON('/mongo/getalltweets', function(data) {
		
		var tweetsHtml;

		$.each(data, function() {

			tweetsHtml += "<tr><td>" + this.id + "</td><td>" + this.created_at + "</td><td>" + this['user[name]'] + "</td><td>" + this.text + "</td><tr>"

		});

		$('#allTweets').html(tweetsHtml)

 	});
});
