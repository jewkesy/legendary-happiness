
$(document).ready(function(){

    $('#stats').slideDown('slow', function(){
    	$('#activity').show('slow', function(){


	    	 $('#messages').show('slow', function(){

	    	 	$('.tiles').show(function(){
	    	 		$('.tile').each(function(){

					    $(this).slideDown('slow');
					});
	    	 	});

	    	 	$('#growth').slideDown('slow', function(){
	    	 		$('#brassband').slideDown('slowest', function(){
	    	 			$('#daryl').slideDown('slow', function(){
	    	 				$('#council').fadeIn('slowest');
	    	 			});
	    	 		});
	    	 	});
	    	 });
    	 });
    });
});

