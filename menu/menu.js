var menu = {

    // Holds the menu object collated from the _menu.php menu definition files
    obj: {},

    // Menu visibility and states
    // These do not currently control the state from startup but are set during startup
    l2_visible: false,
    l3_visible: false,
    l2_min: false,

    last_active_l1: false,

    active_l1: false,
    active_l2: false,
    active_l3: false,

    mode: 'auto',

    is_disabled: false,

    // ------------------------------------------------------------------
    // Init Menu
    // ------------------------------------------------------------------
    init: function(obj,session) {

        var q_parts = q.split("#");
        q_parts = q_parts[0].split("/");

        var controller = false; if (q_parts[0]!=undefined) controller = q_parts[0];

        menu.obj = obj;

        // Detect and merge in any custom menu definition created by a view
        if (window.custom_menu!=undefined) {
            for (var l1 in custom_menu) {
                menu.obj[l1]['l2'] = custom_menu[l1]['l2']
            }
        }

        // Detect l1 route on first load
        for (var l1 in menu.obj) {
            if (menu.obj[l1]['l2']!=undefined) {
                for (var l2 in menu.obj[l1]['l2']) {
                    if (menu.obj[l1]['l2'][l2]['l3']!=undefined) {
                        for (var l3 in menu.obj[l1]['l2'][l2]['l3']) {
                            if (menu.obj[l1]['l2'][l2]['l3'][l3].href.indexOf(controller)===0) {
                                menu.active_l1 = l1;
                            }
                        }
                    } else {
                        if (menu.obj[l1]['l2'][l2].href.indexOf(controller)===0) {
                            menu.active_l1 = l1;
                        }
                    }
                }
            } else {
                if (menu.obj[l1].href!=undefined && menu.obj[l1].href.indexOf(controller)===0) menu.active_l1 = l1;
            }
        }

        menu.draw_l1();
        menu.events();
        menu.resize();
    },

    // ------------------------------------------------------------------
    // L1 menu is the top bar menu
    // ------------------------------------------------------------------
    draw_l1: function () {

        // Build level 1 menu (top bar)
        var out = "";
        for (var l1 in menu.obj) {
            let item = menu.obj[l1]
            // Prepare active status
            let active = ""; if (l1==menu.active_l1) active = "active";
            // Prepare icon
            let icon = '<svg class="icon '+item['icon']+'"><use xlink:href="#icon-'+item['icon']+'"></use></svg>';
            // Title
            if (item['name']!=undefined) {
                let title = item['name'];
                if (item['title']!=undefined) title = item['title'];
                // Menu item
                let href='';
                if (item['default']!=undefined) {
                    href = 'href="'+path+item['default']+'"';
                }
                out += '<li><a '+href+' onclick="return false;"><div l1='+l1+' class="'+active+'" title="'+title+'"> '+icon+'<span class="menu-text-l1"> '+item['name']+'</span></div></a></li>';
            }
        }
        document.querySelector('.menu-l1 ul').innerHTML = out;

        if (menu.active_l1 && menu.obj[menu.active_l1]['l2']!=undefined) menu.draw_l2(); else menu.hide_l2();
    },

    // ------------------------------------------------------------------
    // Level 2 (Sidebar)
    // ------------------------------------------------------------------
    draw_l2: function () {
        // Sort level 2 by order property
        // build a set of keys first, sort these and then itterate through sorted keys
        var keys = Object.keys(menu.obj[menu.active_l1]['l2']);
        keys = keys.sort(function(a,b){
            return menu.obj[menu.active_l1]['l2'][a]["order"] - menu.obj[menu.active_l1]['l2'][b]["order"];
        });

        // Build level 2 menu (sidebar)
        var menu_title_l2 = menu.obj[menu.active_l1]['name'];
        if (menu_title_l2=="Setup") menu_title_l2 = "Emoncms";
        var out = '<h4 class="menu-title-l2"><span>'+menu_title_l2+'</span></h4>';
        for (var z in keys) {
            let l2 = keys[z];
            let item = menu.obj[menu.active_l1]['l2'][l2];

            if (item['divider']!=undefined && item['divider']) {
                out += '<li style="height:'+item['divider']+'"></li>';
            } else {
                let active = "";
                if (q.indexOf(item['href'])===0) {
                    active = "active";
                    menu.active_l2 = l2;
                }
                // Prepare icon
                let icon = "";
                if (item['icon']!=undefined) {
                    icon = '<svg class="icon '+item['icon']+'"><use xlink:href="#icon-'+item['icon']+'"></use></svg>';
                }

                // Title
                let title = item['name'];
                if (item['title']!=undefined) title = item['title'];

                // Create link if applicable
                let href = ''
                if (item['l3']==undefined) {
                    href = 'href="'+path+item['href']+'"'
                } else {
                    if (item['default']!=undefined) {
                        href = 'href="'+path+item['default']+'"'
                    }
                }
                // Disable link for active menu items
                if (active=="active") href = '';

                // Menu item
                out += '<li><a '+href+'><div l2='+l2+' class="'+active+'" title="'+title+'"> '+icon+'<span class="menu-text-l2"> '+item['name']+'</span></div></a></li>';
            }
        }

        document.querySelector('.menu-l2 ul').innerHTML = out;

        // If menu_l2 open and l2 menu item active and l3 exists: draw l3
        if (menu.active_l2 && menu.obj[menu.active_l1]['l2'][menu.active_l2]!=undefined && menu.obj[menu.active_l1]['l2'][menu.active_l2]['l3']!=undefined) {
            menu.draw_l3();
        }
    },

    // ------------------------------------------------------------------
    // Level 3 (Sidebar submenu)
    // ------------------------------------------------------------------
    draw_l3: function () {
        console.log("draw_l3");
        var out = '<div class="htop"></div><h3 class="l3-title mx-3">'+menu.obj[menu.active_l1]['l2'][menu.active_l2]['name']+'</h3>';
        for (var l3 in menu.obj[menu.active_l1]['l2'][menu.active_l2]['l3']) {
            let item = menu.obj[menu.active_l1]['l2'][menu.active_l2]['l3'][l3];
            // Prepare active status

            let active = "";
            if (q.indexOf(item['href'])===0) {
                active = "active";
                menu.active_l3 = l3;
            }
            // Menu item
            out += '<li><a href="'+path+item['href']+'" class="'+active+'">'+item['name']+'</a></li>';
        }
        document.querySelector('.menu-l3 ul').innerHTML = out;
        menu.show_l3();
    },

    // l2 and l3 hidden (no sidebar)

    // l2 exp

    // l2 min + l3 exp

    // l2 min + l3 hidden
    hide_l1: function () {
        document.querySelector('.menu-l1').style.display = 'none';
    },

    hide_l2: function () {
        menu.l2_visible = false;
        menu.l3_visible = false;
        document.querySelector('.menu-l2').style.display = 'none';
        document.querySelector('.menu-l3').style.display = 'none';
        document.querySelector('.content-container').style.margin = "46px auto 0 auto";
    },

    // If we minimise l2 we also hide l3
    min_l2: function () {
        menu.l2_min = true;
        menu.l2_visible = true;
        menu.l3_visible = false;
        document.querySelector('.menu-l2').style.display = '';
        document.querySelector('.menu-l2').style.width = "50px";
        document.querySelector('.menu-l3').style.display = 'none';
        document.querySelectorAll('.menu-text-l2').forEach(function (item) {
            item.style.display = 'none';
        });
        document.querySelector('.menu-title-l2 span').style.display = 'none';

        var window_width = window.innerWidth;
        var max_width = document.querySelector('.content-container').style.maxWidth.replace("px","");

        if (max_width=='none' || window_width<max_width) {
            document.querySelector('.content-container').style.margin = "46px 0 0 50px";
        } else {
            document.querySelector('.content-container').style.margin = "46px auto 0 auto";
        }

        var ctrl = document.querySelector('#menu-l2-controls');
        ctrl.innerHTML = '<svg class="icon"><use xlink:href="#icon-expand"></use></svg>';
        ctrl.setAttribute("title","Expand sidebar");
        ctrl.classList.remove("ctrl-exp");
        ctrl.classList.add("ctrl-min");
    },

    // If we expand l2 we also hide l3
    exp_l2: function () {
        if (menu.l2_min) setTimeout(function(){
                document.querySelectorAll('.menu-text-l2').forEach(function (item) {
                    item.style.display = '';
                });
                document.querySelector('.menu-title-l2 span').style.display = '';
            },200);
        menu.l2_min = false;
        menu.l2_visible = true;
        menu.hide_l3();
        document.querySelector('.menu-l2').style.display = '';
        document.querySelector('.menu-l2').style.width = "240px";
        var left = 240;
        if (menu.width<1150) left = 50;
        document.querySelector('.content-container').style.margin = "46px 0 0 "+left+"px";

        var ctrl = document.querySelector('#menu-l2-controls');
        ctrl.innerHTML = '<svg class="icon"><use xlink:href="#icon-contract"></use></svg>';
        ctrl.setAttribute("title","Minimise sidebar");
        ctrl.classList.remove("ctrl-min");
        ctrl.classList.add("ctrl-exp");
    },

    // If we show l3, l2_min = false moves back to expanded l2
    show_l3: function () {
        menu.min_l2();
        menu.l2_visible = true;
        menu.l3_visible = true;
        menu.l2_min = true;
        document.querySelector('.menu-l2').style.width = "50px";
        document.querySelector('.menu-l3').style.display = 'block';
        document.querySelectorAll('.menu-text-l2').forEach(function (item) {
            item.style.display = 'none';
        });
        var left = 290;
        if (menu.width<1150) left = 50;
        document.querySelector('.content-container').style.margin = "46px 0 0 "+left+"px";
    },

    // If we hide l3 - l2 expands
    hide_l3: function () {
        menu.l3_visible = false;
        document.querySelector('.menu-l3').style.display = 'none';
    },

    resize: function() {
        menu.width = window.innerWidth;
        menu.height = window.innerHeight;

        if (!menu.is_disabled) {
            
            if (menu.mode=='auto') {
                if (menu.width>=576 && menu.width<992) {
                    menu.min_l2();
                } else if (menu.width<576) {
                    menu.hide_l2();
                    menu.hide_l3();
                } else {
                    if (!menu.l3_visible) menu.exp_l2();
                }
            }

            if (menu.width>=992 && menu.l2_visible && (!menu.l2_min || menu.l3_visible)) {
                menu.mode = 'auto'
            }

            if (menu.width<576) {
                document.querySelectorAll('.menu-text-l1').forEach(function (item) {
                    item.style.display = 'none';
                });
            } else {
                document.querySelectorAll('.menu-text-l1').forEach(function (item) {
                    item.style.display = '';
                });
            }
	    // Alexandre CUER - 01/09/2021 - specific to index page if any
	    console.log(q);
	    if (q==="index" || q==="//") menu.hide_l2();
        }
    },

    disable: function() {
        menu.is_disabled = true;
        menu.hide_l1();
        menu.hide_l2();
        menu.hide_l3();
    },

    // -----------------------------------------------------------------------
    // Menu events
    // -----------------------------------------------------------------------
    events: function() {
        document.querySelector('.menu-l1 li div').addEventListener('click', function(event){
            menu.last_active_l1 = menu.active_l1;
            menu.active_l1 = $(this).attr("l1");//menu.active_l1 = this.getAttribute("l1");
            //menu.active_l1 = document.querySelector(this).getAttribute("l1");
            let item = menu.obj[menu.active_l1];
            // Remove active class from all menu items
            document.querySelector('.menu-l1 li div').classList.remove("active");
            document.querySelector('.menu-l1 li div[l1='+menu.active_l1+']').classList.add("active");
            // If no sub menu then menu item is a direct link
            if (item['l2']==undefined) {
                window.location = path+item['href']
            } else {
                if (menu.active_l1!=menu.last_active_l1) {
                    menu.draw_l2();
                    menu.exp_l2();
                } else {

                    if (!menu.l2_visible) {
                        if (menu.active_l3) {
                            menu.min_l2();
                            menu.show_l3();
                        } else {
                            menu.exp_l2();
                        }
                    } else if (menu.l2_visible && !menu.l2_min) {
                        menu.min_l2();
                    } else if (menu.l2_visible && !menu.l3_visible && menu.l2_min) {
                        menu.hide_l2();
                    } else if (menu.l2_visible && menu.l2_min && menu.l3_visible) {
                        menu.min_l2();
                        menu.hide_l3();
                    }
                }
            }
            menu.mode = 'manual'
        });

        function addEventListener(el, eventName, selector, eventHandler) {
          if (selector) {
            const wrappedHandler = (e) => {
              if (!e.target) return;
              const el = e.target.closest(selector);
              if (el) {
                eventHandler.call(el, e);
              }
            };
            el.addEventListener(eventName, wrappedHandler);
            return wrappedHandler;
          } else {
            const wrappedHandler = (e) => {
              eventHandler.call(el, e);
            };
            el.addEventListener(eventName, wrappedHandler);
            return wrappedHandler;
          }
        }

        var ml2 = document.querySelector('.menu-l2');
        addEventListener(ml2, "click", "li div", function(event){
            menu.active_l2 = $(this).attr("l2");//menu.active_l2 = this.getAttribute("l2");
            let item = menu.obj[menu.active_l1]['l2'][menu.active_l2];
            // Remove active class from all menu items
            document.querySelector('.menu-l2 li div').classList.remove("active");
            // Set active class to current menu
            document.querySelector('.menu-l2 li div[l2='+menu.active_l2+']').classList.add("active");
            // If no sub menu then menu item is a direct link
            if (item['l3']!=undefined) {
                if (!menu.l3_visible) {
                    // Expand sub menu
                    menu.draw_l3();
                } else {
                    menu.min_l2();
                }
            }
        });

        addEventListener(ml2, "click", "li", function(event){
            event.stopPropagation();
        });

        document.querySelector('#menu-l2-controls').addEventListener('click', function(event){
            event.stopPropagation();
            if (menu.l2_visible && menu.l2_min) {
                menu.exp_l2();
            } else {
                menu.min_l2();
            }
            menu.mode = 'manual'
        });

        $(window).resize(function(){
            menu.resize();
        });
    },

    route: function(q) {
        var route = {
            controller: false,
            action: false,
            subaction: false
        }

        var q_parts = q.split("#");
        q_parts = q_parts[0].split("/");

        if (q_parts[0]!=undefined) route.controller = q_parts[0];
        if (q_parts[1]!=undefined) route.action = q_parts[0];
        if (q_parts[2]!=undefined) route.subaction = q_parts[0];

        return route
    }
};
