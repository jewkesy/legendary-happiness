function load_runner_config(runner) {

    var timeline = runner.timeline;

    const slc_s = 'sluice';
    const prs_s = 'prot-spec v1.0';
    const req_s = 'request';
    const rmf_s = 'remove-all-fluoro'
    const zom_s = 'zoom';

    const gTr = [60.067292958450345, 17.301088335829764];
    const gBl = [47.822789556634376, -20.543592289221198];

    const webUrl = 'http://localhost:7787/sluice/mutualvision';

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

    function zoom_to_poi(zoom) {
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
        runner.bookmark(54.711976144614532, -2.792778845872681, 20.5); //zoom to UK
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

    function buildsocs() {
        runner.add_fluoroscopeWithBounds("BuildSoc", gTr, gBl);
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
    function stockport(){
        zoom_to_poi(600.0);
    }

    function withington(){
         runner.bookmark(53.428140552555668, -2.217003716524284, 10000);
    }

    function vernon() {
        runner.bookmark (53.410173,-2.157805, 20000, 2);
    }

    function alderleyEdge() {
        runner.bookmark(53.3023126,-2.2430807, 5000);
    }

    function england() {
        runner.bookmark(53.41413009, -1.28507016, 60);
    }

    function newcastle() {
        runner.bookmark(54.947322, -1.6046769, 930);
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
        showOtherLegend();
        buildsocs(); 
    }
    function scene02() {
        vernonStory(false);
    }
    function scene03() {
        clear();
        england();
        setTimeout(function(){
            introducers();
            branches();
        }, 500);        
        showOtherLegend();
    }
    function scene04() {
        newcastle();
        setTimeout(function(){
            customers();
            showCustomersLegend();
        }, 1000);    
    }
    function scene05() {
        resetScenerio()
        
        setTimeout(function(){
            blankCustomers();
            showCustomersLegend();
        }, 2000);
    }
    function scene06() {
        clear();
        withington();
        setTimeout(function(){
            customers();
            ratings();
        }, 500);
        
        showRatingsLegend();
        showCustomersLegend();
        bringWebToFront();
    }
    function scene07() {
        clear();
        burnage();
        setTimeout(function(){
            loans();
        }, 500);
        showLoansLegend(); 
        bringWebToFront();
    }
    function scene08() {
        clear();
        stockport();
        setTimeout(function(){
            loans();
            arrears();
        }, 500);
        showLoansLegend();
        showArrearsLegend();  
        bringWebToFront();  
    }
    function scene09() {
        clear();
        national();
        setTimeout(function(){
            rates();
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
        'a0scene1': ['Clear > BuildSocs', scene01],
        'a0scene2': ['Vernon', scene02],
        'a0scene3': ['Clear > Intros, Branches', scene03],
        'a0scene4': ['Newcastle > Customers', scene04],
        'a0scene5': ['Clear > Build Customers', scene05],
        'a0scene6': ['Clear > Withington > Ratings', scene06],
        'a0scene7': ['Clear > Burnage > Loans', scene07],
        'a0scene8': ['Clear > Stockport > Loans, Arrears', scene08],
        'a0scene9': ['Clear > UK > Rates', scene09],
        'a0scene10': ['Clear > LTV > M6/M64', scene10],
        'a0scene11': ['', scene11],
        'a0scene12': ['', scene12],

        'act1': ['Zooms', national],
        'a1scene1': ['Stockport', stockport],
        'a1scene2': ['Withington', withington],
        'a1scene3': ['Vernon', vernon],
        'a1scene4': ['Alderley Edge', alderleyEdge],
        'a1scene5': ['England', england],
        'a1scene6': ['Newcastle', newcastle],
        'a1scene7': ['Burnage', burnage],
        'a1scene8': ['Lichfield', lichfield],
        'a1scene9': ['Prestatyn', prestatyn],
        'a1scene10': ['Hazel Grove', hazelGrove],
        'a1scene11': ['M6 / M64', m6_m64],

        'act2': ['Lenses', showAllLenses],
        'a2scene1': ['Building Society HQs', buildsocs],
        'a2scene2': ['Branches', branches],
        'a2scene3': ['Introducers', introducers],
        'a2scene4': ['Customers', customers],
        'a2scene5': ['Businesses', businesses],
        'a2scene6': ['Loans', loans],
        'a2scene7': ['Arrears', arrears],
        'a2scene8': ['Ratings', ratings],
        'a2scene9': ['Loan to Value / Stress 40%', ltv],
        'a2scene10': ['Customer Rates', rates],
        'a2scene11': ['Counties', demographics],
        'a2scene12': ['Blank Customers', blankCustomers],

        'act3': ['POIs', clear],
        'a3scene1': ['Vernon', vernonStory],
        'a3scene2': ['Cluster', clusterStory],
        'a3scene3': ['Good / Bad Customers', goodBadStory],
        'a3scene4': ['Stress Test', stressTest],
        
        'act4': ['Web Panels', showAllWeb],
        'a4scene1': ['Introduction', showIntro],
        'a4scene2': ['Butler Guide', butler],
        'a4scene3': ['Social Dashboard', social],
        'a4scene4': ['Legends', showLegends],
        
        'a4scene7': ['Bring To Front', bringWebToFront],
        'act5': ['CLEAR', clear],
        'a5scene1': ['Web Panels', clearWebPanels],
        'a5scene2': ['Vernon', clearVernonWebPanels],
        'a5scene4': ['Reset', reset],
        'a5scene7': ['Start Auto', toggleAuto],
    }

    // this forces a refresh of sluice admin so might want to toggle this later
    //setInterval(bringWebToFront, 2000);

    return runner_object;

}