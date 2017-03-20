function getTerm(){
    var checkContent = $('.page-form-term').text();
    if (checkContent == "")
    {
        $.ajax({
            type: 'get',
            url: "{{URL::to('/shipping/get-term')}}",
            dataType: 'json',
            beforeSend: function(data) {

            },
            success: function(retval) {
                $('.page-form-shipping').hide();
                $('.page-form-term').html(retval.html).show();
            }
        });
    }
    else
    {
        $('.page-form-term').show('slow');
        $('.page-form-shipping').hide();
    }
}


$("#opsipengiriman").hide();
setpostcode(false);
jQuery('.form-shipping-new input,.form-shipping-new select').on('keydown',function(){
    $(this).validationEngine('hide');
})
jQuery('.form-shipping-new input,.form-shipping-new select').on('change',function(){
    $(this).validationEngine('hide');
})
function append_list_to_select(data, select_class, value_identifier, name_identifier, postal_code_identifier)
{
     $("."+select_class).empty();

      $.each(data, function( index, value ) {

        if(postal_code_identifier)
            var option_line = "<option value=\""+ value[value_identifier] +"\" data-kodepos=\""+ value[postal_code_identifier] +"\">"+value[name_identifier] +"</option>";
        else
            var option_line = "<option value=\""+ value[value_identifier] +"\">"+value[name_identifier] +"</option>";

        $("."+select_class).append(option_line);
      });
}

function setdefault(select_class, value_name)
{
    var option_line = "<option value=\"\" selected disabled>"+ value_name +"</option>";
    $("."+select_class).html(option_line);
}

function prepend_opt(select_class, value_name)
{
    var option_line = "<option value=\"\" selected disabled>"+ value_name +"</option>";
    $("."+select_class).prepend(option_line);
}

function setpostcode(postcode)
{
    if(postcode){
        $('.kodepos').validationEngine('hide');
        $('.kodepos').val(postcode);
    }else
        $('.kodepos').val("");
}

$('.prov').change(function() {
    setdefault('kecamatan', ' ---- Kecamatan ---- ');
    setdefault('kelurahan', ' ---- Kelurahan ---- ');
    $("#opsipengiriman").hide();
    setpostcode(0);
    var provinsi_id = $(this).val();
    $.ajax({
        type: 'post',
        url: getKabKot,
        data: {
            provinsi_id: provinsi_id
        },
        dataType: 'json',
        beforeSend: function(data) {

        },
        success: function(retval) {
            //setname();
            var jsonObj = retval;
            OnMaintenanceServerListener(jsonObj);
            if (retval.status == 200)
            {
                append_list_to_select(retval.listdata, 'kabkot', 'kabupaten_id', 'kabupaten_name');
                prepend_opt('kabkot', 'Pilih Kota/Kabupaten');
            }
            else
            {
                sa_popup("BE Error", "Error");
            }
        }
    });
});

$('.kabkot').change(function() {
    var provinsi_id = $('.prov').val();
    var kota = $(this).val();
    setdefault('kelurahan', ' ---- Kelurahan ---- ');
    $("#opsipengiriman").hide();
    setpostcode(0);

    $.ajax({
        type: 'post',
        url: getKecamatan,
        data: {
            provinsi_id: provinsi_id,
            kota: kota
        },
        dataType: 'json',
        beforeSend: function(data) {

        },
        success: function(retval) {
            var jsonObj = retval;
            OnMaintenanceServerListener(jsonObj);
            if (retval.status == 200)
            {
                append_list_to_select(retval.listdata, 'kecamatan', 'kecamatan_id', 'kecamatan_name');
                prepend_opt('kecamatan', 'Pilih Kecamatan');
            } else
            {
                sa_popup("BE Error", "Error");
            }
        }
    });
});

$('.kecamatan').change(function() {
    var kecamatan = $(this).val();
    var provinsi_id = $('.prov').val();
    var kota = $('.kabkot').val();
    $("#opsipengiriman").hide();
    setpostcode(0);
    $.ajax({
        type: 'post',
        url: getKelurahan,
        data: {
            kecamatan: kecamatan
        },
        dataType: 'json',
        beforeSend: function(data) {

        },
        success: function(retval) {
            var jsonObj = retval;
            OnMaintenanceServerListener(jsonObj);
            if (retval.status == 200)
            {
                append_list_to_select(retval.listdata, 'kelurahan', 'kelurahan_id', 'kelurahan_name', 'kode_pos');
                prepend_opt('kelurahan', 'Pilih Kelurahan');
            }
            else
            {
                sa_popup("BE Error", "Error");
            }
        }
    });
});

