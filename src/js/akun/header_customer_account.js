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

        if(action_onclick){
            $('.message_ca_action_1_new').attr('onclick', action_onclick);
            $('#message_ca_action').attr('onclick', action_onclick);
        }
    }
    else
    {
        $('#message_ca_action').hide();
    }
    
    // shows the pop up
    $('#filter').modal('show');
}