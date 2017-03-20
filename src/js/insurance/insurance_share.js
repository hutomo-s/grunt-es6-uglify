if(typeof fb_picture != 'undefined' && fb_picture != "")
{
    var fb_picture = fb_picture;
}
else
{
    var fb_picture = "http://kudo.co.id/wp-content/plugins/kudo_plugin/public/desktop/img/logo.png";
}

if(typeof fb_description != 'undefined' && fb_description != "")
{
    var fb_description = fb_description;
}
else
{
    var fb_description = "Kudo - Semua bisa Belanja Online";
}

if(typeof fb_message != 'undefined' && fb_message != "")
{
    var fb_description = fb_message;
}
else
{
    var fb_message = "Kudo - Semua bisa Belanja Online";
}
if(typeof fb_caption == 'undefined' || fb_caption == "")
{
    var fb_caption = '#kudo';
}
if(typeof fb_name == 'undefined' || fb_name == "")
{
    var fb_name = 'Kudo.co.id';
}
if(typeof fb_domain == 'undefined' || fb_domain == "")
{
    var fb_domain = v_fbDomain;
}
if(typeof linkreferral != 'undefined' && linkreferral != "") {
    var linkweb = linkreferral;
}else{
    var linkweb = v_linkWeb;
}
function sharedfb(){

    ga_tracker('social-media', 'Facebook');
    var fb_picture = "";

    var fb_description = "Asuransi Jiwa Kudo";
    fb_description = fb_description.replace(/<[^>]*>/g, '');

    var fb_message = "Asuransi Jiwa Kudo adalah Asuransi kecelakaan diri dan jiwa berjangka 1 tahun hasil kerjasama dengan PT Equity Life Indonesia.";

    if (fb_picture == ""){
        var  fb_picture = $('.slick-active').find('img').attr('src');
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
        name:fb_name ,
        domain:fb_domain ,
        link: linkweb,
        picture: fb_picture,
        caption: fb_caption,
        description: fb_description,
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

   var link = "http://twitter.com/share?text="+v_formatShareTwitter+getProductName()+"&url="+encodeURIComponent(getProductUrl())+"&image="+encodeURIComponent(fb_picture)+"&hashtags=kudo";
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
        var link = "whatsapp://send?text="+v_formatWA+"("+getProductName()+")"+"-"+encodeURIComponent(getProductUrl())+"";
        window.open(link,"wa", "height=400,width=550,resizable=1");
}

function sharedwaDesktop(){
        ga_tracker('social-media', 'Desktop Whatsapp');
        var link = "https://web.whatsapp.com/";
        window.open(link,"wa", "height=400,width=550,resizable=1");
}

function getProductName(){
        return  "Asuransi Jiwa Kudo";
}
function getProductUrl(){
        return  "/asuransi-jiwa-kudo/";
}
