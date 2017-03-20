function callDialog(parameter)
{
    var html =  '<div class="modal" id="dialog-pop-up" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="overflow-y:scroll !important; -webkit-overflow-scrolling:touch;">';
                html += '<div class="modal-dialog popup-guest-mode-iphone" role="document">';
                    html += '<div class="modal-content popup-guest-mode-iphone">';
                            html += '<div class="modal-header guestmode-header">';
                                html += '<strong class="primary-black hidden" id="dialog-pop-up-title">{Title}</strong>';
                            html += '</div>';
                        html += '<div class="modal-body filter-body">';
                            html += '<span id="dialog-pop-up-image" class="hidden">';
                                html += '<center><img src="" class="img-guest-mode-popup"></center>';
                            html += '</span>';
                            html += '<div class="row vendor-msg" style="border:none; padding-left:20px; padding-right:20px;">';
                                html += '<span class="primary-black hidden" id="dialog-pop-up-desc">{Desc}</span>';
                            html += '</div>';
                            html += '<div class="row" style="border:none" id="ok_button">';
                                html += '<div class="col-md-6 col-xs-8 col-md-offset-3 col-xs-offset-2">';
                                    html += '<button class="btn btn-green btn-block login-btn hidden" type="button" data-dismiss="modal" id="dialog-pop-up-button-close">{OK}</button>';
                                html += '</div>';
                            html += '</div>';
                        html += '</div>';   
                    html += '</div>';
                html += '</div>';
         html += '</div>';
    var content = $("."+parameter.selectorId).html(html);
    var tlt             = content.find('#dialog-pop-up-title');
    var img             = content.find('#dialog-pop-up-image');
    var LabelBtnClose   = content.find('#dialog-pop-up-button-close');
    var desc            = content.find('#dialog-pop-up-desc');
    if (parameter.title != "")
    {
        tlt.removeClass('hidden');
        tlt.html(parameter.title);
    }
    if (parameter.desc != "")
    {
        desc.removeClass('hidden');
        desc.html(parameter.desc);
    }
    if (parameter.image != "")
    {
        img.removeClass('hidden');
        img.find('img').attr('src', parameter.image);
    }
    if (parameter.LabelBtnClose != "")
    {
        LabelBtnClose.removeClass('hidden');
        LabelBtnClose.html(parameter.LabelBtnClose);
    }
    if (parameter.title != "")
    {
        content.removeClass('hidden');
        content.find('#dialog-pop-up-title').html(parameter.title);
    }
    $('#dialog-pop-up').modal('show');
}