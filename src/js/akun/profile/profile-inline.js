$('.promobox-loads').css("margin-top", 0);
$('.customer-mode-green-fix').css("display", "none");
// avatar crop
function cropAvatar(image) {
    var img = new Image();
    img.src = image;
    img.onload = function () {
        return {
            src: image,
            width: this.width,
            height: this.height
        };
    }
    return img;
}
jQuery(function () {

    var x = cropAvatar(jQuery("#avatar").attr("src"));
    x.addEventListener('load', function () {
        if (x.width > x.height) {
            // landscape
            jQuery("#avatar").addClass('landscape');
        } else if (x.width < x.height) {
            //it's a portrait
            jQuery("#avatar").addClass('potrait');

        }
    });
});
// untuk show notif error no location detect mobile
var is_error_show_open_close_shop=true;