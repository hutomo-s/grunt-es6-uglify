var isHit=false;
$(document).ready(function() {
   $('.myCarouselTutorial').carousel('pause');
});
$('.tutorial-skip-content').click(function() {
    if(isHit == false){
        $.ajax({
            type    : 'post',
            url     : REMOVETUTORIAL,
            dataType: 'json',
            success: function(retval)
            {
            }
        });
      isHit=true;
    }
});
