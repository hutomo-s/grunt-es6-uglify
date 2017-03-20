    $('#online_cart').click(function() {
        $("#ajaxSpinnerContainer").show();
        $.get(
            online_cart_url,
            function(data, status) {
                if (data.redirect) {
                    window.location = data.redirect;
                } else if (data.message_cart) {
                    if (data.guest_mode)
                        cart_green_popup(data.message_cart, data.message_cart_header, data.guest_mode, data.desturl);
                    else
                        cart_green_popup(data.message_cart, data.message_cart_header);
                } else {
                    cart_green_popup("Mohon maaf, sedang terjadi kesalahan sistem");
                }
            }).done(function() {
            $("#ajaxSpinnerContainer").hide();
        });
    });

    $('#online_favorites').click(function() {
        $.get(
            online_favorites_url,
            function(data, status) {
                if (data.redirect) {
                    window.location = data.redirect;
                } else if (data.message_cart) {
                    if (data.guest_mode)
                        cart_green_popup(data.message_cart, data.message_cart_header, data.guest_mode, data.desturl);
                    else
                        cart_green_popup(data.message_cart, data.message_cart_header);
                } else {
                    cart_green_popup("Mohon maaf, sedang terjadi kesalahan sistem");
                }
            }).done(function() {
            $("#ajaxSpinnerContainer").hide();
        }).fails(function() {
            $("#ajaxSpinnerContainer").hide();
        });
    });

    function cart_popup(message, header, one_button, action, action_url, action_onclick, dismiss_wording) {
        if (message)
            $('#message_cart').html(message);
        else
            return FALSE;
        $('#message_cart_header').html("Informasi");
        if (header)
            $('#message_cart_header').html(header);

        // be careful

        // default condition
        $('.reset').show();
        $('.reset').removeClass("col-xs-6");
        $('.reset').addClass("col-xs-12");
        $('#message_ca_action').removeAttr("onclick");
        if (action && action_url) {
            $('.reset').removeClass("col-xs-12");
            $('.reset').addClass("col-xs-6");

            $('.terapkan').removeClass("col-xs-12");
            $('.terapkan').addClass("col-xs-6");

            $('#message_ca_action').show();
            $('#message_ca_action_1').html(action);
            $('#message_ca_action').attr('href', action_url);

            if (action_onclick)
                $('#message_ca_action').attr('onclick', action_onclick);
        } else {
            $('#message_ca_action').hide();
        }

        if (one_button) {
            $('.reset').hide();
            $('.terapkan').removeClass("col-xs-6");
            $('.terapkan').addClass("col-xs-12");
            $('.terapkan').attr("data-dismiss", "modal");
            $('#message_ca_action').show();
            $('#message_ca_action_1').html(one_button);

            if (action_onclick)
                $('#message_ca_action').attr('onclick', action_onclick);
        }
        if (dismiss_wording)
            $('#dismiss_wording').html(dismiss_wording);
        $('#online_cart_modal').modal('show');

    }

    function cart_green_popup(message, header, guestmode, desturl) {
        if (message)
            $('#message_green_cart').html(message);
        else
            return FALSE;

        if (header)
            $('#message_cart_header_title').html(header);
        else
            $('#message_cart_header_title').html("Informasi");

        if (header == 'HIDE')
            $('#message_cart_header_title').hide();

        if (customer_mode) {
            $("#ok_button").removeClass('hidden');
            $('#customer_image').removeClass('hidden');
            $('#guest_image').addClass('hidden');
            $('#guest_menus').addClass('hidden');
        } else if (guestmode) {
            $("#ok_button").addClass('hidden');
            $('#customer_image').addClass('hidden');
            $('#guest_image').removeClass('hidden');
            $('#guest_menus').removeClass('hidden');

            if (desturl) {
                var current_login_url = v_currentLoginUrl;
                var override_login_url = current_login_url + "?desturl=" + desturl;
                $("#auth_login").attr("href", override_login_url);
            }
        } else {
            $('#guest_image').addClass('hidden');
            $('#guest_menus').addClass('hidden');
            $('#customer_image').addClass('hidden');
        }


        $('#online_cart_green_modal').modal('show');
    }

    function cart_popup_green_2(message, header, one_button, action, action_url, action_onclick) {
        if (message)
            $('#message_cart_2').html(message);
        else
            return FALSE;
        $('#message_cart_header_title_green').html("Informasi");
        if (header)
            $('#message_cart_header_title_green').html(header);

        $('.reset').show();
        $('.reset').removeClass("col-xs-6");
        $('.reset').addClass("col-xs-12");
        $('#message_ca_action_2').removeAttr("onclick");
        if (action && action_url) {
            $('.reset').removeClass("col-xs-12");
            $('.reset').addClass("col-xs-6");

            $('.terapkan').removeClass("col-xs-12");
            $('.terapkan').addClass("col-xs-6");

            $('#message_ca_action_2').show();
            $('#message_ca_action_in2').html(action);
            $('#message_ca_action_2').attr('href', action_url);

            if (action_onclick) {
                $('#message_ca_action_2').attr('onclick', action_onclick);
            }
        } else {
            $('#message_ca_action_2').hide();
        }

        if (one_button) {
            $('.reset').hide();
            $('.terapkan').removeClass("col-xs-6");
            $('.terapkan').addClass("col-xs-12");
            $('.terapkan').attr("data-dismiss", "modal");
            $('#message_ca_action_2').show();
            $('#message_ca_action_in2').html(one_button);

            if (action_onclick)
                $('#message_ca_action_2').attr('onclick', action_onclick);
        }
        $('#online_cart_modal_green').modal('show');
    }