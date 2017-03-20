jQuery(document).ready(function () {

    jQuery("input").on('keypress', function () {
        jQuery(this).validationEngine('hide');
    });
    jQuery("select,input").on("change", function () {
        jQuery(this).validationEngine('hide');
    });

    getPekerjaan();
    getProvinsi();
    $("#register_v1").validationEngine();

    $(".txtboxToFilter").keydown(function (e) {
       // Allow: backspace, delete, tab, escape, enter and .
       if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl/cmd+A
           (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+C
           (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
           // Allow: Ctrl/cmd+v
           (e.keyCode == 86 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+X
           (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right
            //
           (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
       }
       // Ensure that it is a number and stop the keypress
       if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
           e.preventDefault();
       }
   });

});


$(document).on('keydown change', 'select[name=provinsi]', function () {
    var var_element = jQuery(this);
    return getKabupaten(var_element);
});
$(document).on('keydown change', 'select[name=kabupaten]', function () {
    var var_element = jQuery(this);
    return getKecamatan(var_element);
});
$(document).on('keydown change', 'select[name=kecamatan]', function () {
    var var_element = jQuery(this);
    return getKelurahan(var_element);
});
$(document).on('keydown change', 'select[name=kelurahan]', function () {
    var var_element = jQuery(this);
    return getKodePos(var_element);
});

$('#autoReferral').bind('input', function(){
  if ($(this).val() != ""){
    if ($(this).val()[0].toLowerCase() == 'r' && $(this).val().length >= 4){
      $('.nik-fo').removeClass('hide');
    }else{
      $('.nik-fo').addClass('hide');
    }
  }
});

  var inputTypeText = true;

  $('input[name=fktp]').click(function(e){
      if (inputTypeText == true){
        e.preventDefault();
        $('#tutorial-fotoktp-popup').modal({
          backdrop: 'static'
        });
      }
  });

  $('#tutorial-fotoktp-popup').on('click', '.modal-backdrop', function() {
      closedTutorialID();
  });

function fktp_click(e){
    $("input[name=fktp]").trigger("click");
    $('#previewPhotoPage').animate({
      height: 'toggle'
    }, 400, function(e) {
        $('.container-mobile').removeClass('disabled-scroll');
    });
    return true
}

function closedTutorialID(){
  $('#tutorial-fotoktp-popup').modal('hide');
  inputTypeText = false;
  $("input[name=fktp]").trigger("click");
}

jQuery('input[name=fktp]').on('change', function (e) {
    if(this.value.length != 0) {
        $('#previewPhotoPage').animate({
            height: 'toggle'
            }, 400, function() {
                var windowHeight = $(window).height();
                var contentHeight = $('.previewPhotoContainer').height();
                if (contentHeight > windowHeight){
                    var newHeight = contentHeight - (contentHeight - windowHeight) - 50;
                    $('.previewPhotoContainer').css('height',newHeight);
                }

                $('.container-mobile').addClass('disabled-scroll');
        });
        readURL(this);
    }
    getKTP(this);
});

$('#btn-preview-continue, #btn-back-preview').click(function() {
    $('.container-mobile').removeClass('disabled-scroll');
    $('#previewPhotoPage').animate({
      height: 'toggle'
    }, 400, function() {
    });
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#previewPhotoImage').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function getPekerjaan() {
    var ajaxSpinnerContainer = jQuery("#ajaxSpinnerContainer");
    var job = jQuery('select[name=pekerjaan]');
    ajaxSpinnerContainer.show();
    $.ajax({
        url: base_url + '/getPekerjaan',
        dataType: 'json',
        type: 'POST',
        cache: false,
        success: function (data) {
            try{
                var data = data;
                var jsonObj = data;
                OnMaintenanceServerListener(jsonObj);
            }catch(e){
            }
            ajaxSpinnerContainer.hide();
            job.empty();
            var data_temp = [];
            data_temp.push(jQuery('<option value="">(Pilih Pekerjaan)</option>'));
            if (data.code == 1000) {
                jQuery.each(data.message, function (index, val_data) {
                    data_temp.push(jQuery('<option value="' + val_data.pekerjaan_id + '">' + val_data.pekerjaan_name + '</option>'));
                });
                job.append(data_temp);

            }
            job.trigger("chosen:updated");
        }.bind(this),
        error: function (xhr, status, err) {
            ajaxSpinnerContainer.hide();
        }.bind(this)
    });
}

function getProvinsi() {
    var ajaxSpinnerContainer = jQuery("#ajaxSpinnerContainer");
    var province = jQuery('select[name=provinsi]');
    ajaxSpinnerContainer.show();
    $.ajax({
        url: base_url + '/getProvinsi',
        dataType: 'json',
        type: 'POST',
        cache: false,
        success: function (data) {
            try{
                var data = data;
                var jsonObj = data;
                OnMaintenanceServerListener(jsonObj);
            }catch(e){
            }
            ajaxSpinnerContainer.hide();
            province.empty();
            var data_temp = [];
            data_temp.push(jQuery('<option value="">(Pilih Provinsi)</option>'));
            if (data.code == 1000) {
                jQuery.each(data.message, function (index, val_data) {
                    data_temp.push(jQuery('<option value="' + val_data.provinsi_id + '">' + val_data.provinsi_name + '</option>'));
                });
                province.append(data_temp);

            }
            province.trigger("chosen:updated");
        }.bind(this),
        error: function (xhr, status, err) {
            ajaxSpinnerContainer.hide();
        }.bind(this)
    });
}

function getKTP(e_ktp) {
    var val = jQuery(e_ktp).val();
    val = (val.substring(val.lastIndexOf('.') + 1).toLowerCase());
    resetSendFotoKTP();
    jQuery("input[name=file_extension]").val(val);
    jQuery("input[name=file_extension]").validationEngine('validate');
}

function getKodePos(e_kelurahan) {
    setDefaultSelect('kode_pos');
    jQuery('input[name=kode_pos]').val(jQuery('option:selected', e_kelurahan).attr('kode_pos'));
    jQuery(jQuery('input[name=kode_pos]')).validationEngine('hide');
}

function getKelurahan(e_kecamatan) {
    jQuery("#ajaxSpinnerContainer").show();
    setSelectDisabled('kelurahan');
    setDefaultSelect('kelurahan');
    setDefaultSelect('kode_pos');
    $('select[name=kelurahan]').trigger("chosen:updated");
    $.ajax({
        url: base_url + '/getKelurahan',
        dataType: 'json',
        type: 'POST',
        cache: false,
        data: {kecamatan: jQuery(e_kecamatan).val()},
        success: function (data) {
            try{
                var data = data;
                var jsonObj = data;
                OnMaintenanceServerListener(jsonObj);
            }catch(e){
            }
            jQuery("#ajaxSpinnerContainer").hide();
            jQuery('select[name=kelurahan]').empty();
            var data_temp = [];
            data_temp.push(jQuery('<option kode_pos="" value="">(Pilih Kelurahan)</option>'));
            if (data.status == 200) {
                jQuery.each(data.listdata, function (index, val_data) {
                    data_temp.push(jQuery('<option kode_pos="' + val_data.kode_pos + '" value="' + val_data.kelurahan_id + '">' + val_data.kelurahan_name + '</option>'));
                });
                jQuery('select[name=kelurahan]').append(data_temp);
                setSelectRemoveDisabled('kelurahan');
            }
            $('select[name=kelurahan]').trigger("chosen:updated");
        }.bind(e_kecamatan),
        error: function (xhr, status, err) {
            jQuery("#ajaxSpinnerContainer").hide();
        }.bind(e_kecamatan)
    });
}

function getKecamatan(e_kabupaten) {
    jQuery("#ajaxSpinnerContainer").show();
    setSelectDisabled('kecamatan');
    setSelectDisabled('kelurahan');
    setDefaultSelect('kecamatan');
    setDefaultSelect('kelurahan');
    setDefaultSelect('kode_pos');
    $('select[name=kecamatan]').trigger("chosen:updated");
    $.ajax({
        url: base_url + '/getKecamatan',
        dataType: 'json',
        type: 'POST',
        cache: false,
        data: {kota: jQuery(e_kabupaten).val()},
        success: function (data) {
            try{
                var data = data;
                var jsonObj = data;
                OnMaintenanceServerListener(jsonObj);
            }catch(e){
            }
            jQuery("#ajaxSpinnerContainer").hide();
            jQuery('select[name=kecamatan]').empty();
            var data_temp = [];
            data_temp.push(jQuery('<option value="">(Pilih Kecamatan)</option>'));
            if (data.status == 200) {
                jQuery.each(data.listdata, function (index, val_data) {
                    data_temp.push(jQuery('<option value="' + val_data.kecamatan_id + '">' + val_data.kecamatan_name + '</option>'));
                });
                jQuery('select[name=kecamatan]').append(data_temp);
                setSelectRemoveDisabled('kecamatan');

            }
            jQuery('select[name=kecamatan]').trigger("chosen:updated");
        }.bind(e_kabupaten),
        error: function (xhr, status, err) {
            jQuery("#ajaxSpinnerContainer").hide();
        }.bind(e_kabupaten)
    });
}

function getKabupaten(e_provinsi) {

    jQuery("#ajaxSpinnerContainer").show();
    setSelectDisabled('kabupaten');
    setSelectDisabled('kecamatan');
    setSelectDisabled('kelurahan');
    setDefaultSelect('all');
    $('#ikabupaten').trigger("chosen:updated");

    $.ajax({
        url: base_url + '/getKabKot',
        dataType: 'json',
        type: 'POST',
        cache: false,
        data: {provinsi_id: jQuery(e_provinsi).val()},
        success: function (data) {
            try{
                var data = data;
                var jsonObj = data;
                OnMaintenanceServerListener(jsonObj);
            }catch(e){
            }
            jQuery("#ajaxSpinnerContainer").hide();
            jQuery('select[name=kabupaten]').empty();
            var data_temp = [];
            // data_temp.push(jQuery('<option value="">(Pilih Kota/Kabupaten)</option>'));
            jQuery('select[name=kabupaten]').append(jQuery('<option>').text('(Pilih Kota/Kabupaten)').val(""));
            if (data.status == 200) {
                jQuery.each(data.listdata, function (index, val_data) {
                    // data_temp.push(jQuery('<option value="'+val_data.kabupaten_id+'">'+val_data.kabupaten_name+'</option>'));
                    jQuery('select[name=kabupaten]').append(jQuery('<option>').text(val_data.kabupaten_name).val(val_data.kabupaten_id));
                });
                //jQuery('select[name=kabupaten]').append(data_temp);
                setSelectRemoveDisabled('kabupaten');
            }
            $('#ikabupaten').trigger("chosen:updated");
        }.bind(e_provinsi),
        error: function (xhr, status, err) {
            jQuery("#ajaxSpinnerContainer").hide();
        }.bind(e_provinsi)
    });
}

function setSelectDisabled($name) {
    jQuery('select[name=' + $name + ']').attr('readonly', 'readonly');
}

function setSelectRemoveDisabled($name) {
    jQuery('select[name=' + $name + ']').removeAttr('readonly');
}

function setDefaultSelect($name) {
    switch ($name) {
        case 'kabupaten':
            jQuery("select[name=kabupaten]").empty();
            jQuery("select[name=kabupaten]").append(jQuery('<option>').text("(Pilih Kota/Kabupaten)").val(""));
            break;
        case 'kecamatan':
            jQuery("select[name=kecamatan]").empty();
            jQuery("select[name=kecamatan]").append(jQuery('<option>').text("(Pilih Kecamatan)").val(""));
            break;
        case 'kelurahan':
            jQuery("select[name=kelurahan]").empty();
            jQuery("select[name=kelurahan]").append(jQuery('<option>').text("(Pilih Kelurahan)").val(""));
            break;
        case 'kode_pos':
            jQuery('input[name=kode_pos]').text("");
            jQuery('input[name=kode_pos]').val("");
            break;
        case 'all':
            jQuery("select[name=kabupaten]").empty();
            jQuery("select[name=kabupaten]").append(jQuery('<option>').text("(Pilih Kota/Kabupaten)").val(""));
            jQuery("select[name=kecamatan]").empty();
            jQuery("select[name=kecamatan]").append(jQuery('<option>').text("(Pilih Kecamatan)").val(""));
            jQuery("select[name=kelurahan]").empty();
            jQuery("select[name=kelurahan]").append(jQuery('<option>').text("(Pilih Kelurahan)").val(""));
            jQuery('input[name=kode_pos]').text("");
            jQuery('input[name=kode_pos]').val("");
            break;

    }
}

// funtion untuk submitv
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-bottom-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "4000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

var submitOnclickListener=function(){
    var frm_validate = jQuery("#registrasiAgen").validationEngine('validate');
    if(frm_validate == true){
        var varPersutujuan =jQuery('input[name=persetujuan]').is(":checked");
        if(! varPersutujuan){
            if(!jQuery( "#toast-container" ).hasClass( "toast-bottom-center" )) {
                toastr.info("Pastikan Anda sudah mencentang persetujuan Kebijakan Privasi dan Ketentuan Pengguna Kudo.");
            }
            return null;
        }
        $('#daftar-warning').modal('show');
        //doRegistrasi();
        //console.log("do registrasi dijalankan");
    }

};
// function untuk clean referal agent


var konfirmasiOnClickActionListener = function () {
    var $myForm = jQuery('#register_v1');

    jQuery("#ajaxSpinnerContainer").show();
    var temp = jQuery('input[name=referal_code]').val();
    jQuery('input[name=code]').val(temp);
    jQuery('#primary-submit').click();
};

var noReferalOnClickActionListener = function () {
    var $myForm = jQuery('#register_v1');

    jQuery("#ajaxSpinnerContainer").show();
    jQuery('input[name=code]').remove();
    jQuery('#primary-submit').click();
};




function geThan(field, rules, i, options) {
    field = field.val();
    if (field !== "") {
        var checkEmail = validateEmail(field);
        if (checkEmail === false) {
            return "Email yang  Anda masukan salah";
        }
    } else {
        return "";
    }
}

$("input[name='email']").on({
    keydown: function (e) {
        if (e.which === 32)
            return false;
    },
    change: function () {
        this.value = this.value.replace(/\s/g, "");
    }
});

function checkSpecialChareacter(field, rules, i, options) {
    field = field.val();
    if (field !== "") {
        if (jQuery.trim(field) === "" || field === null) {
            return "Nama yang Anda masukan salah";
        }
    }
}

function geThanPhone(field, rules, i, options) {
    field = field.val();
    if (isInt(field)) {
        if (field.length >= 7 && field.length <= 20) {
            var checkPrefix = field.substr(0, 1);
            if (checkPrefix == "+") {
                var checkPrefixPlus = field.substr(0, 3);
                if (checkPrefixPlus != '+62') {
                    return "Nomor HP yang Anda masukan salah !";
                }
            } else {
                var noHpdata = field.substr(0, 1);
                if (Number(noHpdata) !== Number(0)) {
                    return "Nomor HP Yang anda masukan salah !";
                }
                if (cekPhoneNumber(field) === false) {
                    return "Nomor HP Yang anda masukan salah !";
                }
            }
        } else {
            return "Nomor HP yang Anda masukan salah !";
        }
    }
}

function cekPhoneNumber(numberphone) {
    var libs = '["0811","0812","0813","0821","0822","0823","0851","0852","0853","0855","0856","0857","0858","0814","0815","0816","0817","0818","0819","0859","0877","0878","0879","0831","0832","0838","0895","0896","0897","0898","0899","0881","0882","0883","0884","0885","0886","0887","0888","0889","0213","0214","0215","0216","0218","0219","02183","022","2","3","4","6","7","8","999","998","0998","0999","627","629","641","642","643","644","645","646","650","651","652","653","654","655","656","657","658","659","61","620","621","622","623","624","625","626","627","628","630","631","632","633","634","635","636","639","751","752","753","754","755","756","757","760","761","762","763","764","765","766","767","768","769","624","770","771","772","773","776","777","778","779","740","741","742","743","744","745","746","747","748","702","711","712","713","714","730","731","733","734","735","715","716","717","718","719","732","736","737","738","739","721","722","723","724","725","726","727","728","729","21","21","252","253","254","257","21","22","231","232","233","234","251","260","261","262","263","264","265","266","267","24","271","272","273","274","275","276","280","281","282","283","284","285","286","287","289","291","292","293","294","295","296","297","298","299","356","274","31","321","322","323","324","325","327","328","331","332","333","334","335","336","338","341","342","343","351","352","353","354","355","356","357","358","361","362","363","365","366","368","364","370","371","372","373","374","376","380","381","382","383","384","385","386","387","388","389","561","562","563","564","565","567","568","534","513","522","525","526","528","531","532","536","537","538","539","511","512","517","518","526","527","541","542","543","545","548","549","554","551","552","553","556","430","431","432","434","438","435","443","445","450","451","452","453","454","457","458","461","462","463","464","465","455","422","426","428","410","411","413","414","417","418","419","420","421","423","427","471","472","473","474","475","481","482","484","485","401","402","403","404","405","408","910","911","913","914","915","916","917","918","921","922","923","924","927","929","931","901","902","951","952","955","956","957","966","967","969","971","975","980","981","983","984","985","986"]';
    var arr = jQuery.parseJSON(libs);
    var temp_bollean = false;
    jQuery.each(arr, function (index, var_arr) {
        if (numberphone.substring(0, var_arr.length).toString() == var_arr.toString()) {
            temp_bollean = true;
            return false;
        }
    });
    return temp_bollean;
}

function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function getPwd(field, rules, i, options) {
    field = field.val();
    if (field !== "") {
        if (Number(field.length) < Number(6)) {
            return "Masukkan minimal 6 digit kode password !";
        }
    } else {
        return "";
    }
}

var in_proses_resize = false;
var fails_file_upload = false;

function fileValidate(field, rules, i, options) {
    var val_file = jQuery('input[name=fktp]').val();
    var field_ktp = jQuery('input[name=fktp]');
    if (val_file !== "") {
        var size_image = null;
        try {
            size_image = jQuery(field_ktp).get(0).files[0].size;
        } catch (e) {
            size_image = null;
        }

        if (size_image === null || val_file === null || val_file === "") {
            return "Mohon masukkan foto KTP sesuai dengan format JPG, JPEG, JPE, PNG";
        }
        if (size_image < 10000) {
            return "Foto KTP tidak boleh kurang dari 10Kilobyte";
        }
        if (size_image >= 5000000) {
            return "Foto KTP tidak boleh lebih dari 5MB";

        }
        if (checkFileImage(val_file) === false) {
            return "Mohon masukkan foto KTP sesuai dengan format JPG, JPEG, JPE, PNG";
        }
        if (in_proses_resize === true) {
            if (fails_file_upload === true) {
                return "Foto KTP yang anda masukkan salah";
            }
        }
    }
}

function checkFileImage(temp_name) {

    var val = temp_name;
    switch (val.substring(val.lastIndexOf('.') + 1).toLowerCase()) {
        case 'jpg':
        case 'png':
        case 'jpeg':
        case 'jpe':
            return true;
        default:
            if (val === "" || val === null) {
                error_message_ktp = 'Foto KTP kosong';
                return false;
            } else {
                error_message_ktp = 'Format foto KTP salah';
                return false;
            }
    }
}

function doRegistrasi() {
    jQuery("#ajaxSpinnerContainer").removeClass('hidden').show();
    //          var formData = new FormData($("#registrasiAgen")[0]);
    var file = jQuery('[name=fktp]').get(0).files[0];
    var field_ktp = jQuery('input[name=fktp]');
    var width_image = jQuery(field_ktp).width();
    var height_image = jQuery(field_ktp).height();

    var img = new Image();

    img.src = window.URL.createObjectURL( file );

    img.onload = function() {
        var width_image = img.naturalWidth,
            height_image = img.naturalHeight;

        window.URL.revokeObjectURL( img.src );

        if(width_image <= 640 && height_image <= 640 ){
            doProcessRegistrasi(file);
        } else {
            canvasResize(file, {
                width: 0,
                height: 0,
                crop: false,
                quality: 70,
                //  rotate: 90,
                callback: function (data, width, height) {
                    if (data.status !== false) {
                        var f = canvasResize('dataURLtoBlob', data);
                        f.name = file.name;
                        doProcessRegistrasi(f);
                    } else {
                        failsMessageResize();
                    }
                }
            });
        }
    };

    in_proses_resize = true;
    var prosesResize = setInterval(function () {
        if (in_proses_resize === true) {
            failsMessageResize();
            in_proses_resize = false;
            clearInterval(prosesResize);
        }

    }, 10000);
}

function failsMessageResize() {
    fails_file_upload = true;
    showErrorMessage('Foto KTP yang anda masukkan salah');
    jQuery("#ajaxSpinnerContainer").removeClass('hidden').hide();
    jQuery("input[name=file_extension]").validationEngine('validate');
}

function resetSendFotoKTP() {
    fails_file_upload = false;
    in_proses_resize = false;
}

function showErrorMessage(text) {

    jQuery('#validate-error #error_message').text(text);
    jQuery('#validate-error').modal('show');
}

function doProcessRegistrasi(file_temp) {
    in_proses_resize = false;
    var formData = new FormData();
    // var file = jQuery('[name=fktp]').get(0).files[0];
    try {
        var str = navigator.userAgent;
        var rgxp = new RegExp('UCBrowser', "g");
        var res = str.match(rgxp);
        if (res !== null) {
            var file = jQuery('[name=fktp]').get(0).files[0];
            file_temp = file;
        }
    } catch (e) {
    }
    jQuery('.agent_name').text(jQuery('input[name=full_name]').val());
    formData.append('name', jQuery('input[name=full_name]').val());
    formData.append('token', jQuery('input[name=_token]').val());
    formData.append('email', jQuery('input[name=email]').val());
    formData.append('phonenumber', jQuery('input[name=phonenumber]').val());
    formData.append('alamat', jQuery('input[name=alamat]').val());
    formData.append('pekerjaan_id', jQuery('[name=pekerjaan]').val());
    formData.append('provinsi_id', jQuery('[name=provinsi]').val());
    formData.append('kota_id', jQuery('[name=kabupaten]').val());
    formData.append('kecamatan_id', jQuery('[name=kecamatan]').val());
    formData.append('kelurahan_id', jQuery('[name=kelurahan]').val());
    formData.append('kode_pos', jQuery('input[name=kode_pos]').val());
    formData.append('fktp', file_temp);
    formData.append('code', jQuery('input[name=refferal_code]').val());
    formData.append('nik_fo', jQuery('input[name=nik_fo]').val());
    //    formData.append('recaptcha_response_field', jQuery('[name="recaptcha_response_field"]').val());
    //    formData.append('recaptcha_challenge_field', jQuery('[name="recaptcha_challenge_field"]').val());
    formData.append('file_extension', jQuery('input[name=file_extension]').val());

    jQuery.ajax({
        url: base_url + '/registrasi',
        type: 'post',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        dataType: 'json'
    }).done(function (obj) {
    //        javascript:Recaptcha.reload("t");
        jQuery("#ajaxSpinnerContainer").hide();
        if (obj.code == '1000')
        {
            try {
                ga('send', 'event', 'Registration', 'Submission', 'Success');
            } catch (e) {

            }
            setDefaultSelect('all');
            jQuery('#registrasiAgen')[0].reset();

            //jQuery('#validate-berhasil').modal('show');
            window.location.href = base_url + '/registrasi' + '/success/' + obj.message.key;
            jQuery("#ajaxSpinnerContainer").show();
        }
        else
        {
            var is_error = false;
            try {
                jQuery.each(obj.message, function (index, val_data) {
                    showErrorMessage(val_data);
                    is_error = true;
                    return false;
                });
            } catch (e) {
                showErrorMessage(jQuery.trim(obj.message));
            }
            console.log(showErrorMessage(jQuery.trim(obj.message)));

            if (is_error === false) {
                //  alert(jQuery.trim(obj.message));
                showErrorMessage(jQuery.trim(obj.message));
            }
            if (jQuery.trim(obj.message) == jQuery.trim('Email yang Anda masukkan sudah digunakan.')) {
            //                is_email_error = true;
                showErrorMessage("Email yang Anda masukkan sudah digunakan.");

            } else if (jQuery.trim(obj.message) == jQuery.trim('Nomor telepon yang anda masukkan telah digunakan.')) {
            //                is_phonenumber_error = true;
                showErrorMessage("Nomor telepon yang Anda masukkan sudah digunakan.");

            } else if (jQuery.trim(obj.message) == jQuery.trim('Kode referral salah')) {
                showErrorMessage("Kode referral Yang anda Masukkan Salah");
            }
        }

        //jQuery(document).scrollTop( jQuery("#form-regitration").offset().top );

    }).fail(function () {
        showErrorMessage('Terjadi kesalahan teknis, mohon di coba beberapa saat lagi.');
        jQuery("#ajaxSpinnerContainer").hide();
        // javascript:Recaptcha.reload("t");

    });
}
