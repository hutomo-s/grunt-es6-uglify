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
                error_message_ktp = 'Foto tidak boleh kosong';
                return false;
            } else {
                error_message_ktp = 'Format foto salah';
                return false;
            }
    }
}
var error_message_ktp = "";
var fails_file_upload = false;
var in_proses_resize = false;
function fileValidate() {
    var bankReceiptImage = jQuery('input[name=bank_receipt_image]');
    var val_file = bankReceiptImage.val();
    var field_ktp = bankReceiptImage;
    var freturn = true;
    if (val_file !== "") {
        var size_image = null;
        try {
            size_image = jQuery(field_ktp).get(0).files[0].size;
        } catch (e) {
            size_image = null;
        }
        if (size_image === null || val_file === null || val_file === "") {
            error_message_ktp = "Mohon masukkan foto sesuai dengan format yang ditentukan(JPE,JPEG,JPG,PNG)";
            freturn = false;
        }
        if (size_image < 10000) {
            error_message_ktp = "Foto tidak boleh kurang dari 10Kilobyte";
            freturn = false;
        }
        if (size_image >= 5000000) {
            error_message_ktp = "Foto tidak boleh lebih dari 5MB";
            freturn = false;
        }
        if (checkFileImage(val_file) === false) {
            error_message_ktp = "Mohon masukkan foto sesuai dengan format yang ditentukan(JPE,JPEG,JPG,PNG)";
            freturn = false;
        }
        if (in_proses_resize === true) {
            if (fails_file_upload === true) {
                error_message_ktp = "Foto yang anda masukkan salah";
                freturn = false;
            }
        }
    } else {
        error_message_ktp = "Mohon masukkan foto sesuai dengan format yang ditentukan(JPE,JPEG,JPG,PNG)";
        freturn = false;
    }
    return freturn;
}

function doValidation() {
    jQuery("#ajaxSpinnerContainer").removeClass('hidden').show();
    var file = jQuery('[name=bank_receipt_image]').get(0).files[0];
    in_proses_resize = true;
    canvasResize(file, {
        width: 0,
        height: 0,
        crop: false,
        quality: 50,
        callback: function (data, width, height) {
            if (data.status !== false) {
                var f = canvasResize('dataURLtoBlob', data);
                f.name = file.name;
                doSubmit(f);
            } else {
                doSubmit(file);
            }
        }
    });
    var prosesResize = setInterval(function () {
        if (in_proses_resize === true) {
            failsMessageResize();
            in_proses_resize = false;
            jQuery("#ajaxSpinnerContainer").removeClass('hidden').hide();
            clearInterval(prosesResize);
        }

    }, 10000);
}

function failsMessageResize() {
    fails_file_upload = true;
    var temp_empty_fields = [];
    var temp_error_msg = [];
    temp_empty_fields[0] = "bank_receipt_image";
    temp_error_msg[0] = error_message_ktp;
    show_tooltip(temp_empty_fields, temp_empty_fields);
}

$('input[name=jumlah]').number(true, 0, ',', '.');

$('select[name=bank_id]').change(function () {
    var bank_id = $(this).val();
    $('input[name=bank_id]').val(bank_id);
});

$('input[name=dari_rek_nama]').keyup(function (e) {

    if (this.value.match(/[^a-zA-Z ]/g)) {
        this.value = this.value.replace(/[^a-zA-Z ]/g, '');
    }
});

$("input[name=bank_receipt_image]").change(function () {
    var filename = $(this).val();
    $(".btn-img-upload").html('<img src="'+asset_pict+'" alt="Folder"/> '+filename);
    previewImg(this);
});

function previewImg(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var rec_img = $('#bank_receipt_image_filename');
            rec_img.html("").prepend('<img alt="Bukti Transfer" src="'+e.target.result+'"/>');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function doSubmit(file_image) {
    in_proses_resize = false;
    var form_fields = config_form_fields;
    var formData = new FormData();
    formData.append('bank_receipt_image', file_image);
    for (i = 0; i < form_fields.length; i++) {
        var inputIdentifier = "input[name=" + form_fields[i] + "]";
        formData.append(form_fields[i], $(inputIdentifier).val());
    }
    hideAllTooltip();
    $.ajax({
        url: submit_transfer,
        data: formData,
        method: "POST",
        contentType: false,
        processData: false,
        success: function (result) {
            var jsonObj = result;
            OnMaintenanceServerListener(jsonObj);
            $("#ajaxSpinnerContainer").hide();
            if (result.redirect)
                window.location = result.redirect;
            else if (result.empty_fields && result.error_msg)
                show_tooltip(result.empty_fields, result.error_msg);
            else if (result.message && result.message_header)
                cart_green_popup(result.message, result.message_header);
        }
    }).fail(function (err) {
        jQuery("#ajaxSpinnerContainer").removeClass('hidden').hide();
    });
}

$("#submit_transfer").click(function () {
    var file_validation = fileValidate();
    if (file_validation === true) {
        return doValidation();
    }
    else {
        var temp_empty_fields = [];
        var temp_error_msg = [];
        temp_empty_fields[0] = "bank_receipt_image";
        temp_error_msg[0] = error_message_ktp;
        show_tooltip(temp_empty_fields, temp_error_msg);
        return false;
    }
});

function show_tooltip(tooltipArray, errorMsgArray) {
    hideAllTooltip();
    var emptyFieldName = tooltipArray[0];
    var divName = "tooltip_" + emptyFieldName;
    $("#" + divName).removeClass("hide");
    $("#" + divName + " span").text(errorMsgArray[0]);
    $('html, body').animate({
        'scrollTop': $("#" + divName).position().top
    });
}

function hideAllTooltip() {
    var tooltips = config_tooltips;
    for (i = 0; i < tooltips.length; i++) {
        var divName = "tooltip_" + tooltips[i];
        $("#" + divName).addClass("hide");
    }
}