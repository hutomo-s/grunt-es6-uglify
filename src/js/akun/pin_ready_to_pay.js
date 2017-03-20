$(document).ready(function() {
$('input[name=input_pin]').keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    $phone = $(this);
    // Allow numeric (and tab, backspace, delete) keys only
    return (key == 8 || 
            key == 9 ||
            key == 46 ||
            key == 13 ||
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
var doOrder = function () {
    var pin = jQuery("input[name='input_pin']").val();
        jQuery("input[name='input_pin']").val("");
    if (pin.toString().trim() != "") 
    {
        jQuery("input[name='pin']").val(pin);
        jQuery("#modal_pin").modal("hide");
		jQuery("#ajaxSpinnerContainer").show();
         $.ajax({
            type: 'post',
            url: URLConfirm,
            data: $('#form_order').serialize(),
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
                if (retval.status){
                    ga_tracker('transaction', 'Konfirmasi Sukses');
                    window.location  = retval.url;
                }else{
                    ga_tracker('transaction', 'Konfirmasi Gagal');
                    $("#ajaxSpinnerContainer").hide(); 
                    showErrorMessagePin(retval.message.message,'Pembayaran Belum Berhasil');
                }
            }
        });
    } 
    else 
    {
    }
}

function showErrorMessagePin(message,title){
    if(title !=null ){
        $(".ModalErrorspin .messageTitle").html(title);
    }else{
        $(".ModalErrorspin .messageTitle").html('Ups!');
    }
        $(".ModalErrorspin .messageBody ").html(message);
        $(".ModalErrorspin").modal("show");
}  

// start event enter pin //
function eventEnter(e) {
    if (e.keyCode == 13) {
        doOrder();
        ga_tracker('transaction', 'Konfirmasi');
        return false;
    }
}
// end event enter pin //