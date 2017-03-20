function validPassword(field, rules, i, options) {
    var e_val = field.val();
    var is_errors = false;
    var tempStr = "";
    e_val = (e_val !== "") ? jQuery.trim(e_val) : '';

    if (e_val !== "") {
        if (e_val.length < 6) {
            tempStr = 'Password kurang dari 6 karakter';
            is_errors = true;
        }
    }

    if (is_errors === true) {
        return tempStr;
    }

}
function validRepassword(field, rules, i, options) {
    var is_errors = false;
    var tempStr = "";

    var e_reval = field.val();
    e_reval = (e_reval !== "") ? jQuery.trim(e_reval) : '';

    var e_input = jQuery('input[name=password]');
    var e_val = e_input.val();
    e_val = (e_val !== "") ? jQuery.trim(e_val) : '';

    if (e_reval !== "") {
        if (e_reval.length < 6) {
            tempStr = 'Password kurang dari 6 karakter';
            is_errors = true;
        }
        else if (e_reval != e_val) {
            tempStr = 'Konfirmasi password tidak sama';
            is_errors = true;
        }
    }

    if (is_errors === true) {
        return tempStr;
    }

}
jQuery('#resetPassword :input').on('keydown , change', function (e) {
    jQuery(this).validationEngine('hide');
});


function doSendResetPassword() {


    var password = jQuery.trim(jQuery('input[name=password]').val());
    var repassword = jQuery.trim(jQuery('input[name=repassword]').val());
    var code_confirmated = jQuery.trim(jQuery('input[name=code_confirmated]').val());
    var token = jQuery.trim(jQuery('input[name=token]').val());

    jQuery("#ajaxSpinnerContainer").removeClass("hidden").show();
    jQuery.ajax({
        url: reset_password,
        type: 'post',
        data: {'password': password, 'repassword': repassword, 'code_confirmated': code_confirmated, 'token': token},
        dataType: 'json'
    }).done(function (obj) {
        jQuery("#ajaxSpinnerContainer").hide();
        if (obj.code == 1000) {
            jQuery('#resetPassword')[0].reset();
            jQuery('#resetPassword :input').val("");
            jQuery('#password-baru-berhasil').modal('show');

            return;
        }
        else {
            jQuery('#modalWrongTitle').text(obj.message);
            jQuery('#modalWrong').modal('show');
        }

    }).fail(function (obj) {
        jQuery("#ajaxSpinnerContainer").hide();
        jQuery('#modalWrongTitle').text(text_footer_modal_alert_jaringan);
        jQuery('#modalWrong').modal('show');

    });
}

function eventEnterForgotPassword(e)
{
    if (e.keyCode == 13) 
    {
        resetPasswordOnClickListener();
        return false;
    }

}
