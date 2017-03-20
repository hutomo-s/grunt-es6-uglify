jQuery('.number').keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    $phone = $(this);

    // Allow numeric (and tab, backspace, delete) keys only
    return (key == 8 ||
    key == 9 ||
    key == 46 ||
    (key >= 48 && key <= 57) ||
    (key >= 96 && key <= 105));
});

jQuery('.character').keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    return (key == 8 ||
    key == 9 ||
    key == 32 ||
    key == 46 ||
    (key >= 65 && key <= 90));
});

$('.min-max').keydown(function (e) {
    var key = e.charCode || e.keyCode || 0;
    $phone = $(this);
});