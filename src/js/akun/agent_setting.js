jQuery('#switch-tutorial').bind('click', function () {
    if (jQuery(this).attr('value') == 'on') {
        jQuery('#on-tutorial').modal('show');
    } else {
        jQuery('#off-tutorial').modal('show');
    }
});

jQuery('#switch-komisi').bind('click', function () {
    if (jQuery(this).attr('value') == 'on') {
        jQuery('.modal-komisi-1').modal('show');
    } else {
        jQuery('.modal-komisi-2').modal('show');
    }
});

function changeCancelledTutorialListener($temp_val) {
    if ($temp_val == 'on') {
        jQuery('input[name=switch]').filter('[value=on]').prop('checked', true);

    } else {
        jQuery('input[name=switch]').filter('[value=off]').prop('checked', true);

    }
}

function changeTutorialListener($temp_val) {
    jQuery("#ajaxSpinnerContainer").show();
    jQuery('#on-tutorial').modal('hide');
    jQuery('#off-tutorial').modal('hide');
    jQuery.ajax({
        type: "post",
        url: base_url + '/agent/tutorial/change-status',
        data: {
            // "switch"   :jQuery('input[name=switch]').val(),
            "switch": $temp_val,
            "_token": token
        },
        success: function (result) {
            var json_temp = JSON.stringify(result);
            json_temp = jQuery.parseJSON(json_temp);
            if ($temp_val == "on") {
                jQuery('#on-tutorial').modal('hide');
            } else {
                jQuery('#off-tutorial').modal('hide');
            }
            if (json_temp.code == 1000) {
                if (json_temp.message.is_tutorial !== null) {
                    window.location.reload();
                    return true;
                }

            }
            jQuery("#ajaxSpinnerContainer").hide();
        },
        error: function (e) {
            jQuery("#ajaxSpinnerContainer").hide();
        }
    });
}

function changeKomisi($temp_val) {
    jQuery("#ajaxSpinnerContainer").show();
    jQuery('.modal-komisi-1').modal('hide');
    jQuery('.modal-komisi-2').modal('hide');
    jQuery.ajax({
        type: "post",
        url: base_url + '/agent/process-komisi',
        data: {
            "switch": $temp_val,
            "_token": token
        },
        success: function (result) {
            if (result.status)
            {
              window.location  = base_url + "/agent/setting";
            }
        },
        error: function (e) {
            jQuery("#ajaxSpinnerContainer").hide();
        }
    });
}

jQuery('.switch-event').bind('click', function () {
    if (jQuery(this).attr('value') == 'on') {
        jQuery('#open-store').modal('show');
    } else {
        jQuery('#close-store').modal('show');
    }
});

function changeCancelledShopListener($temp_val) {
    if ($temp_val == 'on') {
        jQuery('input[name=switch]').filter('[value=on]').prop('checked', true);

    } else {
        jQuery('input[name=switch]').filter('[value=off]').prop('checked', true);
    }
}

function changeShopListener($temp_val) {
    jQuery("#ajaxSpinnerContainer").show();
    jQuery('#close-store').modal('hide');
    jQuery('#open-store').modal('hide');
    jQuery.ajax({
        type: "post",
        url: base_url + '/agent/open-close-shop/change-status',
        data: {
            "switch": $temp_val,
            "_token": token
        },
        success: function (result) {
            var json_temp = JSON.stringify(result);
            json_temp = jQuery.parseJSON(json_temp);
            jQuery('#open-store').modal('hide');
            jQuery('#close-store').modal('hide');
            if (json_temp.code == 1000) {
                jQuery("#ajaxSpinnerContainer").hide();
                if (json_temp.message.is_shop == 1) {
                    ga_tracker('menu', 'Buka Toko');
                    jQuery('#open-Shop').modal('show');
                } else {
                    ga_tracker('menu', 'Tutup Toko');
                    jQuery('#close-success').modal('show');
                }
            }
        },
        error: function (e) {
            jQuery("#ajaxSpinnerContainer").hide();
        }
    });
}

