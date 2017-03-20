// Prevent scrolling background when modal poped up
var scrollPos = 0;
$('.modal')
    .on('show.bs.modal', function () {
        scrollPos = $('body').scrollTop();
        $('html').css({
            overflow: 'hidden',
            top: -scrollPos
        });
    })
    .on('hide.bs.modal', function () {
        var isScrollTop=false;
        $('html').css({
            overflow: '',
            top: ''
        });
    });

function disableScroll() {
    $('#ajaxSpinnerContainer').show();
    if (typeof noAjaxStart != 'undefined'){
        scrollPos = $(window).scrollTop();
        if ($('#ajaxSpinnerContainer').css('display') == 'block') {
            $('html').css({
                overflow: 'hidden',
                top: ''
            });
            $('body').css({
                overflow: 'hidden',
                top: ''
            });
            $('body').on('touchmove', function (e) {
                e.preventDefault();
            });
        }
    }
}

function enableScroll() {
    $('#ajaxSpinnerContainer').hide();
    if (typeof noAjaxStart != 'undefined'){
        $('html').css({
            overflow: '',
            top: ''
        });
        $('body').css({
            overflow: '',
            top: ''
        });
        isEnableScroll=true;
        $('body').off('touchmove');
    }
}

if (typeof noAjaxStart != 'undefined') {
    if (!Boolean(noAjaxStart)) {
        $(document).ajaxStart(function () {
            disableScroll();
        }).ajaxStop(function () {
            enableScroll();
        }).ajaxSuccess(function (xhr){
        });
    }
}
else{
    $(document).ajaxStart(function () {
        disableScroll();
    }).ajaxStop(function () {
        enableScroll();
    }).ajaxSuccess(function (result, xhr, settings){
       try{
           var jsonObj = $.parseJSON( xhr.responseText);
           OnMaintenanceServerListener(jsonObj);
       }catch(e){
       }
    });
}

function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('fa-caret-down fa-caret-up');
}
$('#accordion').on('hidden.bs.collapse', toggleChevron);
$('#accordion').on('shown.bs.collapse', toggleChevron);

/*input pulsa masking*/
$('#phone-number', '#pulsa')
    .keydown(function (e) {
        var key = e.charCode || e.keyCode || 0;
        $phone = $(this);
        // Auto-format- do not expose the mask as the user begins to type
        if (key !== 8 && key !== 9) {
            if ($phone.val().length === 4) {
                $phone.val($phone.val() + '-');
            }
            if ($phone.val().length === 9) {
                $phone.val($phone.val() + '-');
            }
        }
        // Allow numeric (and tab, backspace, delete) keys only
        return (key == 8 ||
        key == 9 ||
        key == 46 ||
        (key >= 48 && key <= 57) ||
        (key >= 96 && key <= 105));
    })
    .bind('focus click', function () {
        $phone = $(this);
        if ($phone.val().length === 0) {
            $phone.val('');
        }
        else {
            var val = $phone.val();
            $phone.val('').val(val); // Ensure cursor remains at the end
        }
    })
    .blur(function () {
        $phone = $(this);
        if ($phone.val() === '(') {
            $phone.val('');
        }
    });
/*styled dropdown menu*/
(function ($) {
    $.fn.styleddropdown = function () {
        return this.each(function () {
            var obj = $(this);
            obj.find('.field').click(function () { //onclick event, 'list' fadein
                obj.find('.list').fadeIn(400);
                $(document).keyup(function (event) { //keypress event, fadeout on 'escape'
                    if (event.keyCode == 27) {
                        obj.find('.list').fadeOut(400);
                    }
                });
                obj.find('.list').hover(function () {
                    },
                    function () {
                        $(this).fadeOut(400);
                    });
            });
            obj.find('.list li').click(function () { //onclick event, change field value with selected 'list' item and fadeout 'list'
                var item = $(this).attr('data-item');
                var price = $(this).attr('data-harga');
                obj.find('.field')
                    .val('')
                    /*    .attr("placeholder", "Type your answer here"); */
                    .css({
                        'background': '#fff',
                        'color': '#333'
                    });
                obj.find('.list').fadeOut(400);
            });
        });
    };
})(jQuery);

