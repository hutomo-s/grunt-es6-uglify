$(document).ready(function() {
       $('.myCarouselTutorial').carousel('pause');
    });
    $('.tutorial-skip-content').click(function() {
      $.ajax({
          type    : 'post',
          url     : REMOVETUTORIAL,
          dataType: 'json',
          beforeSend : function (data){
          },
          success: function(retval)
          {
          }
      });
    });