function showModalChangePassword() {
    jQuery("#errors_change_password").hide();
    jQuery(".change_password").find("input[type=text], textarea").val("");
    jQuery("#modalChangePassword").modal("show");
}

function showModalNewPIN() {
    jQuery("#errors_change_pin").hide();
    jQuery(".change_pin").find("input[type=text], textarea").val("");
    jQuery("#modalChange_newpin").modal("show");
}

function showModalForgetPIN() {
    jQuery("#errors_change_pin_new").hide();
    jQuery(".forgot_pin").find("input[name=password_to_pin], textarea").val("");
    jQuery("#modalForgotPin").modal("show");
}

function AkunAgenOnClickListener() {
    jQuery("#errors_akun_agen").hide();
    jQuery(".akun-agen").find("input[name=password_akun_agen], textarea").val("");
    jQuery("#modalAkunAgen").modal("show");
}

jQuery(":input").on('keypress', function (e) {
    $(this).validationEngine('hide');
});

function confirmationPasswordClickListener() {
    var i_pass_old = jQuery('input[name=password_old]').val();
    var i_pass_new = jQuery('input[name=password_new]').val();
    var i_pass_re_new = jQuery('input[name=password_re_new]').val();
    var ajaxSpinnerContainer = jQuery("#ajaxSpinnerContainer");
    var is_error_rak = false;
    if ($('.change_password').validationEngine('validate')) {
        ajaxSpinnerContainer.show();
        jQuery('#modalChangePassword').modal('hide');
        if (is_error_rak === false) {
            var temp_data = {
                'password_old': i_pass_old,
                "password_new": i_pass_new,
                'password_re_new': i_pass_re_new,
                '_token': this.token
            };
            ajaxSpinnerContainer.show();
            var errorsChangePassword = jQuery("#errors_change_password");
            errorsChangePassword.removeClass("hidden");
            errorsChangePassword.hide();
            errorsChangePassword.html("");
            jQuery.ajax({
                url: base_url + '/agent/setting/change/password',
                type: 'post',
                data: temp_data,
                dataType: 'json'
            }).done(function (obj) {
                ajaxSpinnerContainer.hide();
                if (obj.code == '1000') {
                    jQuery("#successChangePassword").modal("show");
                    return true;
                } else {
                    ajaxSpinnerContainer.hide();
                    jQuery('#modalChangePassword').modal('show');
                    if (obj.message !== null) {
                        var li = "";
                        li += ("<li class='alert alert-danger'>" + obj.message + "</li>");
                        jQuery("#errors_change_password").html(li).show();
                    }
                }
                jQuery('#modalChangePassword input').val('');
            }).fail(function () {
                ajaxSpinnerContainer.hide();
                jQuery('#modalChangePassword').modal('hide');
                showErrorMessage('Password Gagal di Ubah','Error');
            });
        }
    }
}

function checkPasswordOld(field, rules, i, options) {
    var i_pass_old = jQuery('input[name=password_old]');
    var i_pass_new = jQuery('input[name=password_new]');
    var i_pass_re_new = jQuery('input[name=password_re_new]');
    if (i_pass_old.val() !== "") {
        if (i_pass_old.val().length < 6) {
            return "Password tidak boleh kurang dari 6 karakter.";
        }
    }
}

function checkConfirmPassword(field, rules, i, options) {
    var i_pass_old = jQuery('input[name=password_old]');
    var i_pass_new = jQuery('input[name=password_new]');
    var i_pass_re_new = jQuery('input[name=password_re_new]');
    if (i_pass_old.val() !== "") {
        if (i_pass_new.val().length < 6) {
            return "Password tidak boleh kurang dari 6 karakter.";
        }
        if (i_pass_re_new.val() != i_pass_new.val()) {
            return "Password tidak sama";
        }
    }
}

