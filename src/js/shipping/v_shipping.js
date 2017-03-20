$("#opsipengiriman").hide();
$('#buyerNote').hide();
$('.checkNumber').click(function()
{
    var url = $(this).attr('data-get');
    window.location = url;
});
$(document).ready(function()
{
    if(shipping_selected_data_key != "")
    {
        var input_selector = "input:radio[class=iradio][data-key="+ shipping_selected_data_key +"]";
        $(input_selector).prop("checked", true);
        $(input_selector).click();
    }
});
$('input[name="hp"]').bind('keypress', function (e)
{
        if(e.which == 48 || e.which == 49 || e.which == 50 || e.which == 51 || e.which == 52 ||
            e.which == 53 || e.which == 8 || e.which == 13 ||
            e.which == 54 ||e.which == 55 ||e.which == 56 ||e.which == 57
            ){
        }else{
            e.preventDefault();
            return false;
        }
});
function setdefault(select_class, value_name)
{
    var option_line = "<option value=\"\" selected disabled>"+ value_name +"</option>";
    $("."+select_class).html(option_line);
}
$( document ).on('click', '.iradio', function(){
    $("select[name=shipping]").empty();
    $("#opsipengiriman").hide();
    $('#buyerNote').hide();
    var kecamatan       =  $(this).attr('data-kecamatan_id');
    var provinsi_id     =  $(this).attr('data-province_id');
    var kota            =  $(this).attr('data-city_id');
    var kelurahan       =  $(this).attr('data-kelurahan_id');
    var data_key = $(this).attr('data-key');
    var phone = data_hp;
    var selectorHere = $(this);
    var cloneHtml = selectorHere.parent().html();
    var parentNameListAddress = ".list-address";
    var childeNameListAddress   = ".list-address-items-1";
    var clone = $(childeNameListAddress).html();
    $("input[name=iradio_key]").val(parseInt(data_key));
    $.ajax({
        type: 'post',
        url: urlPostOrder,
        dataType: "json",
        data: {
            district   : kecamatan,
            province : provinsi_id,
            city        : kota,
            sub_district   : kelurahan,
            data_key: data_key,
            phone: phone,
            existingNumber : true,
        },
        beforeSend: function(data) {
            $("#ajaxSpinnerContainer").show();
        },
        success: function(retval) {
            $.getScript(baseSrc+'js/shipping/v_shipping_listItemCarts.js');
            if($(parentNameListAddress).find(childeNameListAddress).length != 0 && !$('#myNav').hasClass('hidden') ){
                $(childeNameListAddress).html(selectorHere.parent().html());
                selectorHere.parent().html(clone);
                $('.close-overlay').trigger('click');
                $(childeNameListAddress).children('.iradio').attr('checked', true);
            }
            var jsonObj = retval;
            OnMaintenanceServerListener(jsonObj);
            $("#ajaxSpinnerContainer").hide();
            if(retval.cart_subtotal) {
                $("#subtotal_from_cart").attr('nominal',retval.subtotal);
                // $("#subtotal_from_cart").html(numRp(retval.subtotal));
            }
            if(retval.listdata){
                $("#opsipengiriman").show();
                $('#buyerNote').show();
                hide_temporary_note();
                $("#lanjut_klik").hide();
                var shipping_data = retval.listdata;
                var shipping_cost_vendor = "";
                var unique_shipping_cost = "";
                var unique_shipping_cost_vendor = "";
                $.each(shipping_data, function( index, value ) {
                    if (value.details != ""){
                        if (value.price_vendor != ""){
                            shipping_cost_vendor = "shipping_cost_vendor='"+value.price_vendor+"'";
                        }
                    }
                    var data_detail = "";
                    if (value.details != ""){
                        data_detail = btoa(JSON.stringify(value.details));
                    }
                    var option_line = "<option insurance_cost='"+value['insurance_cost']+"'  shipping_detail='"+value['shipping_detail']+"'   dataDetail = '"+data_detail+"'  value=\""+ value['shipping_type'] +"\"    "+shipping_cost_vendor+" data-price=\""+ value['price'] +"\" data-service=\""+ value['service'] +"\">"+value['name'] +"</option>";
                    $("select[name=shipping]").append(option_line);
                });
                show_lanjut();
                scrollToBottom();
            }
            if(retval.message)
            {
                activateModal('Pengiriman Tak Tersedia', retval.message);
            }

        },
        error(){
            activateModal('Ups', "Terjadi kesalahan pada Kudo. Mohon maaf atas ketidaknyamanan Anda. Hubungi layanan pelanggan Kudo bila Anda mengalami kesulitan.");
        }
    });
});
$("select[name=shipping]").change(function(){
    show_lanjut();
});
function show_lanjut()
{
    var cart_price = $("#subtotal_from_cart").attr('nominal');
    var element = $("select[name=shipping]").find('option:selected');
    var shipping_price = element.attr('data-price');
    var shipping_type = element.attr('value');
    var shipping_courier = element.attr('data-service');
    $("#shipping_cost").html(numRp(shipping_price));
    var total_price = parseInt(cart_price) + parseInt(shipping_price);
    $("#total_pay").attr('nominal', total_price);
    $("#total_pay").html(numRp(total_price));
    $('input[name="shipping_cost"]').val(shipping_price);
    $('input[name="shipping_type"]').val(shipping_type);
    $('input[name="courier"]').val(shipping_courier);
    $("#lanjut_klik").show();
}
function hide_temporary_note()
{
    $("#temporary_note").html("");
}
function reOrderCancel(){
    $('input[name="reOrder"]').val('false');
    $('#penyesuaian-harga').modal('hide');
}
function reOrder(){
    $('input[name="reOrder"]').val('true');
    $("#ajaxSpinnerContainer").show();
    $('#penyesuaian-harga').modal('hide');
    $( "#lanjut_klik" ).trigger( "click" );

}

