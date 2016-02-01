$(document).ready(function(){
	runIntro();

	// $("#step2").show();
});

function runIntro() {
	showTitle();
}

function showTitle() {
	$(".titleText").fadeIn(1000, function() {
		setTimeout(function() {
			showStep1();
		}, 1000);
	});
}

function showTitleByWord(className) {
	var $el = $("." + className + ":first"), text = $el.text(), words = text.split(" ");
	var html = "";
	for (var i = 0; i < words.length; i++) {
	    html += "<span>" + words[i] + " </span>";
	};
	$el.html(html).children().hide().each(function(i){
	  $(this).delay(i*300).fadeIn(500);
	});
}

function showStep1() {
	// console.log('step 1');
	$("#step1").fadeIn(1000, function() {
		setTimeout(function() {
			$("#step1").fadeOut(1000, showStep2);
		}, 4000);
	})
}

function showStep2() {
	// console.log('step 2');
	$("#step2").fadeIn(1000, function() {
		setTimeout(function() {
			$("#step2").fadeOut(1000, showStep3);
		}, 4000);
	})
}

function showStep3() {
	// console.log('step 3');
	$("#step3").fadeIn(1000, function() {
		setTimeout(function() {
			$("#step3").fadeOut(1000, showStep4);
		}, 4000);
	})
}

function showStep4() {
	// console.log('step 4');
	$("#step4").fadeIn(1000, function() {
		setTimeout(function() {
			$("#step4").fadeOut(1000, showStep5);
		}, 4000);
	})
}

function showStep5() {
	// console.log('step 5');
	$("#step5").fadeIn(1000, function() {
		setTimeout(function() {
			$("#step5").fadeOut(1000, showStep6);
		}, 4000);
	})
}

function showStep6() {
	// console.log('step 6');
	$("#step6").fadeIn(1000, function() {
		setTimeout(function() {
			$("#step6").fadeOut(1000, resetThings);
		}, 4000);
	})
}

function resetThings() {
	// console.log('reseting');
	runIntro();
}
