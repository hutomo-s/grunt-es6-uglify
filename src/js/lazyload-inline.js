var jQueryOnload=function(){
    jQuery("img.lazy-load").lazyload({
        threshold:200,
        event:'sporty',
        effect:"fadeIn",
        skip_invisible : true
    });
}
$(window).bind("load", function() {
    var timeout1 = setTimeout(function() {
        jQuery("img.lazy-load").trigger("sporty");
    }, 100);
});
var timeout3 = setTimeout(function() {
    jQuery("img[src='"+gif_image_placeholder+"']").attr("src", image_placeholder);
}, 900);