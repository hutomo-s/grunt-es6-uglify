function setToPay(){
  if (statusOutOfStock.indexOf(true) === -1 || statusOutOfStock == []) {
    $('#modal_pin').modal('show');
    ga_tracker('transaction','Bayar - Detail');
  }else{
    if (statusOutOfStock.indexOf(false) === -1) {
        var message = "Transaksi Tidak Dapat Dilanjutkan, Stok barang di transaksi ini telah habis. Apakah Anda tertarik untuk melihat barang lainnya?";
        showModalOutOfStock(message, "TUTUP", "CARI BARANG", "allOfStock");
        $('#modalOutOfStock').modal();
    }else{
        var message = "Terdapat item yang habis stok, apakah Anda ingin melanjutkan transaksi dengan item yang tersedia?";
        showModalOutOfStock(message, "TUTUP", "YA" );
        $('#modalOutOfStock').modal();
    }
  }
}

function showModalOutOfStock(message, btnLeft, btnRight, modal){
  $('.modal-body').text(message);
  $('#modal-btnLeft').text(btnLeft);
  $('#modal-btnRight').text(btnRight);
  $('#modalOutOfStock').modal();

  var order_item_ids = [];
  var reference = order.reference;
  var itemNames = "";
  var vendorID = "";
  for (var i in orderItems) {
    if (orderItems[i].out_of_stock == false) {
      order_item_ids.push(orderItems[i].order_item_id);
    }
    itemNames = orderItems[i].item_name;
    vendorID = orderItems[i].item_name;
  }
  $('#modal-btnRight').click(function(){
    if (modal != "allOfStock"){
      var dataOutOfStock =
        {
            "order_id" : order.order_id,
            "order_items" : order.order_items,
            "order_item_ids": order_item_ids,
            "reference": reference,
            "rpath" : rpathReOrder
        }
      $.ajax({
          url: URLOrderOutOfStock,
          method: "post",
          dataType: "json",
          data: dataOutOfStock
      }).done(function (retVal) {
        if(retVal.status){
          window.location  = retVal.redirect;
        }
        else{
        }
      }).fail(function () {
      });
    }else{
      window.location.href = urlHome;
  }
  });
}

var onCekVoucher = function () {
    jQuery("#loading_page").removeClass("hidden").show();
    var voucher = jQuery("input[name='voucher']").val();
    if (voucher.toString().trim() != '' && voucher.toString().trim() != null) {
        var temp_data = jQuery("#form-voucher").serializeArray();
        hideMessage();
        try {
            jQuery.ajax({
                url: base_url + '/agent/order/check-voucher',
                method: "post",
                dataType: "json",
                Accept: 'application/json',
                data: temp_data
            }).done(function (data_parser) {
                var jsonObj = data_parser;
                OnMaintenanceServerListener(jsonObj);
                if (data_parser.status == true) {
                    jQuery("#form-voucher").hide();
                    var total_order = jQuery("#total_order").attr('data-nominal');
                    total_order = total_order - Number((data_parser.response.message.nominal) - (data_parser.response.message.use_voucher));
                    if (total_order < 0) {
                        total_order = 0;
                    }
                    jQuery('.msg-success-voucher').css("padding-top", "10px");
                    jQuery('.msg-success-voucher').css("padding-bottom", "10px");
                    jQuery("#total_order").html(getRp(total_order));
                    var count_nominal = Number((data_parser.response.message.nominal) - (data_parser.response.message.use_voucher));
                    // var html = "Voucher: " + voucher + "<br>" + "Nominal: " + getRp(count_nominal);

                    var code_voucher = data_parser.response.message.code_voucher;

                    jQuery("#total-voucher").html("-"+getRp(count_nominal));

                    var Nominal=Number(jQuery("#total-bayar-ready-to-pay").attr("data-nominal"));
                    var sum =Number(Nominal-( count_nominal));
                    if(sum<0){
                        sum=0;
                    }
                    jQuery("#total-bayar-ready-to-pay").text(getRp(sum));
                    jQuery("#code-voucher").text(code_voucher);
                    jQuery("input[name='voucher_code']").val(code_voucher);
                    jQuery(".block-form-voucher").hide();
                    jQuery(".box-detail-voucher").removeClass('hidden');

                } else {
                    if (data_parser.response == null) {
                        voucher_popup(data_parser.message);
                    } else {
                        voucher_popup(data_parser.response.message);
                    }
                    jQuery("#voucher_val").text(voucher);
                }
            }).fail(function () {
                jQuery("#loading_page").hide();
                jQuery("#voucher_message").text('Saat ini Server Sedang Mengalami Gangguan, Mohon di Coba Beberapa Saat Lagi Kembali.');
                jQuery("#error_jaringan").modal("show");
            });
        } catch (e) {
            jQuery("#voucher_message").text('Saat ini Server Sedang Mengalami Gangguan, Mohon di Coba Beberapa Saat Lagi Kembali.');
            jQuery("#error_jaringan").modal("show");
        }
        //$("#form-voucher :input").prop("disabled", true);
    } else {
        showMessage("Code Voucher tidak boleh kosong");
    }
    jQuery("#loading_page").hide();

}

function showMessage(message) {
    $("#message-input-code-voucher").text(message).removeClass("hidden");
}
function hideMessage() {
    $("#message-input-code-voucher").text("").addClass("hidden");
}
var getRp = function (nominal) {
    return "Rp " + getFormatNumber(Number(nominal)) + ",-";
}
var getFormatNumber = function (nominal) {
    return nominal.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function voucher_popup(message) {
    showMessage(message);
}
