var initFloat = null;
function Block_floating_button() {
    this.initFloat = floatOnScroll();
}

function floatOnScroll () {
    $(window).scroll(function(){
        hideButton();
        clearTimeout($.data(this, 'scrollTimer'));
        $.data(this, 'scrollTimer', setTimeout(function() {
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