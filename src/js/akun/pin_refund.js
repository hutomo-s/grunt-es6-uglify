$(document).ready(function() {

     $('input[name=input_pin]').keydown(function (e) {
        var key = e.charCode || e.keyCode || 0;
        $phone = $(this);
        // Allow numeric (and tab, backspace, delete) keys only
        return (key == 8 || 
                key == 9 ||
                key == 46 ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105)); 
    });
    $('#modal_pin').on('hidden.bs.modal', function () {
        $('#pwd').val('');
    });

    $('#pwd').keydown(function(event){
        if(event.keyCode == 13) {
          doOrder();
          return false;
        }
    });

});
var doActionPinRefund = function () {
    var pin = jQuery("input[name='input_pin']").val();
    if (pin.toString().trim() != "") {
        jQuery("input[name='pin']").val(pin);
        jQuery("#modalPinRefund").modal("hide");
		jQuery("#ajaxSpinnerContainer").show();
         $.ajax({
            type: 'post',
            url: URLDoRefund,
            data: $('#formRefund').serialize(),
            dataType: 'json',
            beforeSend: function(data) {
                $("#ajaxSpinnerContainer").show();
            },
            error: function (request, status, error) {
                $("#ajaxSpinnerContainer").hide();
                $('#errorCOnnection').modal('show');
            },
            success: function(retval) {
                var jsonObj = retval;
                OnMaintenanceServerListener(jsonObj);
                if (retval.code ==1000){
                    jQuery("#box_action_refund").hide();
                    $(".refund-redirect").click(function(){
                        window.location.href=base_url+"/agent/rekam-transaksi/"+retval.message.id+"/show";
                    });
                    getSuccessMessage('Transaksi Anda telah berhasil di Refund','Refund Berhasil','redirectRefresh()');
                    jQuery('#box_action_refund').addClass('hidden');
                }else{
                    showErrorMessage(retval.message,'Gagal');
                }
            }
        });
    } else {
        showErrorMessage('Pin yang Anda masukkan Salah','Ups!');
    }
}