function checkPasswordNew(field, rules, i, options) {
    field = field.val();
    var i_pass_old = jQuery('input[name=password_old]');
    var i_pass_new = jQuery('input[name=password_new]');
    var i_pass_re_new = jQuery('input[name=password_re_new]');

    if (i_pass_new.val() !== "") {
        if (i_pass_new.val().length < 6) {
            return "Password tidak boleh kurang dari 6 karakter.";
        }
        if (i_pass_old.val() == i_pass_new.val()) {
            return "Password baru sama dengan password lama";
        }
    }
}

function checkRePasswordNew(field, rules, i, options) {
    field = field.val();
    var i_pass_old = jQuery('input[name=password_old]');
    var i_pass_new = jQuery('input[name=password_new]');
    var i_pass_re_new = jQuery('input[name=password_re_new]');
    if (i_pass_re_new.val() !== "") {
        if (i_pass_re_new.val().length < 6) {
            return "Konfirmasi Password baru tidak boleh kurang dari 6 karakter.";
        }
        if (i_pass_new.val() != i_pass_re_new.val()) {
            return "Repassword tidak sama dengan password baru";
        }
    }
}

function checkPhone(field, rules, i, options) {
    field = field.val();
    if (field !== null) {
        if (isInt(field)) {
            var checkPrefix = field.substr(0, 1);
            if (checkPrefix == "+") {
                var checkPrefixPlus = field.substr(0, 3);
                if (checkPrefixPlus != '+62') {
                    jQuery('#ajaxSpinnerContainer').hide();
                    return "Nomor Handphone yang Anda masukan salah";
                }
            } else {
                var noHpdata = field.substr(0, 1);
                if (Number(noHpdata) !== Number(0)) {
                    jQuery('#ajaxSpinnerContainer').hide();
                    return "Nomor Handphone yang Anda masukan salah";
                }
            }
        } else {
            jQuery('#ajaxSpinnerContainer').hide();
            return "Nomor Handphone yang Anda masukan salah !";
        }
    }
}

function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

