$(document).ready(function (){
$("#validateForgot").validationEngine();
});
function geThan(field, rules, i, options){
    var field = field.val();
    field=field.trim();
    if (isInt(field)){
        if (field.length >= 9 && field.length <= 13){
            var checkPrefix = field.substr(0, 1);
            if (checkPrefix == "+"){
                var checkPrefixPlus = field.substr(0, 3);
                if (checkPrefixPlus != '+62'){
                    return "Nomor Handphone Yang anda masukan salah !";
                }
            }else{
                var noHpdata = field.substr(0, 1);
                if (Number(noHpdata) !== Number(0)){
                    return "Nomor Handphone Yang anda masukan salah !";
                }
            }
        }else{
            return "Nomor Handphone Yang anda masukan salah !";
        }
    }else{
        if (field != ""){
            var checkEmail  = validateEmail(field.trim());
            if (checkEmail == false){
                return "Email Yang  Anda Masukan Salah";
            }
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
    if (Number(field.length) <= Number(6)){
        return "Masukkan Minimal 6 Digit Kode Password !";
    }
}
