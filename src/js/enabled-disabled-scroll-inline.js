$( document ).ready(function() { 
    disableScroll();  
});

$(function()
{
    $(window).bind('load', function()
    {   
        setTimeout(function(){
            enableScroll();            
        }, 2000);
    });
});  