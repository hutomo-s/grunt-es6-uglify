var isRunning = false;
$(document).ready(function(){
    jQuery(window).scroll(function(e){
        if ($(this).scrollTop() == $(document).height() - $(this).height()){
            if (isRunning == false){
                onloadRekamTransaksi();
            }
        }
    });
});
