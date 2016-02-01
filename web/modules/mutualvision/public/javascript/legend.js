$(document).ready(function(){
	(function showBoxes(elem){
	  elem.slideDown('fastest',function(){
	    $(this).next().length && showBoxes($(this).next());
	  });
	})( $("div.box:first") );
});