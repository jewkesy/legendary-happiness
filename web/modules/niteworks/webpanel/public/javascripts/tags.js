var words = [
  {text: "Lorem", weight: 13},
  {text: "Ipsum", weight: 10.5},
  {text: "Dolor", weight: 9.4},
  {text: "Sit", weight: 8},
  {text: "Amet", weight: 6.2},
  {text: "Consectetur", weight: 5},
  {text: "Adipiscing", weight: 5}
];

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
		$('#keywords2').jQCloud(words);
 	});
});
