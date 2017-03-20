$("#checkbox").click(function() {
    var $this = $(this);
    if ($this.is(':checked')) {
        $.ajax({
            type: 'post',
            url: urlRemoveCookies,
            data: {
                name: $this.val()
            },
            dataType: 'json',
            beforeSend: function(data) {},
            success: function(retval) {}
        });
    } else {
        $.ajax({
            type: 'post',
            url: urlAddCookies,
            data: {
                name: $this.val()
            },
            dataType: 'json',
            beforeSend: function(data) {},
            success: function(retval) {}
        });
    }
});

$(function() {
    $('#deviceHeight1').css({
        'height': ($(document).height()) + 'px'
    });
    $('#deviceHeight2').css({
        'height': ($(document).height()) + 'px'
    });
    $('#deviceHeight3').css({
        'height': ($(document).height()) + 'px'
    });
  $(window).resize(function() {
      $('#deviceHeight1').css({
          'height': ($(document).height()) + 'px'
      });
      $('#deviceHeight2').css({
          'height': ($(document).height()) + 'px'
      });
      $('#deviceHeight3').css({
          'height': ($(document).height()) + 'px'
      });
  });
});
