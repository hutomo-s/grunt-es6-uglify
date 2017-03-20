// getUpdateFavorite();

var height = $('container-mobile').width();
$('.prod-detail-img').css("height", height);

$(document).ready(function() {
    $('.swipebox').swipebox();
});

function redirect_subvar() {
    var selected_var = $("#vars").val();
    var selected_subvar = $("#subvars").val();
    var complete_url = current_url + "/" + selected_var + "/" + selected_subvar;
    window.location = complete_url + "?=" + queryString;
}

$(document).ready(function() {
    $('.prod-detail-img').slick({
        dots: true,
        infinite: false,
        arrows: false
    });
});

$('#back_button').click(function() {
    history.back();
});

$("#beli").click(function() {
    // disable click
    $("#ajaxSpinnerContainer").show();
    $.get(urlAddtoCart,
        function(data, status) {
            var jsonObj = data;
            OnMaintenanceServerListener(jsonObj);
            if (data.guest_mode) {
                cart_green_popup(data.message_cart, data.message_cart_header, data.guest_mode);
            } else {
                if (data.redirect) {
                    var url = detailUrl;
                    window.location = data.redirect;
                } else if (data.message) {
                    if (data.toastr)
                        toaster_info(data.message);
                    else
                        cart_popup(data.message);
                } else {
                    cart_popup("Mohon maaf, sedang terjadi kesalahan sistem");
                }
            }
        }).done(function() {
          event_code = 'AddToCart';
          if (facebookPixelStatus == 1) {
            fbPixelDynamicAds('track', event_code, value, currency, content_ids, 'product')
          }
        $("#ajaxSpinnerContainer").hide();
    }).fail(function(xhr, err) {
        $("#ajaxSpinnerContainer").hide();
        cart_popup(messageError);
    });
});

$("#favoritebutton").click(function () {
    if(guest_mode) {
        cart_green_popup(fm_fav_message, fm_id_header, guest_mode);
        return;
    }
    var data_action = $(this).attr("data-action");
    if (data_action == "add") {
        ga_tracker('favorite', item_id, 'unfavorite');
        confirm_remove();
    } else if (data_action === "remove") {
        ga_tracker('favorite', item_id, 'favorite');
        addtofavorite();
    }
});

function switchtoaddbtn() {
    $('#favoritebutton').attr('data-action', 'add');
    $('#favoritebutton div').removeClass("favorite-button");
    $('#favoritebutton div').addClass("favorite-button-disabled");
}
function switchtoremovebtn() {
    $('#favoritebutton').attr('data-action', 'remove');
    $('#favoritebutton div').removeClass("favorite-button-disabled");
    $('#favoritebutton div').addClass("favorite-button");
}
function confirm_remove() {
    cart_popup_green_2("Apakah anda yakin ingin menghapus item dari daftar Favorit Anda ?", "Favorit Anda", false, "YA", "#", "removefromfavorite()");
}

function addtofavorite() {
    $("#ajaxSpinnerContainer").show();
    var postdata = {};
    postdata.item_reference_id = refId;
    postdata.vendor_id = vendorId;
    $.ajax({
      type: 'POST',
      url: urlAddToFavorites,
      data: postdata,
      dataType: "json",
      async:false,
      success: function(data, status){
            if (data.status === 200){
                switchtoaddbtn();
            }
            if (data.redirect) {
                window.location = data.redirect;
            }
            else if (data.message) {
                toaster_info(data.message);
            }
            else {
                cart_green_popup("Mohon maaf, sedang terjadi kesalahan sistem");
            }
            $('#online_cart_modal_green').modal('hide');
            $("#ajaxSpinnerContainer").hide();
      },
      error: function(xhr, err){
        $("#ajaxSpinnerContainer").hide();
        cart_popup(messageError);
      }
    });
}

function removefromfavorite() {
    $("#ajaxSpinnerContainer").show();
    var postdata = {};
    postdata.item_reference_id = refId;
    postdata.vendor_id = vendorId;

    $.ajax({
      type: 'POST',
      url: urlRemoveFromFavorites,
      data: postdata,
      dataType: "json",
      async:false,
      success: function(data, status){
        var jsonObj = data;
        OnMaintenanceServerListener(jsonObj);
        if (data.redirect) {
            window.location = data.redirect;
        }
        else if (data.message) {
            $('#online_cart_modal_green').modal('hide');
            showPopupOneButton(data.message_header, data.message);
        }
        else {
            $('#online_cart_modal_green').modal('hide');
            cart_green_popup("Mohon maaf, sedang terjadi kesalahan sistem");
        }
        if (data.status === 200)
            switchtoremovebtn();
        if (data.status === 2005)
            window.location = "?="+queryString;
      },
      error: function(xhr, err){
        $("#ajaxSpinnerContainer").hide();
        cart_popup(messageError);
      }
    });
}

function getUpdateFavorite(){
    if(!guest_mode) {
        $.ajax({
                type    : 'post',
                url     : urlGetFavorite,
                data    : item_detail,
                dataType: 'json',
                success: function(retval)
                {
                    if (retval.status)
                    {
                        $('.favorite_area').attr('data-action', 'add');
                        $('.favorite_area').children().addClass('favorite-button-disabled');
                    }else{
                        $('.favorite_area').attr('data-action', 'remove');
                        $('.favorite_area').children().addClass('favorite-button');
                    }
                }
        });
    }else{
        $('.favorite_area').attr('data-action', 'remove');
        $('.favorite_area').children().addClass('favorite-button');
    }
}


$(document).ready(function(){
    setColor();
    $('#vars').change(function(){
        setColor();
    });
});

// function to get hex format from rgb
function rgb2hex(orig) {
    if(typeof orig != 'undefined'){
        var rgb = orig.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
        return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
    }
}

// function to check valid hex
function isValidColor(str) {
    if(typeof str != 'undefined'){
        return str.match(/^#[a-f0-9]{6}$/i) !== null;
    }
}

// function to change color
function setColor()
{
    var bgColor =  $('#vars').find('option:selected').css('background-color');
    var textColor = $('#vars').find('option:selected').css('color');
    var textColorHex = rgb2hex(textColor);

    // Check if bgColor dan textColor has valid hex
    if ((textColorHex !== null) && (isValidColor(textColorHex))) {
        $('#vars').css('background-color', bgColor);
        $('#vars').css('color', textColor);
    }
}