$("#lanjut_klik_check").click(function(){
    var input = $('input[name="hp"]');
    var getInput = input.val();
    var check = validatePhoneNumber(getInput);

    if (getInput != "" && check != false) {
        $('.form-shipping-index').submit();
    } else {
        input.focus().css('border-color', 'red');
        $('.validate-shipping').show();
    }
});


$("#lanjut_klik").click(function()
{
        var iradio_key = $("input[name=iradio_key]").val();
        var shipping_data = {};
        var shipping_data               = list_address[iradio_key];
        shipping_data['seller_name']        = $('input[name="seller_name"]').val();
        shipping_data['reOrder']        = $('input[name="reOrder"]').val();
        shipping_data['shipping_cost']  = $('input[name="shipping_cost"]').val();
        shipping_data['shipping_type']  = $('input[name="shipping_type"]').val();
        shipping_data['courier']        = $('input[name="courier"]').val();
        shipping_data['notes']          =  $('input[name="notes"]').val();
        shipping_data['insurance_cost'] =  $( ".opsikirim option:selected" ).attr('insurance_cost');
        shipping_data['shipping_detail'] =  $( ".opsikirim option:selected" ).attr('shipping_detail');
        shipping_data['shipping_name']  =  $( ".opsikirim option:selected" ).attr('data-service');
        if ($( ".opsikirim option:selected" ).attr('datadetail') != "")
        {
            shipping_data['datadetail']             =  $( ".opsikirim option:selected" ).attr('datadetail');
        }
        if ($( ".opsikirim option:selected" ).attr('shipping_cost_vendor') != "")
        {
            shipping_data['shipping_cost_vendor']           =  $( ".opsikirim option:selected" ).attr('shipping_cost_vendor');
        }
        $.ajax({
            type: 'post',
            url:urlShippingOrder,
            dataType: "json",
            data: shipping_data,
            beforeSend: function(data) {
                $("#ajaxSpinnerContainer").show();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                activateModal("Error", "Ups Jaringan Kudo Sedang Mengalami masalah silahan coba kembali");
                $("#ajaxSpinnerContainer").hide();
            },
            success: function(data) {
                var jsonObj = data;
                OnMaintenanceServerListener(jsonObj);
                $("#ajaxSpinnerContainer").hide();
                if (data.status ==  2014){
                    $('#penyesuaian-harga').modal('show');
                    var html_append = "";
                    if (data.message.isErrorItemPrice.before != ""){
                        $(data.message.isErrorItemPrice.before).each(function (index,value){
                            var afterPrice = data.message.isErrorItemPrice.after[index].price;
                             html_append += '<div class="row"> <div class="col-xs-3 padding-lr-nol"> <img src="'+value.image_url+'" alt="" class="img-responsive"/> </div><div class="col-xs-9"> <div class="row"> <div class="col-xs-6 product-name-chart no-pd"> <div class="dt-order"> <div class="dt-product-name primary-black" style="font-size: 12px">'+value.item_name+'</div></div></div><div class="col-xs-6 product-price-chart" align="right"> <div class="dt-info-price primary-black" style="font-size: 12px;width: 100px;"> <p class="font-bold" style="text-align: left;">Sebelumnya:</p><p style="text-align: right;">'+value.price+'</p><p class="font-bold" style="text-align: left;">Menjadi:</p><p style="text-align: right;">'+afterPrice+'</p></div></div></div></div></div>';
                        });
                    }
                    $('.items-data').html(html_append);
                }else{
                    if(data.redirect)
                    {
                        ga_tracker('transaction', 'Lanjut - Pengiriman Address');
                        window.location = data.redirect;
                    }
                    if(data.error_msg)
                    {
                        activateModal("Error", data.error_msg);
                    }
                    if(data.message)
                    {
                        activateModal("Error", data.message);
                    }
                }
            }
        });

});
function trim(param){
	return param.replace(/^\s+|\s+$/g,"");
}


