$("#cancel_confirmation").click(function(){
	// add condition for oneway and return
	switchView("ONEWAY");
});

$("#choose_ticket").click(function(){

	$(".loading-ring-flight").removeClass("hidden");

	var url = ajax_post_segments;
	var segments = JSON.stringify(fi_segments);
	var passengers_json = {
		adult: parseInt(fi_basic_data.adult),
		child: parseInt(fi_basic_data.child),
		infant: parseInt(fi_basic_data.infant)
	};
	var passengers = JSON.stringify(passengers_json);

	var final_price_segment = fi_final_price_segment;
	var require_dob = false;

	for(i=0; i<fi_require_dob.length; i++){
		require_dob = require_dob || fi_require_dob[i];
	}

	var basicdata = JSON.stringify(fi_basic_data);
	var odata = JSON.stringify(fi_odata);

	var postData = {
		trip: fi_basic_data.trip,
		segments: segments,
		passengers: passengers,
		require_dob: require_dob,
		fi_basic_data: basicdata,
		odata: odata,
		final_price_segment: final_price_segment,
	};

	$.ajax({
		url: url,
		type: "POST",
		data: postData,
		dataType: "json"
	}).done(function(data) {

		$(".loading-ring-flight").addClass("hidden");

		if(data.guest_mode) {
			showAgentPopUp(data.message_cart_header);
		}

		if(data.status === 200 && data.redirect)
			window.location = data.redirect;
	});
});

function showAgentPopUp(header){
	var html_message = '<div style="mui-col-xs-12 mui-col-md-12" align="center"><img src="'+ img_fitur_dikunci + '" width="40%"></div><br>\
	<div style="mui-col-xs-12 mui-col-md-12"><span class="mui--text-caption">Ayo daftar jadi agen Kudo sekarang dan nikmati penghasilan tambahan hingga jutaan rupiah setiap bulan!</span></div><br>\
	<p style="mui-col-xs-12 mui-col-md-12 switches-ticket" align="right">\
		<a href="'+ popup_register_url +'" class="kudo--text-positive-color mui--text-caption font-bold flight-link">DAFTAR JADI AGEN</a></p>\
	<p style="mui-col-xs-12 mui-col-md-12 switches-ticket" align="right">\
		<a href="'+ popup_login_url +'" class="kudo--text-positive-color mui--text-caption font-bold flight-link">MASUK SEBAGAI AGEN</a></p>\
	<p style="mui-col-xs-12 mui-col-md-12 switches-ticket" align="right">\
		<a onclick="modalClose()" class="kudo--text-positive-color mui--text-caption font-bold flight-link">TUTUP</a></p>';

	var params = {};
	params.title = header;
	params.message = html_message;
	params.hide_action_btn = true;
	params.agen_mode_2 = true;

	activateModal(params);
}
