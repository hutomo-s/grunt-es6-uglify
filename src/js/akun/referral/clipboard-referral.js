var clipboard = new Clipboard('.btn-clipboard');

clipboard.on('success', function(e) {    
    $('.success-msg').stop().fadeIn(400).delay(5000).fadeOut(400);
    e.clearSelection();
});

clipboard.on('error', function(e) {
	selectText("element-referral");
});

function selectText(element) {
		var doc = document
        , text = doc.getElementById(element)
        , range, selection
		;
		if (doc.body.createTextRange) {
			range = document.body.createTextRange();
			range.moveToElementText(text);
			range.select();
		}else if (window.getSelection) {
			var formfield = document.getElementById('element-referral');
			formfield.focus()
			formfield.setSelectionRange(0, formfield.value.length)
		}
}
