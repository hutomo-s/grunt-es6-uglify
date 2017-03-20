/**
* @override
* untuk success message
* @param  message 
* @return modal
*/  
  function getSuccessMessage(message,title){
    if(title !=null ){
        $("#modal_success .modal-title").html(title);
    }else{
        $("#modal_success .modal-title").html('Berhasil');
    }
    $("#modal_success .messageBody").html(message);
    $("#modal_success").modal("show");
}