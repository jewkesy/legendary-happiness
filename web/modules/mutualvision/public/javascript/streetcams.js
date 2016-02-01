$(document).ready(function () {

  var MOVIE_POOL = 'tcp://localhost/movie';
  var VID_SPEED = 1.0;

  function setVidSpeed() {
    Plasma
    .Hose(MOVIE_POOL)
	.Deposit({ descrips: ['movie', 'set-play-speed'],
               ingests: { 'rate': VID_SPEED } });
  }

  // Handles the play button
  $("#rewind").click(function(e) {
    e.preventDefault();
    if (VID_SPEED >= 0.0)
	VID_SPEED = -1.0;
    else
	VID_SPEED = VID_SPEED-1.0;
    setVidSpeed();
  });

  // Handles the play button
  $("#play").click(function(e) {
    e.preventDefault();
    VID_SPEED = 1.0;
    setVidSpeed();
  });

  // Handles the play button
  $("#pause").click(function(e) {
    e.preventDefault();
    VID_SPEED = 0.0;
    setVidSpeed();
  });

  // Handles the play button
  $("#ff").click(function(e) {
    e.preventDefault();
    if (VID_SPEED <= 0.0)
      VID_SPEED = 1.0;
    else
      VID_SPEED = VID_SPEED+1.0;
    setVidSpeed();
  });

});
