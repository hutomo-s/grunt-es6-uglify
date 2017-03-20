$('#pwd').keydown(function(event){
    if(event.keyCode == 13) {
      submitPassword();
      return false;
    }
});
jQuery('input[name=password]').on('keydown',function(e){
jQuery(this).validationEngine('hide');
});
function submitPassword(){
     if ($(".form-autpass").validationEngine('validate')){
        var emailfield = $('.form-autpass').find('#email-field').val();
        jQuery("#ajaxSpinnerContainer").show();
        jQuery('#validatelogin').submit();
        if(typeof emailfield !== 'undefined') {
            ga_tracker('login', emailfield);
        }
     }
}
function geThan(field, rules, i, options){
    var field = field.val();
        field = field.trim();
    if (isInt(field)){
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
        if (field != ""){
            var checkEmail  = validateEmail(field.trim());
            if (checkEmail == false){
                return "Email Yang  Anda Masukan Salah";
            }
        }else{
                return "";
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
function getPwd(field, rules, i, options){
   var field = field.val();
    if (field != ""){
        if (Number(field.length) < Number(3)){
            return "Password yang Anda masukan salah!";
        }
    }else{
        return "";
    }
}