/*styled dropdown menu*/
(function ($) {
    $.fn.styleddropdownpdam = function () {
        return this.each(function () {
            var obj = $(this);
            obj.find('.pdam').click(function () { //onclick event, 'list' fadein
                obj.find('.list').fadeIn(400);
                $(document).keyup(function (event) { //keypress event, fadeout on 'escape'
                    if (event.keyCode == 27) {
                        obj.find('.list').fadeOut(400);
                    }
                });
                obj.find('.list').hover(function () {
                    },
                    function () {
                        $(this).fadeOut(400);
                    });
            });
            obj.find('.list li').click(function () { //onclick event, change field value with selected 'list' item and fadeout 'list'
                obj.find('.pdam')
                    .val($(this).html())
                    .css({
                        'background': '#fff',
                        'color': '#333'
                    });
                obj.find('.list').fadeOut(400);
            });
        });
    };
})(jQuery);
/*
 END JS Author - Resly S
 */

//Place this plugin snippet into another file in your applicationb
(function ($) {
    var control = $('div[id^="show-password"]');
    control.bind('click', function () {
        var inputcontrol = $(this).parent().find('input');
        var attr_type = inputcontrol.attr('type');
        if (attr_type == 'text') {
            inputcontrol.attr('type', 'password');
            $(this).removeClass('invisible-eye');
            $(this).addClass('visible-eye');
        } else {
            inputcontrol.attr('type', 'text');
            $(this).removeClass('visible-eye');
            $(this).addClass('invisible-eye');
        }
    });

// for ready to pay
    var control_new = $('#show-pin').click(function (){
        var inputcontrolnew = $(this).parent().find('input');
        var attr_type = inputcontrolnew.attr('type');
         if (attr_type == 'tel') {
            inputcontrolnew.attr('type', 'password');
            $(this).removeClass('invisible-eye');
            $(this).addClass('visible-eye');
            $(inputcontrolnew).attr('style', "-webkit-text-security: disc; width: 100%; text-align:left; padding-left:12px; float:none; font-size:14px; font-weight:normal");
        } else {
            inputcontrolnew.attr('type', 'tel');
            $(inputcontrolnew).attr('max', "1");
            $(inputcontrolnew).attr('min', "6");
            $(this).removeClass('visible-eye');
            $(this).addClass('invisible-eye');
            $(inputcontrolnew).attr('style', "");
        }
    });
}(jQuery));

$('.pwd-tel').keypress(function(e) {
    if ($(this).val().length > 5 ){
           e.preventDefault();
           return false;
    }
});

// post-submit callback
var msgAlert = function (msg, type, seprator, nopd) {
    html = '';
    msg = (msg instanceof Array ? msg : [msg]);
    type = type || 'success';
    seprator = seprator || '<br/>';
    nopd = nopd || '';
    b = '';
    for (i = 0; i < msg.length; i++) {
        html += b + msg[i];
        b = seprator;
    }
    html = "<div class='row'><div class='col-xs-12 " + nopd + "'><ul class='list list-unstyled mtop10'><li><div class='alert alert-" + type + "' role='alert'><span class='sr-only'>Error:</span>" + html + "</div></li></ul></div></div>";
    return html;
};

$(".onlyNumbers").keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d === undefined ? "." : d;
    t = t === undefined ? "," : t;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

