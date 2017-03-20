$(document).ready(function() {
  $('.option').styleddropdown();
  $('.lowPrice').html(lowPrice);
  $('.box-select').click(function() {
    $('.list').css('display', 'block');
  });
  $('.list-event').click(function() {
    var value = $(this).attr('data-value');
    var data_price = $(this).attr('data-price');
    var data_item = $(this).attr('data-item');
    var data_item_id = $(this).attr('data-item-id');
    var data_atribute_pulsa = $(this).attr('data-atribute-pulsa');
    $('input[name="voucher"]').val(value);
    $('input[name="priceVoucher"]').val(data_price);
    $('input[name="itemname"]').val(data_item);
    $('input[name="items_id"]').val(data_item_id);
    $('input[name="detailAtribute"]').val(data_atribute_pulsa);
    var item = $(this).attr('data-item');
    var price = $(this).attr('data-harga');
    $('.data-fake-price').html('<span class="pull-left harga-voucher"><b>' + item + '</b></span> <span class="pull-right harga-ori"> ' + price + '</span>');
  });
  $('.voucherAppend').change(function() {
    var pulsa_ = $('option:selected', this).attr('data-atribute-pulsa');
  });
});

function showRequest(formData, jqForm, options) {}

function showResponse(responseText, statusText, xhr, $form) {
  if (responseText.status) {
    window.location = responseText.url;
  } else {
    $('.alert-warning').html(msgAlert(responseText.message, 'danger'));
  }
}

function geThanPulsa(field, rules, i, options) {
  var field = field.val();
  if (field != "") {
    if (Number(field.length) < Number(10)) {
      return "Nomor yang Anda masukan Salah !";
    }
  }
}

function btnPulsaOnclikcListener() {
  var frm_validate = jQuery("#validatePulsa").validationEngine('validate');
  if (frm_validate == true) {
    doProsesCekPulsa();
  }
}

function doProsesCekPulsa() {
  jQuery("#ajaxSpinnerContainer").show();
  var url = base_url + '/pulsa/cek-status';
  jQuery.ajax({
    url: url,
    data: {
      'hp': jQuery('input[name=hp]').val(),
      'voucher': jQuery('input[name=voucher]').val(),
      'itemname': jQuery('input[name=itemname]').val(),
      'pulsa_name': pulsa_name
    },
    dataType: 'json'
  }).done(function(obj) {
    data = obj;
    jQuery("#ajaxSpinnerContainer").hide();
    if (data.guest_mode) {
      var link = $('#auth_login').attr('href');
      var replaceLink = link + "&no=" + $('.hp').val();
      $('#auth_login').attr('href', replaceLink);
      cart_green_popup(data.message_cart, data.message_cart_header, data.guest_mode);
    } else {
      if (obj.code == '1000') {
        jQuery('#validatePulsa').submit();
      } else {
        var msg = obj.message;
        if (obj.message.is_waiting == true) {
          showErrorMessage(msg, 'Tunggu Sebentar...');
        } else {
          showErrorMessage(msg, 'Ups!');
        }
      }
    }
  }).fail(function() {
    showErrorMessage(errorMessage, 'Error');
    jQuery("#ajaxSpinnerContainer").hide();
  });
}

function showErrorMessage(message, title) {
  $(".modal-title").text(title);
  $("#message_voucher").html(message);
  $("#modal_wrong_voucher").modal("show");
}

function hide(target) {
  document.getElementById(target).style.display = 'none';
}
document.getElementById('phone-number').onkeydown = function(e) {
  if (e.keyCode == 13) {
    btnPulsaOnclikcListener();
  }
};

function toHome(){
    window.location = linkHome;
}
