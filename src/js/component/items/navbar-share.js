window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));


if (typeof fb_picture != 'undefined' && fb_picture != "") {
  var fb_picture = fb_picture;
} else {
  var fb_picture = "http://kudo.co.id/wp-content/plugins/kudo_plugin/public/desktop/img/logo.png";
}

if(typeof fb_description != 'undefined' && fb_description != "") {
    var fb_description = fb_description;
} else {
    var fb_description = "Kudo - Semua bisa Belanja Online";
}

if(typeof fb_message != 'undefined' && fb_message != "") {
    var fb_description = fb_message;
} else {
    var fb_message = "Kudo - Semua bisa Belanja Online";
}

if(typeof fb_caption == 'undefined' || fb_caption == "") {
    var fb_caption = '#kudo';
}

if(typeof fb_name == 'undefined' || fb_name == ""){
    var fb_name = 'Kudo.co.id';
}

if(typeof fb_domain == 'undefined' || fb_domain == ""){
    var fb_domain = httpHost;
}

if(typeof linkreferral != 'undefined' && linkreferral != "") {
    var linkweb = linkreferral;
}else{
    var linkweb = currentURL;
}

function sharedfb(){
    ga_tracker('social-media', 'Facebook');
    var fb_picture = "";
    var fb_description = title;
    fb_description = fb_description.replace(/<[^>]*>/g, '');

    var fb_message = desc;
    if (fb_picture == ""){
        var  fb_picture = $('.slick-active').find('img').attr('src');
    }
    // for promo share
    if (typeof fb_picture == 'undefined'){
        var fb_picture = $('.gallery-items').attr('src');
    }
    if (fb_description == ""){
        var  fb_description = "";
    }
    if (fb_message == ""){
        var  fb_message = "";
    }
    FB.ui(
    {
        method: 'feed',
        name:fb_description ,
        domain:fb_domain ,
        link: linkweb,
        picture: fb_picture,
        caption: fb_caption,
        description: fb_name,
        message: fb_message
    });
    $('#share').modal('hide');
}

function twitter(){
    $('#share').modal('hide');
    ga_tracker('social-media', 'Twitter');
    var fb_picture = "";
    if (fb_picture == ""){
        var  fb_picture = "http://"+getParameterByName('url', $('.slick-active').find('img').attr('src'));
    }

    var shared_module = 'product';
    var product_name = getProductName();
    var tw_text = urlencodeTwitter+" "+product_name;
    var link = "http://twitter.com/share?text="+tw_text+"&url="+encodeURIComponent(getProductUrl())+"&image="+encodeURIComponent(fb_picture)+"&hashtags=kudo";
    window.open(link,"tweet", "height=400,width=550,resizable=1");
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function sharedwa(){
    $('#share').modal('hide');
        ga_tracker('social-media', 'Whatsapp');
        var product_name = getProductName();
        if(moduleVal != 'product'){
            var wa_text = waModule+" "+product_name+" - "+encodeURIComponent(getProductUrl());
        }else{
            var wa_text = urlencodeFb+$('.price-to-share').attr('data-price')+shareFbProduct2+encodeURIComponent(getProductUrl());
        }
        var link = "whatsapp://send?text="+wa_text;
        window.open(link,"wa", "height=400,width=550,resizable=1");
}

function sharedwaDesktop(){
        ga_tracker('social-media', 'Desktop Whatsapp');
        var link = "https://web.whatsapp.com/";
        window.open(link,"wa", "height=400,width=550,resizable=1");
}

function getProductName(){
        return urlEncodeTitle
}
function getProductUrl(){
        return urlShort
}
