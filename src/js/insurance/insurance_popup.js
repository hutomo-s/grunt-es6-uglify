$(document).ready(function() {
    $('.swipebox').swipebox();
    $('#shared-event').click(function() {
        var gm_message = v_gm_message;
        var gm_header = v_gm_header;
        $('#share').modal('show');
    });
    $('.prod-detail-img').slick({
        arrows: false,
        dots: true,
        autoplay: true,
        swipeToSlide: true,
        autoplaySpeed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
    });

    $('#protection-btn-info').click(function() {
        window.location.href = v_link_info;
    });
});