$(document).ready(function () {

    var numberInputs = $("input.price-format");
    var convertToCurrencyDisplayFormat = function (str) {
        var regex = /(-?[0-9]+)([0-9]{3})/;
        str += '';
        while (regex.test(str)) {
            str = str.replace(regex, '$1.$2');
        }
        str += '';
        return str;
    };
    var stripNonNumeric = function (str) {
        str += '';
        str = str.replace(/[^0-9]/g, '');
        return str;
    };
    numberInputs.each(function () {
        this.value = convertToCurrencyDisplayFormat(this.value);
    });
    numberInputs.blur(function () {
        this.value = convertToCurrencyDisplayFormat(this.value);
    });
    numberInputs.focus(function () {
        this.value = stripNonNumeric(this.value);
    });

    $('.loading-page').click(function () {
        /* GA Tracker */
        var title = $(this).attr('data-title');
        if (title !== null) {
            ga_tracker('tab-menu', title);
        }
        /* End GA Tracker */
    });
    jQuery(window).bind("unload", function () {
    });

    $(".navbar-rek-trx > div > a").click(function () {
        /* GA Tracker */
        var title = $(this).attr('data-title');
        if (title !== null) {
            ga_tracker('tab-menu', title);
        }
        /* End GA Tracker */
    });

    $(".snk-button").click(function () {
        var title = $(this).attr('data-title');
        ga_tracker('promobox', title);
    });

    $(".page-container-promobox .sticky-filter .icon-box").click(function () {
        var title = $(this).attr("data-title");
        var id = $(this).attr("data-id");
        if (title !== null) {
            ga_tracker('promobox', title, id);
        }
    });

    $('.list-event').click(function () {
        $('li.list-event').each(function (index, value) {
            $(this).removeClass('btn-green');
        });
        $(this).addClass('btn-green');
    });

    if ($(".floating-button").length) {
        var block_ = new Block_floating_button();
        var initFloatOnBlock = block_.initFloat;
    }

    $(".track-it").click(function () {
        var key = $(this).attr('data-key');
        if (key == "help-button") {
            ga_tracker('tab-menu', 'Help');
        }
    });

    /* Drop down */
    $('.page-deposit .panel-heading p a').click(function (){
        var cekIn        = $(this).attr('aria-expanded');
        if (typeof cekIn === 'undefined' || cekIn === 'false'){
            $(this).find('.material-icons').html('&#xE15C;');
        }else{
            $(this).find('.material-icons').html('&#xE147;');
        }
    });
});

/* FLOATING BUTTON */
var initFloat = null;
function Block_floating_button() {
    this.initFloat = floatOnScroll();
}

function floatOnScroll() {
    $(window).scroll(function () {
        hideButton();
        clearTimeout($.data(this, 'scrollTimer'));
        $.data(this, 'scrollTimer', setTimeout(function () {
            showButton();
        }, 3000));
    });
}

function showButton() {
    $('.floating-button').animate({
        opacity: "show"
    });
}

function hideButton() {
    $('.floating-button').animate({
        opacity: "hide"
    });
}

/* Open when someone clicks on the span element */
function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}
/* END FLOATING BUTTON */

/*
 KUDO ANALYTIC
 category    - huruf kecil semua
 action      - huruf kecil semua
 label       - Capitalize
 */
$(".search-mainmenu").keyup(function (event) {
    if (event.keyCode == 13) {
        var search_text = $(this).val();
        if (typeof search_text !== 'undefined') {
            ga_tracker('search', search_text);
        }
    }
});

$('.item').click(function () {
    var label = $(this).attr('data-title');
    if (typeof label !== 'undefined') {
        //alert(label);
        ga_tracker('shop-item', label);
    }
});

$('.sticky-buy-2').click(function () {
    ga_tracker('transaction', 'Beli Barang');
});

$('.btn-lanjut').click(function () {
    var label = $(this).attr('data-title');
    if (typeof label !== 'undefined') {
        //alert(label);
        ga_tracker('transaction', label);
    }
});

$('.list-group-item, .link-to-profile').click(function () {
    var label = $(this).attr('data-title');
    if (typeof label !== 'undefined') {
        //alert(label);
        ga_tracker('agent-menu', label);
    }
});

$('#redirectTo').click(function () {
    var dataUrl = $(this).attr('data-url');
    window.location.href = dataUrl;
});