function orderNewKnow(){
    ajax({
        type: 'post',
        url: urlShippingOrderParameter,
        dataType: "json",
        data: shipping_data,
        beforeSend: function(data) {
            $("#ajaxSpinnerContainer").show();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            activateModal("Error", "Ups Jaringan Kudo Sedang Mengalami masalah silahan coba kembali");
            $("#ajaxSpinnerContainer").hide();
        },
        success: function(data) {

        }
    });
}

function sa_popup(message, header, action, action_url, action_onclick)
{
    if(message)
    {
        $('#message_sa').html(message);
    }
    else
    {
        return FALSE;
    }

    $('#title_sa').html("Informasi");
    if(header)
    {
        $('#title_sa').html(header);
    }
    $('#shippingAlert').modal('show');
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
        if (x2 != ''){
            return 'Rp ' + x1;
        }else{
            return 'Rp ' + x1 + x2;
        }
}
function scrollToBottom()
{
    $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
}
function OnMaintenanceServerListener(data){
    try{
        var jsonObj = data;
        if(typeof jsonObj.maintenance != 'undefined'){
            window.location.href=jsonObj.maintenance_url;
            exit;
        }
    }catch(e){
    }
}

function activateModal(title, content, eventButton) {
    // initialize modal element
    $('.title-dialog').html(title);
    $('.content-dialog').html(content);
    $('.button-dialog').html('Close');
    var modalEl = document.createElement('div');
    var options = {
        'keyboard': true, // teardown when <esc> key is pressed (default: true)
        'static': false, // maintain overlay when clicked (default: false)
        'onclose': function enableScroll() {
                      // enable scrolling and bounce effect on Safari iOS
                      document.ontouchmove = function(e) { return true; }
                  } // execute function when overlay is closed
    };
    modalEl.style.width           = '80%';
    modalEl.style.maxWidth        = '300px';
    modalEl.style.height          = '180px';
    modalEl.style.margin          = 'auto';
    modalEl.style.position        = 'absolute';
    modalEl.style.top             = '0';
    modalEl.style.left            = '0';
    modalEl.style.bottom          = '0';
    modalEl.style.right           = '0';
    modalEl.style.backgroundColor = '#fff';
    modalEl.style.webkitOverflowScrolling = 'touch';
    modalEl.style.verticalAlign   = 'middle';

    modalEl.innerHTML = $('#modal_wrapper').html();
    // modalEl.getElementsByClassName("content-dialog").innerHTML = "xxxxx";

    // show modal
    mui.overlay('on', options, modalEl);

    // disable scrolling and bounce effect on Safari iOS
    document.ontouchmove = function(e){ e.preventDefault(); e.stopPropagation(); }
}