function checkEmail(field, rules, i, options) {
    field = field.val();
    var email = validateEmail(field);
    if (email === false) {
        jQuery('#ajaxSpinnerContainer').hide();
        return "Email yang Anda masukan salah";
    }
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var confirmationPinClickListener = function () {
    var i_pass_old = jQuery('input[name=pin_old]');
    var i_pass_new = jQuery('input[name=pin_new]');
    var i_pass_re_new = jQuery('input[name=pin_re_new]');
    var is_error_rak = false;

    if ($('.change_pin').validationEngine('validate')) {
        var formData = new FormData();
        formData.append('_token', this.token);
        formData.append('pin_old', i_pass_old.val());
        formData.append('pin_new', i_pass_new.val());
        formData.append('pin_re_new', i_pass_re_new.val());
        //jQuery("#load_change_pin").removeClass("hidden").show();
        jQuery("#ajaxSpinnerContainer").show();
        jQuery("#errors_change_pin").removeClass("hidden");
        jQuery("#errors_change_pin").hide();
        jQuery("#errors_change_pin").html("");
        jQuery('#modalChange_newpin').modal('hide');
        jQuery.ajax({
            url: base_url + '/agent/setting/change/pin',
            type: 'post',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            dataType: 'json'
        }).done(function (obj) {
            jQuery("#ajaxSpinnerContainer").hide();

            if (obj.code == '1000') {
                jQuery("#successChangePIN").modal("show");
                return true;
            } else {
                if (obj.message !== null) {
                    var li = "";
                        jQuery.each(obj.message, function (obj_index, obj_val) {
                            li += ("<li class='alert alert-danger'>" + obj_val + "</li>");
                            return false;
                        });
                    jQuery("#errors_change_pin").html(li).show();
                }
                jQuery("#ajaxSpinnerContainer").hide();
                jQuery('#modalChange_newpin').modal('show');
            }
            jQuery('#modalChangePIN input').val('');
        }).fail(function () {
            jQuery("#ajaxSpinnerContainer").hide();
            jQuery('#modalChange_newpin').modal('show');
        });
    }
};

function checkPinOld(field, rules, i, options) {
    var i_pass_old = jQuery('input[name=pin_old]');
    var i_pass_new = jQuery('input[name=pin_new]');
    var i_pass_re_new = jQuery('input[name=pin_re_new]');
    if (i_pass_old.val() !== "") {
        if (Number(i_pass_old.val().length) < 6) {
            return "PIN tidak boleh kurang dari 6 karakter.";
        }
    }
}

function checkPinNew(field, rules, i, options) {
    var i_pass_old = jQuery('input[name=pin_old]');
    var i_pass_new = jQuery('input[name=pin_new]');
    var i_pass_re_new = jQuery('input[name=pin_re_new]');
    if (i_pass_new.val() !== "") {
        if (Number(i_pass_new.val().length) < 6) {
            return "PIN tidak boleh kurang dari 6 karakter.";
        }
        if (i_pass_new.val() !== "" && i_pass_old.val() !== "") {
            if (Number(i_pass_new.val().length) < 6) {
                return "PIN tidak boleh kurang dari 6 karakter.";
            }
            if (i_pass_old.val() == i_pass_new.val()) {
                return "PIN baru tidak boleh sama dengan yang PIN lama";
            }
        }
    }
}

function checkConfirmPinNew(field, rules, i, options) {
    var i_pass_old = jQuery('input[name=pin_old]');
    var i_pass_new = jQuery('input[name=pin_new]');
    var i_pass_re_new = jQuery('input[name=pin_re_new]');
    if (i_pass_new.val() != i_pass_re_new.val()) {
        return "PIN tidak sama";
    }
    if (i_pass_re_new.val() !== "") {
        if (Number(i_pass_re_new.val().length) < 6) {
            return "PIN tidak boleh kurang dari 6 karakter.";
        }
    }
}

function checkPasswordPIN(field, rules, i, options) {
    var i_pass_old = jQuery('input[name=password_to_pin_new]');
    if (i_pass_old.val() !== "") {
        if (i_pass_old.val().length < 6) {
            return "Password tidak boleh kurang dari 6 karakter.";
        }
    }
}

function forgotPINListener() {
    var i_pass_re_new = jQuery('input[name=password_to_pin_new]');
    var temp_pass_re = i_pass_re_new.val();
    var errorsChangePinNew = jQuery("#errors_change_pin_new");
    var ajaxSpinnerContainer = jQuery("#ajaxSpinnerContainer");
    if ($('.password_to_pin_new').validationEngine('validate')) {
        jQuery('#modalForgotPin').modal('hide');
        ajaxSpinnerContainer.show();
        errorsChangePinNew.removeClass("hidden");
        errorsChangePinNew.hide();
        errorsChangePinNew.html("");
        jQuery.ajax({
            url: base_url + '/agent/setting/change/forgot-pin',
            type: 'post',
            data: {'_token': this.token, 'password': temp_pass_re},
            dataType: 'json'
        }).done(function (obj) {
            ajaxSpinnerContainer.hide();
            if (obj.code == 1000) {
                jQuery("#successForgotPIN").modal("show");
                return true;
            } else {
                if (obj.message !== null) {
                    var li = "";
                    li += ("<li class='alert alert-danger'>" + obj.message + "</li>");
                    if (obj.message == 'Anda memasukkan 3x percobaan password salah, tunggu 1 hari untuk mencobanya kembali.') {
                        jQuery('#modalForgotPinFails').modal('show');
                            return false;
                    }
                    jQuery("#errors_change_pin_new").html(li).show();
                }
                jQuery('#modalForgotPin').modal('show');
            }
            jQuery('#modalChangePIN input').val('');
        }).fail(function () {
            jQuery("#errors_change_pin_new").html("<li class='alert alert-danger'>Sedang Terjadi Gangguan Jaringan</li>").show();
            ajaxSpinnerContainer.hide();
            jQuery('#modalForgotPin').modal('show');
        });
    }
}

function checkPasswordAkunAgen(field, rules, i, options) {
    var i_pass_old = jQuery('input[name=password_akun_agen]');
    if (i_pass_old.val() !== "") {
        if (i_pass_old.val().length < 6) {
            return "Password tidak boleh kurang dari 6 karakter.";
        }
    }
}

function doAkunAgen() {
    var i_pass_re_new = jQuery('input[name=password_akun_agen]');
    var errorsChangePinNew = jQuery("#errors_change_pin_new");
    var ajaxSpinnerContainer = jQuery("#ajaxSpinnerContainer");
    if (jQuery('.akun-agen').validationEngine('validate')) {
        jQuery('#modalAkunAgen').modal('hide');
        var formData = new FormData();
        formData.append('_token', this.token);
        formData.append('password', i_pass_re_new.val());
        ajaxSpinnerContainer.show();
        errorsChangePinNew.removeClass("hidden");
        errorsChangePinNew.hide();
        errorsChangePinNew.html("");
        var is_modal_show = false;
        jQuery.ajax({
            url: base_url + '/agent/setting/access/akun-agen',
            type: 'post',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            dataType: 'json'
        }).done(function (obj) {
            ajaxSpinnerContainer.hide();

            if (obj.code == '1000') {
                ajaxSpinnerContainer.show();
                window.location.href = profile_change;
                return true;
            } else {
                if (obj.message !== null) {
                    var li = "<ul style='padding:0'>";
                    li += ("<li style='list-style-type:none'>" + obj.message + "</li>");
                    li += "</ul>";
                    jQuery(".title-fail-popup").html("Password gagal");
                    jQuery(".message-fail-popup").html(li);
                    jQuery("#modalerror").modal('show');

                }
                if (is_modal_show === false) {
                    jQuery('#modalAkunAgen').modal('hide');
                }
            }
            jQuery('#modalChangePIN input').val('');
        }).fail(function () {
            jQuery("#errors_change_pin_new").html("<li class='alert alert-danger'>Sedang Terjadi Gangguan Jaringan</li>").show();
            jQuery("#ajaxSpinnerContainer").hide();
            jQuery('#modalAkunAgen').modal('show');
        });
    }
}

/*---------------------jika modal hide----------------------------------*/
jQuery('#modalChange_newpin').on('hidden.bs.modal', function (e) {
    $('.password_to_pin_new').validationEngine('hide');
    jQuery('#modalChange_newpin input').val('');
});

jQuery('#modalChangePIN').on('hidden.bs.modal', function (e) {
    jQuery('.change_pin').validationEngine('hide');
    jQuery('#modalChangePIN input').val('');
});

jQuery('#modalChangePassword').on('hidden.bs.modal', function (e) {
    $('.change_password').validationEngine('hide');
    jQuery('#modalChangePassword input').val('');
});

jQuery('#modalForgotPin').on('hidden.bs.modal', function (e) {
    $('.password_to_pin_new').validationEngine('hide');
    jQuery('#password_to_pin_1').val('');
});
/*---------------------jika modal hide----------------------------------*/

function maxLengthCheck(object) {
    if (object.value.length > object.maxLength) {
        object.value = object.value.slice(0, object.maxLength);
    }
}

jQuery('.NotSinggleQuote').keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    return (key != 222);
});

// event enter password akun agent //
function eventEnterPasswordAkunAgent(e) {
    if (e.keyCode == 13) {
        doAkunAgen();
        return false;
    }
}

// event enter password lupa pin kudo
function eventEnterPassword(e)
{
    if (e.keyCode == 13) {
        forgotPINListener();
        return false;
    }
}

// event enter password
function eventKonfirmPassword(e)
{
    if (e.keyCode == 13) {
        confirmationPasswordClickListener();
        return false;
    }
}

// event enter change pin
function eventChangePinEnter(e)
{
    if (e.keyCode == 13) {
        confirmationPinClickListener();
        return false;
    }
}