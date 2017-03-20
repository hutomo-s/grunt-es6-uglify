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
            e.target.setCustomValidity("Nomor rekening tidak boleh kosong");break;
            case 'dari_rek_name' : 
            e.target.setCustomValidity("Nama pemilik rekening tidak boleh kosong");break;
            case 'jumlah' : 
            e.target.setCustomValidity("Jumalah uang transfer tidak boleh kosong");break;
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
var elements1 = jQuery('select');
for (var i = 0; i < elements1.length; i++) {
   elements1[i].oninvalid =function(e) {
        if (!e.target.validity.valid) {
        switch(e.target.id){
        case 'dari_rek_bank' : 
            e.target.setCustomValidity("Pilih bank pengirim");break;
        default : e.target.setCustomValidity("");break;
        }
       }
    };
   elements1[i].oninput = function(e) {
        e.target.setCustomValidity(msg);
    };
} 
})	