// load rekam transaksi
var onloadRekamTransaksi=function(){
    this.isRunning=true;
    jQuery("#loading_rekam_transaksi").removeClass("hidden").show();
    if(page != 0 && page <= end_page){
        jQuery.ajax({
            url:base_url+'/agent/transaksi-aktif/ajax',
            method:"post",
            dataType:"json",
            data:{
                "page":page,
                "date_from":date_from,
                "date_to":date_to,
                "_token":token,
                "rpath":r_path
            }
        }).done(function(data_parser){
            var is_action=false;
            if(data_parser.code=="1000"){
                if(data_parser.message.html != ""){
                    jQuery("#loader_rekam_transaksi").append(data_parser.message.html);
                    is_action=true;
                }
            }
            /*                   if(is_action==true){
             if(page > data_parser.message.page){
             page=data_parser.message.page;
             }else{
             page=0;
             }

             } */
            if(is_action==true){
                if(page < end_page){
                    page=Number(data_parser.message.page+1);
                }else{
                    page=0;
                }

            }
            jQuery("#loading_rekam_transaksi").hide();
            isRunning=false;
        }).fail(function(){
            jQuery("#loading_rekam_transaksi").hide();
            isRunning=false;
        });
    }else{
        jQuery("#loading_rekam_transaksi").hide();
    }

}
