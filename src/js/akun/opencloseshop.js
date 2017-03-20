// mengecek open shop dan device android
if(is_open_shop == 'y' && device_android){
    // cek berapa menit, setiap 15 menit sekali di jakanan
    if(isMinuteOpenCloseShop)
    {
        var openCloseMapOnListener=function(){
            // handle bila navigator.geolocation tidak support
            try{
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var pLat= position.coords.latitude;
                        var pLong=position.coords.longitude;
                        start_lat=position.coords.latitude;
                        start_long=position.coords.longitude;
                        jQuery.ajax({
                            type:"post",
                            url: base_url+'/agent/open-close-shop/setPosisi',
                            data:{
                                "lat"   :position.coords.latitude,
                                "long"  :position.coords.longitude,
                                '_token':token
                            }
                            ,success: function(result) {
                            },error: function(e) {
                            }
                        });
                    }, function() {
                        handleNoGeolocation(true);
                    });
                } else {
                    handleNoGeolocation(false);
                }
            }catch(e){
            }
        }
        var handleNoGeolocation=function(errorFlag){
            if (errorFlag) {
                var content = 'Lokasi Anda Tidak Terdeteksi, Mohon Untuk Mengaktifkan GPS';
            } else {
                var content = 'Lokasi Anda Tidak Terdeteksi, Perbarui Browser Anda';
            }
            if(typeof is_error_show_open_close_shop != 'undefined'){
                $('#modal_open_close_shop #message').text(content);
                $('#modal_open_close_shop').modal('show');  
            }
        }
        openCloseMapOnListener();
        setInterval(openCloseMapOnListener, minutes);
    }
}