function ga_tracker(key, label, action, metric) {
    if (typeof action == 'undefined') {
        action = "click";
    }
    if (key == 'tab-menu') {
        /*
         mainmenu            : PRODUK / PULSA / TAGIHAN
         footer              : KIOS / BERITA / BANTUAN / AKUN
         customer account    : AKTIVASI / PIN / VOUCHER
         */
        ga('send', 'event', 'menu', 'click', label);
    } else if (key == 'promobox') {
        /*
         PROMOBOX DETAIL
         */
        ga('send', 'event', 'promobox', 'click', label);
        //alert('promobox - '+label);
    } else if (key == 'shop-item') {
        /*
         home: slick produk terlaris
         detail: product
         */
        ga('send', 'event', 'shop item', 'click', label);
        _paq.push(['trackEvent', 'transaction', 'click', label]);
    } else if (key == 'search') {
        /*
         home: search bar
         */
        ga('send', 'event', 'search', 'query', label);
    } else if (key == 'transaction') {
        /*
         all transaction online
         */
        ga('send', 'event', 'transaction', 'click', label);
        _paq.push(['trackEvent', 'transaction', 'click', label]);
    } else if (key == 'login') {
        /*
         login agent
         */
        ga('send', 'event', 'login', 'click', label);
    } else if (key == 'favorite') {
        /*
         favorite
         */
        ga('send', 'event', 'favorite', action, label);
    } else if (key == 'menu') {
        /*
         custom menu
         */
        ga('send', 'event', 'menu', action, label);
    } else if (key == 'agent-menu') {
        /*
         agent menu          : AKUN AGEN / NOTIFKASI / TUTORIAL
         : REKAM DANA / REKAM TRANSAKSI
         */
        ga('send', 'event', 'menu agent', 'click', label);
    } else if (key == 'social-media') {
        /*
         social media          : FACEBOOK / WHATSAPP / TWITTER
         */
        ga('send', 'event', 'social media', 'share', label);
    }  else if (key == 'faq') {
       /*
        faq          : FAQ / FAQ-POPULAR
        */
       ga('send', 'event', category, action, label);
   }   else if (key == 'feedback') {
       /*
        feedback
        */
       ga('send', 'event', 'feedback', 'click', label);
   }
}

/* DATE RANGE PICKER REKAM DANA-KOMISI */
function newDateRangePicker(dateFrom, dateTo) {
  var dFrom = dateFrom;
  var dTo = dateTo;
  if(dFrom != undefined && dTo != undefined) {
    var newFrom = dFrom.split('-').reverse();
    var newTo = dTo.split('-').reverse();
  }
  var monthName = ['', 'JAN','FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGS', 'SEP', 'OKT', 'NOV', 'DES'];
  if (dFrom === dTo) {
    var newDate = (newFrom[0] + " " + monthName[newFrom[1].replace(/^0+/, '')]);
  } else {
    if (newFrom[2] == newTo[2]) {
      var newDate = (newFrom[0] + " " + monthName[newFrom[1].replace(/^0+/, '')] + " - " + newTo[0] + " " + monthName[newTo[1].replace(/^0+/, '')]);
    } else {
      var newDate = (newFrom[0] + " " + monthName[newFrom[1].replace(/^0+/, '')] + " " + newFrom[2] + " - " + newTo[0] + " " + monthName[newTo[1].replace(/^0+/, '')] +" " + newTo[2]);
    }
  }
  return newDate;
}

/**
*   Function to convert text/string/subject to slug url for SEO friendly
*   @param string
*   @return slug url separated by -
*/
function convertToSlug(Text)
{
    return Text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * fbPixelDynamicAds : function to call fb ads for websites
 * @param  {String} track        ex : 'track'
 * @param  {String} event_code   ex : 'ViewContent' or 'AddToCart' or 'Purchase'
 * @param  {Number} value        ex : 1.000.000
 * @param  {String} currency     ex : 'IDR', 'USD', etc
 * @param  {Array} content_ids   ex : ['48891'] , ['123123', '123533']
 * @param  {String} content_type ex : 'product' or 'product_group'
 * @return {undefined}
 * @source https://developers.facebook.com/docs/ads-for-websites/tag-api
 */
function fbPixelDynamicAds(track, event_code, value, currency, content_ids, content_type) {
  fbq(track, event_code, {
    value: value,
    currency: currency,
    content_ids: content_ids,
    content_type: content_type
  });
}

/**
 * numberWithDot : Thousand formatter with dot
 * @param  {[number]} value unformated number, ex : 10000
 * @return {[string]}  new format, ex: from 100000 to 100.000
 */
function numberWithDot (value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
