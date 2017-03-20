$('.panel-heading p a').click(function (){
    var cekIn        = $(this).attr('aria-expanded');
    if (typeof cekIn === 'undefined' || cekIn === 'false'){
        $(this).find('.material-icons').html('&#xE15C;');
    }else{
        $(this).find('.material-icons').html('&#xE147;');
    }
});