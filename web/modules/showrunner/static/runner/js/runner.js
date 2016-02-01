$(document).ready(function() {

    // var timeline = new Timeline($('#range-set'));
    // // initialize time range
    // timeline.setTimeRangeMonthly();

    function EdgeToSluice() { return Plasma.Hose('edge-to-sluice'); }
    function SluiceToEdge() { return Plasma.Hose('sluice-to-edge'); }

    const slc_s = 'sluice';
    const prs_s = 'prot-spec v1.0';
    const req_s = 'request';
    const rmf_s = 'remove-all-fluoro'
    const zom_s = 'zoom';
    const flist_s = 'fluoroscopes';

    var desiredFluorder = ['Map','Demographics','Heatmap','Weather'];


    // Keep us up to date on the center of things.
    var center_lat = undefined, center_lon = undefined;
    var main_zoom = 0.0;
    var fluoro_list = [];
    SluiceToEdge()
        .Match([slc_s, prs_s, 'psa', 'atlas-view'])
        .Await(function(p) {
            var ing = p.ingests;
            center_lat = ing.lat_center;
            center_lon = ing.lon_center;
            main_zoom = ing.level;
        });
    SluiceToEdge()
        .Match([slc_s, prs_s, 'psa', 'fluoroscopes'])
        .Await(function(p) {
            var ing = p.ingests;
            //change the global
            fluoro_list = ing.fluoroscopes;
        });
    //Request a fluoroscope list to get one
    EdgeToSluice()
        .Deposit({ descrips: [slc_s, prs_s, req_s, flist_s],
                   ingests: {}}
        );

    Array.prototype.move = function (from, to) {
      this.splice(to, 0, this.splice(from, 1)[0]);
    };
    // Keep track of the current fluoroscope Z-order.
//    SluiceToEdge()
//        .Match([slc_s, prs_s, 'psa', 'fluoroscopes'])
//        .Await( function(p){
//                var fluoroscopes = p.ingests.fluoroscopes;
//                var curFluorder = [];
//                for(var f=0; f<fluoroscopes.length; ++f){
//                    curFluorder.push(fluoroscopes[f]['name']);
//                }
//                // console.log("old");
//                // console.log(curFluorder);
//                for(var i=0; i<desiredFluorder.length; ++i){
//                    // for(var j=0; j<curFluorder.length; ++j){
//                    // if(curFluorder.indexOf(desiredFluorder[i]) != null){
//                        if(curFluorder.indexOf(desiredFluorder[i]) >
//                            curFluorder.indexOf(desiredFluorder[i+1])){
//
//                            curFluorder.move(curFluorder.indexOf(desiredFluorder[i+1]),
//                                             curFluorder.indexOf(desiredFluorder[i]));
//                            // console.log("new");
//                            // console.log(curFluorder);
//                            reorder_and_send_sluice(curFluorder, fluoroscopes);
//                        }
//                    // }
//                }
//              return;
//    });
    function PlasmaDeposit(hose, msg) {
        Plasma.Hose(hose).Deposit(msg);
    }

    function EdgeToSluiceDeposit(msg) {
        EdgeToSluice().Deposit(msg);
    }

    function bookmark(lat, lon, level, interp) {
        if(interp == null){
            interp = 5.0;
        }
        EdgeToSluice()
            .Deposit({ descrips: [slc_s, prs_s, req_s, zom_s],
                       ingests: {
                           "lat": lat,
                           "lon": lon,
                           "level": level,
                           "interp-time": interp
                       }});
    };

    function add_sticky(stickytext){
        //send the sticky to sluice
        Plasma
            .Hose ('tcp://localhost/stickie-notes')
            .Deposit({
                descrips: ['sluice', 'prot2.0', 'stickie', 'create'],
                ingests: {
                    'text': stickytext
                }
            });
    };

    function update_fluoros_attrs(name, args) {
        //WARNING: Only updates, does not add
        for (var i=0; i < fluoro_list.length; i++) {
            if (fluoro_list[i].name == name) {
                //Update this fluoroscope
                var fluoro = fluoro_list[i];
                for (var j=0; j < fluoro.attributes.length; j++){
                    if (args.hasOwnProperty(fluoro.attributes[j].name)) {
                        var attr_name = fluoro.attributes[j].name;
                        fluoro.attributes[j] = args[attr_name];
                        fluoro.attributes[j].name = attr_name;
                    }
                }
                EdgeToSluice()
                    .Deposit({ descrips: [slc_s, prs_s, req_s, 'configure-fluoro'],
                               ingests: fluoro});
            }
        }
    }

    function add_fluoro_args(name, ing) {
        ing['name'] = name;
        EdgeToSluice()
            .Deposit({ descrips: [slc_s, prs_s, req_s, 'new-fluoro-instance'],
                       ingests: ing });
    }

    function fluoroAlreadyLoaded(name) {
        // console.log(fluoro_list)
         for (var i=0; i < fluoro_list.length; i++) {
            // console.log(fluoro_list[i])
            if (fluoro_list[i].name == name) {
                reorder_and_send_sluice([name]);
                return true;
            }
        }
        return false;
    }

    function add_fluoroscope(name) {
        if ($("#uniqueFluoros").attr('checked') && fluoroAlreadyLoaded(name)) return;

        EdgeToSluice()
            .Deposit({ descrips: [slc_s, prs_s, req_s, 'new-fluoro-instance'],
                       ingests: {"name":name}});
    }

    function add_fluoroscopeWithBounds(name, tr, bl) {
        if ($("#uniqueFluoros").attr('checked') && fluoroAlreadyLoaded(name)) return;

        EdgeToSluice()
            .Deposit({ descrips: [slc_s, prs_s, req_s, 'new-fluoro-instance'],
                       ingests: {"name":name, "tr":tr, "bl":bl}});
    }

    function remove_fluoroscope(name) {
        for (var i=0; i < fluoro_list.length; i++) {
            if (fluoro_list[i].name == name) {
                var fluoro = fluoro_list[i];
                console.log(fluoro)
                remove_fluoroById(fluoro.SlawedQID)
            }
        }
    }

    function remove_fluoroById(slawId) {
        EdgeToSluice()
            .Deposit({ descrips: [slc_s, prs_s, req_s, 'remove-fluoro-instance'],
                       ingests: {"SlawedQID": slawId}});
    }

    function clear_fluoroscopes() {
        EdgeToSluice()
            .Deposit({ descrips: [slc_s, prs_s, req_s, rmf_s],
                       ingests: {}});
    }

    function reorder_and_send_sluice(fluorder){
        fluoroscopes = fluoro_list;
        var len = fluorder.length;
        var sortedFluoros = [];
        for(var i=0; i<len; ++i){
            for(var j=0; j<fluoroscopes.length; ++j){
                if(fluorder[i] == fluoroscopes[j]['name']){
                    sortedFluoros.push(fluoroscopes[j]);
                }
            }
        }
        EdgeToSluice()
            .Deposit({ descrips:[slc_s, prs_s, req_s, 'reorder-z-axis'],
                       ingests:{"scopes":sortedFluoros}});
    }

    function getFluoros() {
        return fluoro_list;
    }

    //Share all the useful functions
    //TODO: Find a better way to do this
    var runner = {
        reorder_and_send_sluice: reorder_and_send_sluice,
        getFluoros: getFluoros,
        fluoroAlreadyLoaded: fluoroAlreadyLoaded,
        remove_fluoroscope: remove_fluoroscope,
        update_fluoros_attrs: update_fluoros_attrs,
        clear_fluoroscopes: clear_fluoroscopes,
        add_fluoroscope: add_fluoroscope,
        add_fluoroscopeWithBounds: add_fluoroscopeWithBounds,
        add_fluoro_args: add_fluoro_args,
        bookmark: bookmark,
     //   timeline: timeline,
        slc_s: slc_s,
        prs_s: prs_s,
        req_s: req_s,
        rmf_s: rmf_s,
        zom_s: zom_s,
        main_zoom: main_zoom,
        flist_s: flist_s,
        PlasmaDeposit: PlasmaDeposit,
        EdgeToSluiceDeposit: EdgeToSluiceDeposit
    }

    //////////////
    // Setup script buttons & functions
    //////////////
    var runner_config = load_runner_config(runner);
    var num_acts = 6;
    var num_scenes = 12;

    function _set_scene_button(button_config, target_name) {
        $(elem_id).click(function (evt) {
            evt.preventDefault();
            // console.log(target_name)
            button_config[1]();
        });
    }

    // Setup "main" buttons
    //TODO: Add playall button & method
    var valid_keys = ['fzin', 'fzout'];
    for (var act_i = 0; act_i <= num_acts; act_i++) {
        valid_keys.push('act'+act_i);
    }

    for (var i = 0; i < valid_keys.length; i++) {
        var key_name = valid_keys[i];
        var elem_id = '#' + key_name;
        var button_name = ''

        if (runner_config.hasOwnProperty(key_name)) {
            // runner_config has a function for key_name, bind it to an event
            var button_config = runner_config[key_name]
            button_name = button_config[0]
            _set_scene_button(button_config, key_name)
        }
        //Add button class
        $(elem_id).addClass('button');
        if (key_name.indexOf('act') > -1) {
            //set the act name
            $(elem_id).html('<div>'+button_name+'</div>')
        }
    }

    // Setup scene buttons
    for (var act_i = 0; act_i <= num_acts; act_i++) {
        for (var scene_i = 1; scene_i <= num_scenes; scene_i++) {
            //add a scene button
            var key_name = 'a' + act_i + 'scene' + scene_i
            var elem_id = '#' + key_name;

            if (runner_config.hasOwnProperty(key_name)) {
                // runner_config has a function for key_name, bind it to an event
                var button_config = runner_config[key_name]
                _set_scene_button(button_config, key_name)
                //Add button class
                $(elem_id).addClass('button');
                //Add number & text
                $(elem_id).html('<div class="num">'+scene_i+'</div><div class="label">'+button_config[0]+'</div>');
            } else {
                //Scene button, but nothing to run, add the ebutton class
                $(elem_id).addClass('ebutton');
            }
        }
    }

    $("input[type=checkbox]").switchButton({
        checked: true,
        labels_placement: "right",
        width: 100,
        height: 40,
        button_width: 70
    });
});