$('.kelurahan').change(function() {
    var element = $(this).find('option:selected');
    var kodepos = element.attr("data-kodepos");
    $('.kodepos').validationEngine('hide');
    $('.kodepos').val(kodepos);
    var kecamatan = $('.kecamatan').val();
    var provinsi_id = $('.prov').val();
    var kota = $('.kabkot').val();
    var kelurahan = $(this).val();
    $("#opsipengiriman").hide();
    $.ajax({
        type: 'post',
        url:getShippingCost,
        data: {
            district: kecamatan,
            province: provinsi_id,
            city: kota,
            sub_district: kelurahan,
        },
        dataType: 'json',
        beforeSend: function(data) {
            $("#ajaxSpinnerContainer").show();
        },
        error: function (request, status, error) {
            $("#ajaxSpinnerContainer").show();
            alert('Problem koneksi');
        },
        success: function(retval) {
            var jsonObj = retval;
            OnMaintenanceServerListener(jsonObj);
            $("#ajaxSpinnerContainer").hide();

            if (retval.cart_subtotal) {
                $("#subtotal_from_cart").attr('nominal',retval.cart_subtotal);
                $("#subtotal_from_cart").html(numRp(retval.cart_subtotal));
            }

            if (retval.listdata != "") {
                $('.event-desc-success').hide();
                $('.detailCart').html(retval.html);
                $("#opsipengiriman").show();
                $("#lanjut_klik").hide();

                show_lanjut_reg();
            }
            if(retval.message) {
                sa_popup(retval.message, "Error");
            }
        }
    });
});

$(".getPriceShipping").change(function(){
    alert('asdfas');
    show_lanjut_reg();
});

function getPriceShipping(){
    show_lanjut_reg();
}

function show_lanjut_reg()
{

    var cart_price = $("#subtotal_from_cart").attr('nominal');
    var element = $("select[name=shipping]").find('option:selected');
    var shipping_price = element.attr('data-price');
    var shipping_type = element.attr('value');
    var shipping_courier = element.attr('data-service');
    $("#shipping_cost").html(numRp(shipping_price));
    var total_price = parseInt(cart_price) + parseInt(shipping_price);
    $("#total_pay").attr('nominal', total_price);
    $(".label-total-belanja").html(numRp(total_price));

    $('input[name="shipping_cost"]').val(shipping_price);
    $('input[name="shipping_type"]').val(shipping_type);
    $('input[name="courier"]').val(shipping_courier);

    $("#lanjut_klik").show();
}

function geThan(field, rules, i, options){
    var field = field.val();
        field = field.trim();
        if (field != ""){
            var checkEmail  = validateEmail(field.trim());
            if (checkEmail == false){
                return "Email Yang  Anda Masukan Salah";
            }
        }
}

function geThanPhone(field, rules, i, options){
    var field = field.val();
        field = field.trim();
    if (isInt(field)){
        if (field.length >= 9 && field.length <= 15){
            var checkPrefix = field.substr(0, 1);
            if (checkPrefix == "+"){
                var checkPrefixPlus = field.substr(0, 3);
                if (checkPrefixPlus != '+62'){
                    return "Nomor HP Yang anda masukan salah !";
                }
            }else{
                var noHpdata = field.substr(0, 1);
                if (Number(noHpdata) !== Number(0)){
                    return "Nomor HP Yang anda masukan salah !";
                }
            }
        }else{
            return "Nomor HP Yang anda masukan salah !";
        }
    }
}

function isInt(value) {
        return !isNaN(value) &&
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

Number.prototype.formatMoney = function(c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function setname() {

    var prov = $('.prov').find('option:selected').text();
    var kecamatan = $('.kecamatan').find('option:selected').text();
    var kelurahan = $('.kelurahan').find('option:selected').text();
    var kabkot = $('.kabkot').find('option:selected').text();
    if ($('.prov').find('option:selected').val() != "") {
        $('input[name="province"]').val(prov);
    }
    if ($('.kecamatan').find('option:selected').val() != "") {
        $('input[name="kecamatan"]').val(kecamatan);
    }
    if ($('.kelurahan').find('option:selected').val() != "") {
        $('input[name="kelurahan"]').val(kelurahan);
    }
    if ($('.kabkot').find('option:selected').val() != "") {
        $('input[name="city"]').val(kabkot);
    }
}


function numRp(nStr)
{
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + '.' + '$2');
        }
        return 'Rp ' + x1 + x2;
}

function show_tooltip(tooltipArray)
{
    hideAllTooltip();
    var emptyFieldName = tooltipArray[0];
    var divName = "tooltip_"+emptyFieldName;
    $("#" + divName).removeClass("hide");

    $('html, body').animate({
        'scrollTop' : $("#" + divName).position().top
    });
}

function hideAllTooltip()
{
    var tooltips = ["address", "recipient_name", "phone_number", "email", "email_is_not_valid"];

    for (i = 0; i < tooltips.length; i++) {
        var divName = "tooltip_"+ tooltips[i];
        $("#"+divName).addClass("hide");
    }
}

function sa_popup(message, header, action, action_url, action_onclick)
    {
        if(message)
            $('#message_sa').html(message);
        else
            return FALSE;

        $('#title_sa').html("Informasi");
        if(header)
            $('#title_sa').html(header);

        $('#shippingAlert').modal('show');
    }

function setCounterText(idInput,idCounter, maxLength){
  $(idInput).keyup(function() {
    var length = $(this).val().length;
    var length = maxLength+length;
    $(idCounter).text(length);
  });
}
