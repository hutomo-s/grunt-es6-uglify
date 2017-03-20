$(document).ready(function () {
    if (fm_popup_message){
      cart_green_popup(fm_popup_message, fm_header, check_guestMode, desturl);
    }
});

$("a.square-menu").click(function () {
    var link = $(this).attr("data-href");
    var link_desturl = $(this).attr("data-link");
    var desturl = link_desturl;


    var fm_msg_2 = $(this).attr("data-title");
    //var fm_popup_message = fm_msg_1 + fm_msg_2 + fm_msg_3;
    var current_mode = "CUSTOMER";
    if (check_guestMode) {
        current_mode = "GUEST";
    }

    var fm_popup_message = block_message(fm_msg_2, current_mode);

    /* GA Tracker */
    if (fm_msg_2 !== null) {
        ga_tracker('tab-menu', fm_msg_2);
    }
    /* End GA Tracker */
    // $("#ajaxSpinnerContainer").show();

    // be careful of the return of in array function
    var is_allowed = ($.inArray(fm_msg_2, allowed_module()) >= 0) ? true : false;
    // prevent redirect if is_allowed is false
    if (is_allowed === false) {
        if (check_guestMode) {
            // $("#ajaxSpinnerContainer").hide();
            cart_green_popup(fm_popup_message, fm_header, check_guestMode, desturl);
            return;
        }
    }

    // redirect function
    window.location = link;
});

function block_message(feature_name, current_mode) {
    var fm_popup_message = "";
    var fm_msg_1 = "Anda tidak dapat mengakses fitur ";
    var fm_msg_3 = " dalam Mode Pelanggan.";
    var fm_msg_2 = feature_name;
    fm_popup_message = fm_msg_1 + fm_msg_2 + fm_msg_3;
    if (current_mode == "GUEST") {
        fm_msg_1 = "Anda tidak dapat mengakses fitur ";
        fm_msg_3 = " sebelum mendaftar jadi agen.";
        fm_msg_2 = feature_name;
        fm_popup_message = fm_msg_1 + fm_msg_2 + fm_msg_3;
    }
    else if ( (current_mode == "CUSTOMER")) {
        fm_msg_1 = "Anda tidak dapat mengakses fitur ";
        fm_msg_3 = " dalam Mode Pelanggan. Aktifkan Mode Agen terlebih dahulu untuk mengakses fitur ";
        fm_msg_2 = feature_name;
        fm_popup_message = fm_msg_1 + fm_msg_2 + fm_msg_3 + fm_msg_2 + '.';
    }
    else if (current_mode == "CUSTOMER") {
        fm_msg_1 = "Anda tidak dapat mengakses fitur ";
        fm_msg_3 = " dalam Mode Pelanggan.";
        fm_msg_2 = feature_name;
        fm_popup_message = fm_msg_1 + fm_msg_2 + fm_msg_3;
    }
    return fm_popup_message;
}

function allowed_module() {
    var current_mode = "CUSTOMER";

    if (check_guestMode) {
        current_mode = "GUEST";
    }
    if (current_mode == "GUEST"){
        return ["Kios", "Bantuan"];
    }
}

/**
 * Parse URL into Hostname and Path
 *
 */
function parseURL(url) {
    var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
    // Let the browser do the work
    parser.href = url;
    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for (i = 0; i < queries.length; i++) {
        split = queries[i].split('=');
        searchObject[split[0]] = split[1];
    }
    return parser.pathname;

    //return {
    //protocol: parser.protocol,
    //host: parser.host,
    //hostname: parser.hostname,
    //port: parser.port,
    //pathname: parser.pathname,
    //search: parser.search,
    //searchObject: searchObject,
    //hash: parser.hash
    //};
}
