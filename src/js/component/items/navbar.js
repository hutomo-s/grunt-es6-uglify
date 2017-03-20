$('#search-button-event-toggle').click(function (){
    $('.default-search').removeClass('hide');
    $('.default').addClass('hide');
    $(this).addClass('hide');
    $('#online_cart').addClass('hide');
    $('.navigation-title').removeClass('col-xs-8');
    /* $('.todefault').removeClass('loading-page'); */
});
$('.todefault').click(function (){
    $('.default-search').addClass('hide');
    $('.navigation-title').addClass('col-xs-8');
    $('.default').removeClass('hide');
    $("#search-button-event-toggle").removeClass('hide');
    $('#online_cart').removeClass('hide');
    /* $('.back-arrow').addClass('loading-page'); */
});
$('#shared-event').click(function (){
    $('#share').modal('show');
});

$('#info-shiping-data').click(function (){
   $('#info-shiping').modal('show');
});
