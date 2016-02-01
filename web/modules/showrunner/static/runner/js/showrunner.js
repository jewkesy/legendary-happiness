function load_runner_config(runner) {

    var timeline = runner.timeline;

    const slc_s = 'sluice';
    const prs_s = 'prot-spec v1.0';
    const req_s = 'request';
    const rmf_s = 'remove-all-fluoro'
    const zom_s = 'zoom';

    const gTr = [79.388589, 176.251545];
    const gBl = [-66.886628, -176.586033];

    const webUrl = 'http://localhost:7787/sluice/niteworks';

    var timerInterval = null;

    //var timeline = new Timeline($('#range-set'));

    // initialize time range
  //  timeline.setTimeRangeMonthly();
    function add_sticky(stickytext){
        //send the sticky to sluice
        runner.PlasmaDeposit('tcp://localhost/stickie-notes',
            {
                descrips: ['sluice', 'prot2.0', 'stickie', 'create'],
                ingests: {
                    'text': stickytext
                }
            });
    };

    function open_webpage(url, name, loc, feld, size){
        if(url.length > 1 && url.substring(0,1) != '/') {
            url = '/' + url;
        }

        if (runner.fluoroAlreadyLoaded(name)) {
            console.log(name + ' already loaded')
            // open_webpage('/intro', 'intro', [0,0], 'left');
            runner.EdgeToSluiceDeposit({
                descrips: [runner.slc_s, runner.prs_s, runner.req_s, 'web'],
                ingests: {
                    'windshield': [
                        {
                            'feld': feld,
                            // 'size': size,
                            'loc': loc,
                            'url': webUrl + url,
                            'name': name
                        }
                    ]
                }
            });
        }
        else {
            // open_webpage('/intro', 'intro', [0,0], 'left', [1.0, 1.0]);
            console.log(name + ' first load')
            runner.EdgeToSluiceDeposit({
                descrips: [runner.slc_s, runner.prs_s, runner.req_s, 'web'],
                ingests: {
                    'windshield': [
                        {
                            'feld': feld,
                            // 'size': size,
                            'loc': loc,
                            'url': webUrl + url,
                            'name': name
                        }
                    ]
                }
            });
        }

        return;
        runner.EdgeToSluiceDeposit({
            descrips: [runner.slc_s, runner.prs_s, runner.req_s, 'web'],
            ingests: {
                'windshield': [
                    {
                        'feld': feld,
                        // 'size': size,
                        'loc': loc,
                        'url': webUrl + url,
                        'name': name
                    }
                ]
            }
        });
    }

    function sacramento_store(){
        runner.EdgeToSluiceDeposit({
            descrips: [runner.slc_s, runner.prs_s, runner.req_s, 'new-fluoro-instance'],
            ingests: {
                'fluoro-config': {
                    "type": "texture",
                    "disable-notifications": true,
                    "ignore-movement": true,
                    "image-is-static": true,
                    "daemon": "sacramento_store",
                    "name": "sacramento_store",
                },
              'bl':
              [ 37.352752448819437,
                -121.82780487719724],
              'tr':
              [ 37.354150649504398,
                -121.82633358108198]
            }
        });
    }

    function los_angeles_store(){
        runner.EdgeToSluiceDeposit({
            descrips: [runner.slc_s, runner.prs_s, runner.req_s, 'new-fluoro-instance'],
            ingests: {
                'fluoro-config': {
                    "type": "texture",
                    "disable-notifications": true,
                    "ignore-movement": true,
                    "image-is-static": true,
                    "daemon": "los_angeles_store",
                    "name": "los_angeles_store",
                },
              'bl':
              [ 37.354332954083404,
                -121.82781377747068],
              'tr':
              [ 37.35569720498988,
                -121.82634248135545]
            }
        });
    }

    function old_sacramento_store(){
        url = 'http://'+location.host+'/retail/static/sacramento_store.png';
        open_webpage(url, 'sacramento_store', [0.25, -0.25], 'main', [0.25, 0.3]);
    }

    function old_los_angeles_store(){
        url = 'http://'+location.host+'/retail/static/los_angeles_store.png';
        open_webpage(url, 'los_angeles_store', [-0.25, -0.25], 'main', [0.25, 0.3]);
    }

    function zoom_to_poi(zoom) { 20, 10
        runner.bookmark(53.4175147, -2.1490619, zoom);
    }

    //////////////////
    /// The Script ///
    //////////////////

    /// Start
    function national(){
        //runner.clear_fluoroscopes();
        // timeline.setTimeRangeMonthly();
        //runner.bookmark(38.58, -95.14, 6.0); // zoom to full US
        runner.bookmark(48.9267902, 2.3308999, 10); //zoom to UK
        //runner.bookmark(52.7319666, -2.00421949, 30); //zoom to England
        //runner.clear_fluoroscopes();
    }
    function weather(){
        runner.add_fluoro_args("Weather", { bl: [35.42564587348253, -93.081400572219096],
                                     tr: [48.793361334157304, -60.13580315885789] });
    }
    function rates_heatmap(){
        runner.add_fluoroscopeWithBounds("Heatmap", gTr, gBl); // to be heat-map
    }
    function demographics(){
        runner.add_fluoroscopeWithBounds("Demographics", gTr, gBl); // to be state-level
    }

    function clear(){
        runner.clear_fluoroscopes();
    }

    function showAllLenses(){
        buildsocs();
        branches();
        introducers();
        customers();
        businesses();
        loans();
        arrears(); 
        ratings();
        ltv();
    }

    function showTweets() {
        runner.add_fluoroscopeWithBounds("Tweets", gTr, gBl);
    }

    function branches(){
        runner.add_fluoroscopeWithBounds("Branch", gTr, gBl);
    }
    function introducers(){
        runner.add_fluoroscopeWithBounds("Introducer", gTr, gBl);
    }
    function customers(){
        runner.add_fluoroscopeWithBounds("Customer", gTr, gBl);
    }
    function blankCustomers(){
        runner.add_fluoroscopeWithBounds("BlankCustomer", gTr, gBl);
    }
    function businesses(){
        runner.add_fluoroscopeWithBounds("Business", gTr, gBl);   
    }
    function loans(){
        runner.add_fluoroscopeWithBounds("loans", gTr, gBl);
    }
    function arrears(){
        runner.add_fluoroscopeWithBounds("Arrears", gTr, gBl);
    }
    function rates(){
        runner.add_fluoroscopeWithBounds("Heatmap", gTr, gBl);
    }
    function ratings(){
        runner.add_fluoroscopeWithBounds("Ratings", gTr, gBl);
    }
    function ltv(){
        runner.add_fluoroscopeWithBounds("LTV", gTr, gBl);
    }
    function stadeDeFrance(){
        runner.bookmark(48.9244627,2.3579705, 30000)
    }

    function lePetitCambodge(){
         runner.bookmark(48.8716804,2.3659606, 10000);
    }

    function rueDeLaFountaine() {
        runner.bookmark (48.868166,2.3715372, 20000, 2);
    }

    function laBelleEquipe() {
        runner.bookmark(48.8791313,2.3476176, 5000);
    }

    function boulevardVoltaire() {
        runner.bookmark(48.8713992,2.2599972, 15000);
    }

    function bataclan() {
        runner.bookmark(48.8630134,2.368421, 35000);
    }

    function burnage() {
        runner.bookmark(53.4307681,-2.2048089, 2500);
    }

    function lichfield() {
        runner.bookmark(52.6805815,-1.8264718, 1000);
    }

    function prestatyn() {
        runner.bookmark(53.3283773,-3.4152156, 2000);
    }
    function hazelGrove() {
        runner.bookmark(53.411433,-2.2100591, 7000);
    }
    function m6_m64() {
        runner.bookmark(53.393621983, -2.647538, 2670);
    }

    function butler() {
        open_webpage('/buildsoc', 'buildsoc', [0,-0.25], 'left', [0.5, 1.0]);
    }
    function social() {
        open_webpage('/dashboard', 'dashboard', [0,0.25], 'left', [0.5, 1.0]);
    }

    function vernonDetails() {
        // open_webpage('/vernon', 'vernon', [0,0], 'center', [0.99, 0.99]);
    }

    function showLegends() {
        // bringWebToFront();
        showArrearsLegend();
        showCustomersLegend();
        showLoansLegend();
        showOtherLegend();
        showRatingsLegend();
        showLtvLegend();
    }

    function showArrearsLegend(){
        open_webpage('/arrears', 'arrearsLegend', [0, 0.25], 'right', [0.25, 0.75]);
    }
    function showCustomersLegend(){
        open_webpage('/customers', 'customersLegend', [0, -0.25], 'right', [0.25, 0.75]);
    }
    function showLoansLegend(){
        open_webpage('/loans', 'loanLegend', [-0.52, 0.25], 'right', [0.25, 0.75]);
    }
    function showOtherLegend(){
        open_webpage('/legend', 'otherLegend', [-0.45, -0.25], 'right', [0.25, 0.75] );
    }
    function showRatingsLegend(){
        open_webpage('/ratings', 'ratingsLegend', [0, 0], 'right', [0.25, 0.75]);
    }
    function showLtvLegend(){
        open_webpage('/ltv', 'ltvLegend', [-0.225, 0], 'right', [0.25, 0.75]);
    }

    function showIntro() {
        if (runner.fluoroAlreadyLoaded('intro')) {
            open_webpage('/intro', 'intro', [0,0], 'left');
        }
        else {
            open_webpage('/intro', 'intro', [0,0], 'left', [1.0, 1.0]);
        }
    }
    function resetScenerio() {
        clear();
        national();
    }
    function scene01() {
        clear();
        stadeDeFrance();
    }
    function scene02() {
        lePetitCambodge();
    }
    function scene03() {
        clear();
        stadeDeFrance();
        setTimeout(function(){
           
        }, 500);        

    }
    function scene04() {
        rueDeLaFountaine();
        setTimeout(function(){
           
        }, 1000);    
    }
    function scene05() {
        laBelleEquipe()
        
        setTimeout(function(){

        }, 2000);
    }
    function scene06() {
        clear();
        boulevardVoltaire();
        setTimeout(function(){

        }, 500);
        
    }
    function scene07() {
        clear();
        bataclan();
        setTimeout(function(){

        }, 500);

    }
    function scene08() {
        clear();
        stadeDeFrance();
        setTimeout(function(){

        }, 500);
    }
    function scene09() {
        clear();
        bataclan();
        setTimeout(function(){

        }, 500);   
    }


    function scene10() {
        clear();
        m6_m64();
        setTimeout(function(){
            loans();
            ltv();
        }, 500);  
        showLtvLegend();
        showLoansLegend();
        bringWebToFront();
    }

    function scene11() {

    }
    function scene12() {
        
    }

    function vernonStory(clearThings) {
        if (!clearThings) { if (clearThings != false) clear() };

        vernon();
        setTimeout(function(){
            butler();
            social();
            //vernonDetails();
            buildsocs()  
        }, 2200);
    }

    function clusterStory() {
        clear();
        runner.bookmark(53.428461938553234, -2.2391374673299191, 5000, 2)
        setTimeout(function(){
            buildsocs();
            branches();
            introducers();
            customers();
            businesses();
            loans();
            arrears();
            rates();
        }, 2200);
    }

    function goodBadStory() {
        clear();
        runner.bookmark(53.380415079712478, -2.1141502833177306, 40000, 2)
        setTimeout(function(){
            customers();
            ratings();
            showRatingsLegend();
        }, 2200);
    }

    function stressTest() {
        clear();
        withington();
        setTimeout(function(){
            loans();
            ltv();
            showLoansLegend();
            showLtvLegend();
        }, 2200);
    }

    function clearVernonWebPanels() {
        open_webpage('', 'buildsoc', [-10, -10], 'left', [0.5, 1.0]);
        open_webpage('', 'dashboard', [-10, -10], 'left', [0.5, 1.0]);
    }

    function clearWebPanels() {
        open_webpage('', 'buildsoc', [-10, -10], 'left', [0.5, 1.0]);
        open_webpage('', 'dashboard', [-10, -10], 'left', [0.5, 1.0]);
        open_webpage('', 'arrearsLegend', [-10, -10], 'right', [0.25, 0.75]);
        open_webpage('', 'customersLegend', [-10, -10], 'right', [0.25, 0.75]);
        open_webpage('', 'loanLegend', [-10, -10], 'right', [0.25, 0.75]);
        open_webpage('', 'otherLegend', [-10, -10], 'right', [0.25, 0.75]);
        open_webpage('', 'ratingsLegend', [-10, -10], 'right', [0.25, 0.75]);
        open_webpage('', 'ltvLegend', [-10, -10], 'right', [0.25, 0.75]);
        open_webpage('', 'intro', [-10, -10], 'left', [0.25, 0.75]);
    }

    function clearFluoro() {
        runner.remove_fluoroscope('Introducer');
        runner.remove_fluoroscope('Demographics');
        runner.remove_fluoroscope('buildsoc');
    }

    /// Local
    function region_with_roundels(){
        // timeline.setTimeRangeDaily();
        zoom_to_poi(600.0);
        runner.clear_fluoroscopes();

        //runner.add_fluoro_args("Stores", {
        //    bl: [37.12263287745423, -122.54439185588053],
        //    tr: [37.591362921005468, -120.97498696636292],
        //});
    }

    /// Neighborhood
    function neighborhood(){
        runner.clear_fluoroscopes();
        // timeline.setTimeRangeHourly();
        runner.add_fluoroscope("Traffic");
        runner.add_fluoroscope("Stores");
        runner.bookmark (53.4175147, -2.1490619, 2643.6295626010865);
    }

    /// Store
    function store_level(){
        // timeline.setTimeRangeHourly();
        zoom_to_poi(80000.0); // zoom into/through store roof;
        runner.clear_fluoroscopes();
    }

    function oos_overlay(){
        runner.add_fluoroscope("OOS Overlay");
    }

    function paths(){
        runner.add_fluoroscope("Entity Paths");
        set_rate(30);
    }

    function rewind(){
        pause();
        runner.bookmark (37.35379845875557, -121.8251377211443, 150000, 1.0);

        setTimeout(function(){
            $.get('/retail/make_path_red', function(data) {});
            //jump to a known time, and go backwards
            // timeline.time_change({pause: false, time: 1383345723,  rate: -180});
            //play forwards again after a timeout
            setTimeout(function(){set_rate(20);}, 1500);
        }, 1250);
    }

    function camera_links(){
        runner.add_fluoroscope("CCTV Links");
    }

    function camera_feeds() {
        runner.add_fluoro_args("cctv",
                        {"fluoro-config": {"daemon": "camera-main",
                                           "type": "video",
                                           "video-pool": "camera-electronics"},
                         "id": "Electronics"});
        runner.add_fluoro_args("cctv",
                        {"fluoro-config": {"daemon": "camera-main",
                                           "type": "video",
                                           "video-pool": "camera-front-registers"},
                         "id": "Front Registers"});
        runner.add_fluoro_args("cctv",
                        {"fluoro-config": {"daemon": "camera-main",
                                           "type": "video",
                                           "video-pool": "camera-garden-registers"},
                         "id": "Garden Registers"});
    }

    function showrooming(){
        runner.add_fluoroscope("Showroom");
    }

    function register_zoom(){
        // timeline.setTimeRangeHourly();
        runner.clear_fluoroscopes();
        runner.add_fluoroscope("CCTV Links");
        // runner.bookmark(36.367358182188376, -94.22351588822958, 265497.10387835087);
        runner.bookmark(37.353741847028402, -121.82535467032046, 198610.99999999875);
        runner.add_fluoroscope("Registers");
    }
    function tripwire(){
        runner.add_fluoro_args("TripWire",
                        { bl: [37.35293344966172, -121.82684639044389],
                          tr: [37.354374286465514, -121.82355220806051] });
    }
    function queue_metrics(){
        runner.add_fluoro_args("Queue Metrics",
                        { bl: [37.3533, -121.8259],
                          tr: [37.3540, -121.8246] });
    }
    function set_rate(rate){
        runner.PlasmaDeposit('tcp://localhost/edge-to-sluice',
            {
                descrips: ['sluice', 'prot-spec v1.0', 'request', 'set-time'],
                ingests: {
                    'pause': false,
                    'rate': rate
                }
            });
    }

    function compare(){
        pause();
        zoom_to_poi(80000.0); // zoom into/through store roof;
    }

    function pause(){
        runner.PlasmaDeposit('tcp://localhost/edge-to-sluice',
            {
                descrips: ['sluice', 'prot-spec v1.0', 'request', 'set-time'],
                ingests: {
                    'pause': true
                }
            });
    }

    function getRandomInRange(from, to, fixed) {
        return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
        // .toFixed() returns string, so ' * 1' is a trick to convert to number
    }

    function goToRandom(){

        //53.4175147, -2.1490619

        var lat = getRandomInRange(51, 54, 3);
        var lon = getRandomInRange(-4, -1, 3)
        var zoom = getRandomInRange(10, 5000, 0);
        var speed = getRandomInRange(1, 5, 0);
        console.log('Going to ' + lat + ',' + lon + '@' + zoom)
        runner.bookmark(lat, lon, zoom, speed);
    }

    function toggleAuto() {
        //console.log(timerInterval)
        if (timerInterval) {
            stopAuto();
        }
        else{
            startAuto();
        }
    }

    function startAuto(){
        console.log('starting auto')

        $('#a1scene7').children(".label").text("Stop Auto");
        $('#a1scene7').addClass("makeRed");

        goToRandom();
        timerInterval = setInterval(function(){ 
            goToRandom();
        }, 8000);
    }
    function stopAuto(){
        $('#a1scene7').children(".label").text("Start Auto");
        $('#a1scene7').removeClass("makeRed");
        console.log('stopping auto')
        clearInterval(timerInterval);
        timerInterval = null;

    }

    function reset() {
        clear();
        national();
        showIntro();
    }

    function fullZoomOut(){
        // timeline.setTimeRangeMonthly();
        runner.bookmark(52.7319666, -2.00421949, 6.0);
    }
    function fullZoomIn(){
        // timeline.setTimeRangeHourly();
        runner.bookmark (53.4175147, -2.1490619, 2643.6295626010865);
    }

    function bringWebToFront(){
        var fluorder = ['Map', 'buildsoc', 'dashboard', 'vernon', 'arrearsLegend', 'customersLegend', 'otherLegend', 'loanLegend', 'ratingsLegend', 'ltvLegend', 'intro'];
        //var fluoros = runner.getFluoros();
        //console.log(fluoros);
        runner.reorder_and_send_sluice(fluorder)
    }

    function showAllWeb(){
        bringWebToFront();
        vernonDetails();
        butler();
        social();
        showLegends();
    }



   //return methods to call
    runner_object = {
        'act0': ['Scenerios', resetScenerio],
        'a0scene1': ['9:20 p.m.', scene01],
        'a0scene2': ['9:25 p.m.', scene02],
        'a0scene3': ['9:30 p.m.', scene03],
        'a0scene4': ['9:32 p.m.', scene04],
        'a0scene5': ['9:36 p.m.', scene05],
        'a0scene6': ['9:40 p.m.', scene06],
        'a0scene7': ['9:40 p.m.', scene07],
        'a0scene8': ['9:53 p.m.', scene08],
        'a0scene9': ['12:20 a.m. ', scene09],
        'a0scene10': ['', scene10],
        'a0scene11': ['', scene11],
        'a0scene12': ['', scene12],

        'act1': ['Zooms', national],
        'a1scene1': ['Stade de France', stadeDeFrance],
        'a1scene2': ['Le Petit Cambodge', lePetitCambodge],
        'a1scene3': ['Stade de France', stadeDeFrance],
        'a1scene4': ['Rue de la Fountaine au Roi', rueDeLaFountaine],
        'a1scene5': ['La Belle Equipe', laBelleEquipe],
        'a1scene6': ['Boulevard Voltaire', boulevardVoltaire],
        'a1scene7': ['Bataclan', bataclan],
        'a1scene8': ['Stade de France', stadeDeFrance],
        'a1scene9': ['French Police invade Bataclan', bataclan],
        'a1scene10': ['', null],
        'a1scene11': ['',null],

        'act2': ['Lenses', showAllLenses],
        'a2scene1': ['Twitter', showTweets],
        'a2scene2': ['', null],
        'a2scene3': ['', null],
        'a2scene4': ['', null],
        'a2scene5': ['', null],
        'a2scene6': ['', null],
        'a2scene7': ['', null],
        'a2scene8': ['', null],
        'a2scene9': ['', null],
        'a2scene10': ['', null],
        'a2scene11': ['', null],
        'a2scene12': ['', null],

        'act3': ['POIs', clear],
        'a3scene1': ['', null],
        'a3scene2': ['', null],
        'a3scene3': ['', null],
        'a3scene4': ['', null],
        
        'act4': ['Web Panels', showAllWeb],
        'a4scene1': ['Social Dashboard', social],
        'a4scene2': ['', null],
        'a4scene3': ['', null],
        'a4scene4': ['', null],
        
        'a4scene7': ['Bring To Front', bringWebToFront],
        'act5': ['CLEAR', clear],
        'a5scene1': ['Web Panels', clearWebPanels],
        'a5scene2': ['', null],
        'a5scene4': ['', reset],
        'a5scene7': ['Start Auto', toggleAuto],
    }

    // this forces a refresh of sluice admin so might want to toggle this later
    //setInterval(bringWebToFront, 2000);

    return runner_object;

}
