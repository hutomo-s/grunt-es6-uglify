// jquery only number
jQuery('.number').keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    $phone = $(this);
    // Allow numeric (and tab, backspace, delete) keys only
    return (key == 8 ||
      key == 13 ||
      key == 9 ||
      key == 46 ||
    (key >= 48 && key <= 57) ||
    (key >= 96 && key <= 105));
});
jQuery('.character').keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    return (key == 8 ||
    key == 9 ||
    key == 32 ||
    key == 46 ||
    (key >= 65 && key <= 90));
});
$('.min-max').keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    $phone = $(this);
});
/**
 * customer account footer
 */
function ca_popup(message, header, action, action_url, action_onclick)
{
    if(message)
        $('#message_ca').html(message);
    else
        return FALSE;
    $('#message_ca_header').html("Informasi");
    if(header)
        $('#message_ca_header').html(header);
    // default condition
    $('.modal-close').removeClass("col-xs-4 no-pright");
    $('.modal-close').addClass("col-xs-4 col-center");
    $('.modal-close button').addClass("btn-green");
    $('.modal-close button').html("OK");
    if(action && action_url)
    {
        $('.modal-close button').removeClass("btn-green");
        $('.modal-close button').html("TUTUP");
        $('.modal-close').removeClass("col-xs-4 col-center");
        $('.modal-close').addClass("col-xs-4 no-pright");
        $('#message_ca_action').show();
        $('#message_ca_action_1').html(action);
        $('#message_ca_action').attr('href', action_url);
        if(action_onclick)
            $('#message_ca_action').attr('onclick', action_onclick);
    }
    else
    {
        $('#message_ca_action').hide();
    }
    // shows the pop up
    $('#filter').modal('show');
}
$('#back_button').click(function(){
        history.back();
    });