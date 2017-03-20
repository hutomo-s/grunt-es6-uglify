$('#checkbox').click(function() {
    var $this = $(this);
    if ($this.is(':checked')) {
        $.ajax({
            type: 'post',
            url: v_removeCookiesUrl,
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
            url: v_addCookiesUrl,
            data: {
                name: $this.val()
            },
            dataType: 'json',
            beforeSend: function(data) {},
            success: function(retval) {}
        });
    }
});
