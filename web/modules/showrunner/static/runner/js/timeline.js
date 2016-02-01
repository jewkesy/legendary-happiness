
function Timeline(slider){
    const TO_SLUICE = 'tcp://localhost/edge-to-sluice';
    const FROM_SLUICE = 'tcp://localhost/sluice-to-heart';

    const TIME_CHANGE = ['sluice', 'prot-spec v1.0', 'request', 'set-time'];

    function fmt_date(x) {
    if (undefined != x) {
        var d = new Date(x * 1000);
        // console.log(d.toString());
        // console.log(d);
        // console.log(x);
        return d.toString();
    } else {
        console.log('Whatever');
        return 'Unknown';
    }
    }

    var minimum_time = 0.0, maximum_time = 0.0, cur_time = 0.0;
    var rate = 1.0;

    function time_change(ing) {
    Plasma
        .Hose(TO_SLUICE)
        .Deposit ({ descrips : TIME_CHANGE,
            ingests  : ing });
    }

    function sliderchange(evt) {
        time_change({ pause: false, time: parseInt(slider.attr('value')), rate: rate });
    }

    //timeslider event listeners
    slider.change(function(evt){sliderchange(evt)});
    document.getElementById('range-set').addEventListener("input",
        function(evt){
            sliderchange(evt)
        }
    );

    Plasma
    .Hose (FROM_SLUICE)
    .Match (['sluice', 'prot-spec v1.0', 'psa', 'heartbeat'])
    .Await (function (p) {
        $('#time-rate').text(rate = p.ingests.time.rate);
        $('#time-current').text(fmt_date(cur_time = p.ingests.time.current));
        slider.attr('value', cur_time);
        if (undefined != p.ingests.time.min) {
            // minimum_time = p.ingests.time.min;
            $('#time-minimum').text(fmt_date(slider.attr('min')));
        }
        if (undefined != p.ingests.time.max) {
            // maximum_time = p.ingests.time.max
            $('#time-maximum').text(fmt_date(slider.attr('max')));
        }
    });

    var masterTime = {};

    $.ajax({
        url: "static/runner/js/demo_time.json",
        async: false,
        dataType: 'json',
        success: function (data) {
            for (var key in data) {
                masterTime[key] = data[key];
            }
            console.log("setting master time to ", masterTime);
        }
    });

    function timeStart() { return masterTime.start_time + 1200; }
    function monthlyEnd() { return masterTime.monthly_end - 1200; }
    function dailyStart() { return masterTime.daily_start + 1200; }
    function dailyEnd() { return masterTime.daily_end - 1200; }
    function hourlyStart() { return masterTime.hourly_start + 1200; }
    function hourlyEnd() { return masterTime.hourly_end - 1200; }

    this.setLiveTime = function(){
        //TODO: Figure out how to disable the slider
        //tried slider.slider( "option", "disabled", true );
        //and slider.slider("disable"); and a few others
        //with no luck
        time_change({'live': true, 'rate': 1});
    }

    this.setTimeRangeMonthly = function(){
        slider.attr('min', timeStart());
        slider.attr('max', monthlyEnd());
        slider.attr('value', timeStart());
        slider.change();
    };
    this.setTimeRangeDaily = function(){
        var min_time = dailyStart();
        var max_time = dailyEnd();
        // var max_time = min_time + 86400;
        slider.attr('min', min_time);
        slider.attr('max', max_time);
        slider.attr('value', min_time + (max_time - min_time) / 2.0);
        slider.change();
    };
    this.setTimeRangeHourly = function(){
        var min_time = hourlyStart();
        var max_time = hourlyEnd();
        // var max_time = min_time + 3600;
        slider.attr('min', min_time);
        slider.attr('max', max_time);
        slider.attr('value', min_time + (max_time - min_time) / 2.0);
        slider.change();
    };

    return this;
};
