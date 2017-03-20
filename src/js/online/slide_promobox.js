$(document).ready(function() {
    $('.promobox-loads').css("margin-top", 0);
    $.ajax({
        type: 'get',
        url: submit_url,
        dataType: 'json',
        success: function(retval) {
            var jsonObj = retval;
            OnMaintenanceServerListener(jsonObj);
            var html = "";
            var data = retval.promobox;
            var image = "";
            $.each(retval.promobox, function(key, value) {
                var promo_slug = convertToSlug(data[key].subject);
                promo_slug += '-' + data[key].id;
                imageCheck = data[key].thumbnail_image;
                html += '<div class="crop" data-subject="' + data[key].subject + '">';
                html += '<a onclick="gotrack(this)" href="' + promobox_base_uri + promo_slug + '" data-title="' + data[key].subject + '">';
                html += '<img src="' + data[key].thumbnail_image + '" alt="' + data[key].subject + '" style="width: 100%;" src="' + source_placehoder_img + '" >';
                html += '</a>';
                html += '</div>';
            });
            $('.promobox-slide').slick('slickAdd', html);
            var tmpImg = new Image();
            tmpImg.src = imageCheck;
            tmpImg.onload = function() {
                $('.promobox-slide').hide().fadeIn().removeClass('hide');
                $('.fake-image-promobox').fadeOut();
                $('.promobox-slide').slick('slickRemove', 0);

            };
            $('.promobox-slide').slick('slickNext');
        }
    });


});

function gotrack(elem) {
    var title = $(elem).attr('data-title');
    title != null && ga_tracker('promobox', title);
}
$('.promobox-slide').slick(getSliderSettings());

function getSliderSettings() {
    return {
        autoplay: true,
        lazyLoad: 'progresive',
        dots: true,
        swipeToSlide: true,
        autoplaySpeed: 5000,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        draggable: false,
        prevArrow: prev_arrow,
        nextArrow: next_arrow
    }
}
