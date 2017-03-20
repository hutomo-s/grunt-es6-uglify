(function(){
    if(jQuery("#banner_install").length == 0) {
        jQuery('#mtop-promobox').removeClass("mtop50");
    } else if(device_android && install=="y"){
        jQuery("#banner_install").removeClass("hidden");
        if(check_guestMode) {
            jQuery("#mtop-promobox").addClass("mtop180");
        } else {
            jQuery("#mtop-promobox").addClass("mtop130");
        }
    }
})();
