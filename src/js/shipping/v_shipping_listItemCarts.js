$(".pay-shipping").click(function()
{
    var check = checkValidateData();
    if (check) {
        var postShipping = $('#addshipping').serializeArray();
        postShipping.push({ name: "province", value: trim($(".prov option:selected").text()) });
        postShipping.push({ name: "city", value: trim($(".kabkot option:selected").text()) });
        postShipping.push({ name: "kecamatan", value: trim($(".kecamatan option:selected").text()) });
        postShipping.push({ name: "kelurahan", value: trim($(".kelurahan option:selected").text()) });
        postShipping.push({ name: "shipping_name", value: trim($(".shippingName option:selected").text()) });
        $.ajax({
            type: 'post',
            url: urlShippingOrder,
            dataType: "json",
            data: postShipping,
            beforeSend: function(data) {
                $("#ajaxSpinnerContainer").show();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $("#ajaxSpinnerContainer").hide();
            },
            success: function(data) {
                if (data.status == false) {
                    activateModal('Pengiriman Tak Tersedia', data.message);
                    //return false;
                } else if (data.status == 500) {
                    activateModal('Pengiriman Tak Tersedia', data.error_msg);
                } else {
                    ga_tracker('transaction', 'Lanjut - Pengiriman Address');
                    window.location = data.redirect;
                }
            }
        });
    }
});

function checkValidateData() {
    var  allow  = ['address_detail','saveAddress','courier'];
    var statusCode = [];
    var phoneVal = $('input[name="phone_number"]').val();

    $('#addshipping *').filter(':input').each(function(){
      var name = $(this).attr('name');
        if (typeof name != 'undefined') {
            $('span.'+name).hide();
            var value =  $(this).val();
            if (value == "" || value === null){
                if ( Number($.inArray( name, allow )) == Number(-1) ) {
                    $('span.'+name).show();
                    scrollToError(name);
                    statusCode.push(false);
                    return false;
                }
            }else{
                if(name == "phone_number"){
                  var statusPhone = validatePhoneNumber(phoneVal);
                  if (statusPhone != true){
                    $('span.'+name).show();
                    $('span.'+name).text("Nomor telepon tidak sesuai");
                    statusCode.push(false);
                    scrollToError(name);
                    return false;
                  }
                }
            }
        }
    });
    if(statusCode.length > 0){
        return false;
    } else {
        return true;
    }
}


$('.link-preview').click(function (){
    var slug = $(this).attr('slugUrl');
    $.ajax({
        type: 'get',
        url: urlCheckDetail,
        dataType: "json",
        data: { itemName : slug },
        beforeSend: function(data) {
            $("#ajaxSpinnerContainer").show();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#ajaxSpinnerContainer").hide();
        },
        success: function(data) {
            var idDetailItems = $('#myDetaiItem');
            if (data.status) {
                $('#myFormNav').addClass('hidden');
                idDetailItems.removeClass('hidden');
                document.getElementById("myDetaiItem").style.width = "480px";
                var content = $('#myDetaiItem').html(data.html);
                var backForm = content.find('.back-form');
                // hide header
                $('#header').hide();
                // remove loading
                content.find('#ajaxSpinnerContainer').hide();
                // remove footer
                content.find('.footer').hide();

                backForm.click(function(){
                    var idDetailItems = $('#myDetaiItem');
                    idDetailItems.addClass('hidden');
                    $('#myFormNav').removeClass('hidden');
                });
                $('.btn-form-bayar').removeClass('hidden');
            } else {
                activateModal('Ops!', data.message);
            }
        }
    });

});

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

function scrollToError(nameSpan){
  $('#myFormNav').animate({
      scrollTop: $('input[name="'+nameSpan+'"]').offset().top
  }, 2000);
}
