function closeOrderView(){
    window.location = backLink;
}
(function() {
    var bar = $('.bar');
    var percent = $('.percent');
    var status = $('#status');
    $('#form-manual').ajaxForm({
        beforeSubmit : function(arr, $form, options){
            var check = checkValidateData();
            var user_nominal = $('input[name="user_nominal"]').val();
            var checkTermCondition = checkTermCodition(user_nominal);
            if (check) {
                if (checkTermCondition) {
                   return true; //it will continue your submission.
                }
                else
                {
                    $('.user_nominal').html('Jumlah minimal adalah'+ toRp(nominalMin)).removeClass('hidden');
                    return false; //ti will stop your submission.
                }
            } else {
                return false;
            }
        },
        beforeSend: function() {
            status.empty();
            var percentVal = '0%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        uploadProgress: function(event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        success: function() {
            var percentVal = '100%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
    	complete: function(xhr) {
            var data =  JSON.parse(xhr.responseText);
            if (data.status) {
                $('#trq').val(data.data);
                $('#listBank').val(listBank);
                activateModal("Informasi", "Konfirmasi transfer berhasil");
            } else {
                activateModal("Ups",errorMessage);
            }
    	}
    });
    $('#fileInput').change(function(){
        var fileName  = $("#fileInput").val();
        $('.setTextFileName').html(fileName);
    });
})();

    function checkValidateData() {
        var  allow  = [];
        var statusCode = [];
        $('#form-manual *').filter(':input').each(function(){
            var name  = $(this).attr('name');
            if (typeof name != 'undefined')
            {
                var value =  $(this).val();
                if (value == "" || value === null){
                    if ( Number($.inArray( name, allow )) == Number(-1) ) {
                        $('span.'+name).removeClass('hidden');
                        statusCode.push(false);
                        return false;
                    }
                } else {
                    $('span.'+name).addClass('hidden');
                }
            }
        });
        if(statusCode.length > 0){
            return false;
        } else {
            return true;
        }
    }
    function convertToRupiah (objek) {
         separator = ".";
         a = objek.value;
         b = a.replace(/[^\d]/g,"");
         c = "";
         panjang = b.length;
         j = 0; for (i = panjang; i > 0; i--) {
             j = j + 1;
             if (((j % 3) == 1) && (j != 1))
             {
                c = b.substr(i-1,1) + separator + c;
             } else {
                c = b.substr(i-1,1) + c;
            }
         }
         if (c != "") {
             objek.value = "Rp" +c;
         } else {
             objek.value = c;
         }
    }
    function checkTermCodition(user_nominal){
        var price = user_nominal.replace(/\./g,'');
            price = price.replace(/\Rp/g,'');
            if ( Number(price) >= nominalMin ) {
                return true;
            }
        return false;
    }
    function toRp(angka){
        var rev     = parseInt(angka, 10).toString().split('').reverse().join('');
        var rev2    = '';
        for(var i = 0; i < rev.length; i++){
            rev2  += rev[i];
            if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
                rev2 += '.';
            }
        }
        return 'Rp. ' + rev2.split('').reverse().join('');
    }

    function activateModal(title, content, eventButton) {
        // initialize modal element
        $('.title-dialog').html(title);
        $('.content-dialog').html(content);
        $('.button-dialog').html('OK');
        var modalEl = document.createElement('div');
        var options = {
            'keyboard': true, // teardown when <esc> key is pressed (default: true)
            'static': false, // maintain overlay when clicked (default: false)
            'onclose': function enableScroll() {
                          // enable scrolling and bounce effect on Safari iOS
                          document.ontouchmove = function(e) { return true; }
                      } // execute function when overlay is closed
        };
        modalEl.style.width           = '80%';
        modalEl.style.maxWidth        = '300px';
        modalEl.style.height          = '130px';
        modalEl.style.margin          = 'auto';
        modalEl.style.position        = 'absolute';
        modalEl.style.top             = '0';
        modalEl.style.left            = '0';
        modalEl.style.bottom          = '0';
        modalEl.style.right           = '0';
        modalEl.style.backgroundColor = '#fff';
        modalEl.style.webkitOverflowScrolling = 'touch';
        modalEl.style.verticalAlign   = 'middle';

        modalEl.innerHTML = $('#modal_wrapper').html();
        // modalEl.getElementsByClassName("content-dialog").innerHTML = "xxxxx";

        // show modal
        mui.overlay('on', options, modalEl);

        // disable scrolling and bounce effect on Safari iOS
        document.ontouchmove = function(e){ e.preventDefault(); e.stopPropagation(); }
    }
