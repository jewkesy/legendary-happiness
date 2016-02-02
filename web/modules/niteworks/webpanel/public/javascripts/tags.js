var words = [];

var keywordswords = [];

$( document ).ready(function() {

	$.getJSON('/mongo/gettagcounts', function(data) {
		//populateUserTable();
		console.log(data);
		$.each(data, function() {
			var tag = {
				text: this.word, 
				weight: this.count
			}

			words.push(tag);
		});

		$('#keywords').jQCloud(words);
 	});

 	$.getJSON('/mongo/getkeywordcounts', function(data) {
		//populateUserTable();
		console.log(data);
		$.each(data, function() {
			var tag = {
				text: this.keyword, 
				weight: this.count
			}

			keywordswords.push(tag);
		});

		$('#keywords2').jQCloud(keywordswords);
 	});
});
