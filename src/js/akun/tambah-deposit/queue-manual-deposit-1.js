$(document).ready(function() {
    $('#modal_notification').modal('show');
});

var SubmintOnCLickListener=function(){
	var $myForm=jQuery('#form_order');
	
	if ($myForm[0].checkValidity()) {
		jQuery('#modal_pin').modal('show');
	}else{
		 jQuery('#primary-submit').click();
	}	
	
}

$(document).ready(function() {
var msg="";
var elements = jQuery('input');

for (var i = 0; i < elements.length; i++) {
   elements[i].oninvalid =function(e) {
        if (!e.target.validity.valid) {
        switch(e.target.id){
            case 'dari_rek_no' : 
            e.target.setCustomValidity("Nomor Rekening Tidak Boleh Kosong");break;
            case 'dari_rek_name' : 
            e.target.setCustomValidity("Nama Pemilik Rekening Tidak Boleh Kosong");break;
            case 'jumlah' : 
            e.target.setCustomValidity("Jumalah Uang Transfer Tidak Boleh Kosong");break;
            case 'username' : 
            e.target.setCustomValidity("Username cannot be blank");break;
        default : e.target.setCustomValidity("");break;

        }
       }
    };
   elements[i].oninput = function(e) {
        e.target.setCustomValidity(msg);
    };
} 
})	

function cancelOnClickListener(){
$("#yakin-batal").modal("hide");
$("#modal_pin").modal("show");
}