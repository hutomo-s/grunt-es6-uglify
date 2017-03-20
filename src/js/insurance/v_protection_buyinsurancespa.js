    function showDiv(divId)
    {
        $("#" + divId).removeClass("hidden");
    }

    function hideDiv(divId)
    {
        $("#" + divId).addClass("hidden");
    }

    function showstep1(){
        hideDiv("step2");
        hideDiv("step3");
        showDiv("step1");
        $("#active_div_id").val("step1");
        $('#protection-header').text("Formulir Pendaftaran");
    }

    function showstep2(){
        hideDiv("step1");
        hideDiv("step3");
        showDiv("step2");
        $("#active_div_id").val("step2");
        $('#protection-header').text("Pilih Paket Asuransi");
    }

    function showstep3(paketName){
        hideDiv("step1");
        hideDiv("step2");
        showDiv("step3");
        $("#active_div_id").val("step3");
        $('#protection-header').text("Konfirmasi Pendaftaran");
        $('.confirm-package-name').text(paketName);
    }

    (function ($) {
        $.fn.serializeFormJSON = function () {

            var o = {};
            var a = this.serializeArray();
            $.each(a, function () {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };
    })(jQuery);


    function submitonstep1(){


        // if validation returns false, will break the function
        if(!validateFormStep1())
            return;

        if ($('#agreement').is(":checked"))
        {
            showstep2();
        }
        else
        {
            alert("Persetujuan wajib diisi");
        }
    }


    $.fn.center = function () {
            this.css("position","relative");
            this.css("top", ( $(window).height() - this.height() ) / 2  + "px");
            return this;
    }

    $(window).resize(function(){
       $(".modal-overlay-insurance").center();
    });

    function activateModal(content, footer) {
            // initialize modal element
            var modalEl = document.createElement('div');
            modalEl.setAttribute("class", "modal-overlay modal-overlay-insurance");

            modalEl.innerHTML = content + footer;

            // show modal
            mui.overlay('on', modalEl);
            $(".modal-overlay-insurance").center();   // on page load div will be centered

            // close modal
            $("#dismissModal").click(function(){
                mui.overlay('off');
            });

            $("#btn-insurance-ok").click(function(){
                window.location = back_url;
            });
    }

    function submitonstep2()
    {
        if($("input[name='item_id']").is(':checked')){
            var formdata = $("#formstep1").serializeFormJSON();
            var paketName = $('input[name=item_id]:checked').attr('listpaketname');
            putDataForm(formdata);
            showstep3(paketName);

        }else{
            var message_error = "Anda belum memilih paket!"
            toastr.info(message_error);
        }
    }

    $('#protection-dob').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd/mm/yy",
        yearRange: "-59:-1",
        maxDate: '-1Y',
        dayNamesMin: ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    });

    function putDataForm(dataInsurance){
        var genderVal = "";
        if (dataInsurance.gender == "F"){
            genderVal = "Perempuan";
        }else{
             genderVal = "Laki-laki";
        }
        $('#confirm-name').text(dataInsurance.name);
        $('#confirm-gender').text(genderVal);
        $('#confirm-email').text(dataInsurance.email);
        $('#confirm-phone').text(dataInsurance.phone);
        $('#confirm-dob').text(dataInsurance.date_of_birth);
        $('#confirm-idNumber').text(dataInsurance.id_number);
        $('#confirm-idNumber').text(dataInsurance.id_number);
        var packagePrice = $("input[name='item_id']:checked").attr('data-price');

        $('#total-package').text(numRp(parseInt(packagePrice)));
    }

    function numRp(nStr)
   {
           nStr += '';
           x = nStr.split('.');
           x1 = x[0];
           x2 = x.length > 1 ? '.' + x[1] : '';
           var rgx = /(\d+)(\d{3})/;
           while (rgx.test(x1)) {
                   x1 = x1.replace(rgx, '$1' + '.' + '$2');
           }
           return 'Rp ' + x1 + x2;
   }

    function submitonstep3(failConnection)
    {
        var fail_c  = '<p>'+failConnection+'</p>';
        var fail_f  = '<div class="mui-row btn-insurance-container">';
            fail_f += '<div class="mui-col-md-12 mui-col-xs-12 mui-col-lg-12 mui--text-center">';
            fail_f += '<button class="mui-btn mui-btn--primary btn-green" id="dismissModal">OK</button>';
            fail_f += '</div>';
            fail_f += '</div>';

        $("#ajaxSpinnerContainer").show();

        $(".protection-button .btn-green").prop('disabled', true);
        var formdata = $("#formstep1, #formstep2").serialize();
         var dataUnit = $("input[name='item_id']:checked").attr('data-unit');
        $.ajax({
            url: submit_url,
            data: formdata+"&unit="+dataUnit,
            method: "POST"
        })
        .done(function(data) {
           if(data.status === 500 && data.message){
                activateModal(fail_c, fail_f);
           } else if(data.status === 200 && data.redirect) {
                window.location = data.redirect;
           } else if(data.status === 300 && data.message) {
                activateModal(data.message, fail_f);
                showstep1();
           } else {
                activateModal(fail_c, fail_f);
           }

        })
        .fail(function() {
            activateModal(fail_c, fail_f);
        })
        .always(function() {
            //alert( "complete" );
            $(".protection-button button").prop('disabled', false);
        });
    }

    function checkValidate(){
      validateFormStep1();
    }

    var MESSAGE_ERROR = {
        'KTP'   : "Nomor Ktp Yang Anda harus lebih besar",
        'KTP_LENGTH'   : "Minimal 16 digit",
        'EMAIL' : "Email yang  Anda masukkan tidak valid",
        'HP'    : "Nomor HP yang Anda masukkan salah"
    }
    function validateFormStep1()
    {
        var form_name = "formstep1";
        var required_fields = ["name", "gender", "email", "phone", "id_number", "date_of_birth"];
        var validateStatus = [];

        var validation_messages = {
            "name.required": "Nama wajib di isi",
            "gender.required": "Jenis kelamin wajib di isi",
            "email.required" : "Email wajib di isi",
            "phone.required" : "Nomor telepon wajib di isi",
            "id_number.required" : "Nomor KTP wajib di isi",
            "date_of_birth.required" : "Tanggal lahir wajib di isi"
        };

        var field = false;
        for (i = 0; i < required_fields.length; i++)
        {
            var identifier = "form#" + form_name +" input[name="+  required_fields[i] +"]";
            if( $(identifier).val() == "" )
            {
                var display_error_msg = validation_messages[required_fields[i] + ".required"];
                $(identifier).parent().find('#error-message').html(display_error_msg);
                validateStatus.push(false);
            }
            else {
                $(identifier).parent().find('#error-message').html('');
            }
        }

        // validate email
        if($("input[name='email']").val() && !validateEmail($("input[name='email']").val()))
        {
           $("input[name='email']").parent().find('#error-message').html(MESSAGE_ERROR.EMAIL);
           validateStatus.push(false);
        }
        // validate Phone
        var phone = $("input[name='phone']").val();
        if( phone != "")
        {
            var validatePhone  = validatePhoneNumber($("input[name='phone']").val());
            if (validatePhone != true){
                $("input[name='phone']").parent().find('#error-message').html(validatePhone);
                validateStatus.push(false);
            }
        }
        // validate no ktp
        var ktp = $("input[name='id_number']").val();
        if(ktp != "")
        {
            if (Number($("input[name='id_number']").val().length) < 16){
                $("input[name='id_number']").parent().find('#error-message').html(MESSAGE_ERROR.KTP_LENGTH);
                validateStatus.push(false);
            }
        }
        // alert for radio button [GENDER]
        var identifier = "form#" + form_name +" input[name="+ "gender" +"]";
        if(!$(identifier).is(":checked"))
        {
            var display_error_msg = validation_messages["gender" + ".required"];
            $(identifier).parent().find('#error-message').html(display_error_msg);
            validateStatus.push(false);
        }
        else {
            $(identifier).parent().find('#error-message').html('');
        }

        // alert for agreement
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-bottom-center",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "4000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        if(validateStatus.length == 0) {
            var identifier = "form#" + form_name +" input[name="+ "agreement" +"]";
            if(!$(identifier).is(":checked"))
            {
                var display_error_msg = validation_messages["gender" + ".required"];
                toastr.info("Anda harus setuju dengan syarat dan ketentuan untuk melanjutkan.");
                validateStatus.push(false);
            }
        }

        if (validateStatus.length != 0) {
            $(validateStatus).each(function(index, value){
                if(value == false) {
                    return false;
                }
                else {
                    return true;
                }
            });

        }else{
            return true;
        }

    }

    function  validatePhoneNumber(phone){
        if (phone.length >= 9 && phone.length <= 13){
                var checkPrefix = phone.substr(0, 1);
                if (checkPrefix == "+"){
                    var checkPrefixPlus = phone.substr(0, 3);
                    if (checkPrefixPlus != '+62'){
                        return MESSAGE_ERROR.HP;
                    }
                }else{
                    var noHpdata = phone.substr(0, 1);
                    if (Number(noHpdata) !== Number(0)){
                        return MESSAGE_ERROR.HP;
                    }
                }
        }else{
            return MESSAGE_ERROR.HP;
        }
        return true;
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function back_action()
    {
        var current_active_div = $("#active_div_id").val();

        if(current_active_div == "step1") {
            // assign content
            var content = '<p>Anda akan kembali ke halaman sebelumnya. Data dan informasi yang sudah diisi tidak akan disimpan. Anda yakin ingin kembali?</p>';
            var footer = '<div class="mui-row btn-insurance-container"><div class="mui-col-md-6 mui-col-xs-6 mui-col-lg-6" id="btn-insurance-ok"><button class="mui-btn mui-btn primary-red">YAKIN</button></div>'+
            '<div class="mui-col-md-6 mui-col-xs-6 mui-col-lg-6"><button class="mui-btn mui-btn--primary btn-green" id="dismissModal">TIDAK</button></div></div>';

            activateModal(content, footer);
        }
            // window.location = back_url;
        if(current_active_div == "step2")
            showstep1();
        if(current_active_div == "step3")
            showstep2();
    }

    // default condition
    showstep1();