function closeModal() {
    modalEl = document.getElementById('#modal_wrapper');
    mui.overlay('off', modalEl);
    // enable scrolling and bounce effect on Safari iOS
    document.ontouchmove = function(e) { return true; }
}
var navAddress = $('#myNav');
$('.event-address').click(function (){

    if(navAddress.hasClass('hidden')){
        navAddress.removeClass('hidden');
        document.getElementById("myNav").style.width = "480px";
    }else{
        navAddress.addClass('hidden');
        document.getElementById("myNav").style.width = "0%";
    }
})
var navAddressForm = $('#myFormNav');
$('.event-address-form').click(function (){

    if(navAddressForm.hasClass('hidden')){
        navAddressForm.removeClass('hidden');
        document.getElementById("myFormNav").style.width = "480px";
    }else{
        navAddressForm.addClass('hidden');
        document.getElementById("myFormNav").style.width = "0%";
    }
})
$('.closebtn').click(function(){
    hideOverLay();
});
$('.close-overlay').click(function(){
    hideOverLay();
});
function hideOverLay(){
    navAddress.addClass('hidden');
    document.getElementById("myNav").style.width = "0%";
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
            rpathData :rpathData,
        },
        dataType: 'json',
        beforeSend: function(data) {
            $("#ajaxSpinnerContainer").show();
        },
        error: function (request, status, error) {
            $("#ajaxSpinnerContainer").show();
        },
        success: function(retval) {
        if (retval.status != 500){
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
                $('.btn-form-bayar').show();
                show_lanjut_reg_new();
            }
            if(retval.message) {
                activateModal(retval.message, "Error");
            }
        } else {
            $(".btn-form-bayar").hide();
            activateModal('Error', retval.message);
        }
    }
    });
});

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

$('#getPriceShipping').change(function (){
        show_lanjut_reg_new();
})

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
    $(".label-total-belanja").html("Total Belanja"+numRp(total_price));
    $('input[name="shipping_cost"]').val(shipping_price);
    $('input[name="shipping_type"]').val(shipping_type);
    $('input[name="courier"]').val(shipping_courier);

    $("#lanjut_klik").show();
}
function show_lanjut_reg_new()
{
    var cart_price = $("#subtotal_from_cart").attr('nominal');
    var element = $("#getPriceShipping").find('option:selected');
    var shipping_price = element.attr('data-price');
    var shipping_type = element.attr('value');
    var shipping_courier = element.attr('data-service');
    $("#shipping_cost_new_address").html("Biaya pengiriman "+numRp(shipping_price));
    var total_price = parseInt(cart_price) + parseInt(shipping_price);
    $("#total_pay").attr('nominal', total_price);
    $(".label-total-belanja").html(numRp(total_price));

    $('input[name="shipping_cost"]').val(shipping_price);
    $('input[name="shipping_type"]').val(shipping_type);
    $('input[name="courier"]').val(shipping_courier);
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


    function setCounterText(idInput,idCounter){
      $(idInput).keyup(function() {
        var inputLength = $(this).val().length;
        $(idCounter).text(inputLength);
      });
    }

    function  validatePhoneNumber(phone){
        if (phone.length >= 9 && phone.length <= 13){
                var checkPrefix = phone.substr(0, 1);
                if (checkPrefix == "+"){
                    var checkPrefixPlus = phone.substr(0, 3);
                    if (checkPrefixPlus != '+62'){
                        return false;
                    }
                }else{
                    var noHpdata = phone.substr(0, 1);
                    if (Number(noHpdata) !== Number(0)){
                        return false;
                    }
                }
        }else{
            return false;
        }
        return true;
    }
