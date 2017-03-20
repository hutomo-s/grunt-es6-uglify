var fi_change_date = [];
var fi_change_date_ret = [];
var sortParams = {};
var filter_airlines = {};
var filterParams = {};
filterParams.trip_type = {};
filterParams.airline_codes = [];
filterParams.arrival_time_enums = [];
var lastFilterParams = JSON.parse(JSON.stringify(filterParams));

var fi_selected_oneway = {};
var count_data_depart = 0;
var count_data_return = 0;
var vendor_error = 0;

var fi_confdata_oneway = {};
var fi_confdata_return = {};
var fi_segments_oneway = [];
var fi_segments_return = [];

var fi_require_dob = [];

var fi_odata = {};

var fi_ow_result_index = 0;

fi_navbar_data();
switchView("ONEWAY");
showCommision();

if(back_odata.ow_data){
	clickOneWay(0, true);
}

if(back_odata.ret_data){
	$(document).ready(function(){
		clickReturn(0, true);
	});
}

function switchView(strParam) {

	fi_default_view = strParam;

	if(fi_default_view === "ONEWAY"){
		$("#fi_oneway").removeClass("hidden");
		$("#fi_return").addClass("hidden");
		$("#fi_confirmation").addClass("hidden");
	}
	else if(fi_default_view === "RETURN"){
		$("#fi_oneway").addClass("hidden");
		$("#fi_return").removeClass("hidden");
		$("#fi_confirmation").addClass("hidden");
	}
	else if(fi_default_view === "CONFIRM"){
		$("#fi_oneway").addClass("hidden");
		$("#fi_return").addClass("hidden");
		$("#fi_confirmation").removeClass("hidden");
	}
}

$.ajax({
	url: ajax_airline_list
}).done(function(data) {

	if(data.airline_list){
		fi_airline_list = data.airline_list;
		callbackAirline(fi_airline_list, fi_basic_data);
	}
	else{
		// network error handling
		$("#loading-search-flight").hide();
		$("#loading-search-flight-return").hide();
		$("#flight_results").hide();
		$("#fi_network_error").removeClass("hidden");
	}

});


var httpBuildQuery = function(params) {

	if (typeof params === 'undefined' || typeof params !== 'object') {
		params = {};
		return params;
	}

	var query = '?';
	var index = 0;

	for (var i in params) {
		index++;
		var param = i;
		var value = params[i];
		if (index == 1) {
			query += param + '=' + value;
		} else {
			query += '&' + param + '=' + value;
		}
	}
	return query;
};

function callbackAirline(fi_airline_list, fi_basic_data){
	for (i = 0; i < fi_airline_list.length; i++) {

		var fi_basic_data = fi_basic_data;
		fi_basic_data.airline = fi_airline_list[i];

		var str_qs = httpBuildQuery(fi_basic_data);
		callbackSearch(str_qs);
	}
}


function callbackSearch(str_qs){
	var full_url = ajax_search_flight + str_qs;

	$.ajax({
	url: full_url,
	timeout: 120*1000,
	}).done(function(data) {

		if(data.status == 200 && data.departs){
			count_data_depart += data.departs.length;
			generateFlightSchedules(data.departs, data.airline_name);
		}

		if(data.status == 200 && data.returns){
			count_data_return += data.returns.length;
			generateFlightReturnSchedules(data.returns, data.airline_name);
		}

		if(data.status == 5005 || data.status == 5004){
			vendor_error += 1;
		}

	}).complete(function() {
		fi_completed_result = fi_completed_result + 1;
		percentage_completed = fi_completed_result/fi_airline_list.length*100;
		moveProgressBar(percentage_completed);

		autoSortByPrice();

		if(fi_selected_oneway.arrival)
			hideFlightsBelowSixHours();

		if(percentage_completed >= 100){

			$('.progress-wrap').addClass('hidden');

			generateFilterAirlineList();
			generateSortOptions();
			generateSortOptionsReturn();

			generateReturnFilterList();

			if(count_data_depart === 0 && vendor_error === 0){
				$("#flight_results").hide();

				var oneway_date_text = dateIndo(fi_basic_data['date']);
				$("#fi_date_noflight").text(oneway_date_text);
				$("#fi_no_flight_result").removeClass("hidden");
			}
			else if(count_data_depart === 0 && vendor_error > 0){
				$("#flight_results").hide();
				$("#fi_vendor_error").removeClass("hidden");
			}

			if(count_data_return === 0){
				$("#flight_return_results").hide();

				var return_date_text = dateIndo(fi_basic_data['return_date']);
				$("#fi_date_noflight_ret").text(return_date_text);

				$("#fi_no_flight_result_ret").removeClass("hidden");
			}

		}
		if(fi_completed_result >= 1){
			$("#loading-search-flight").hide();
			$("#loading-search-flight-return").hide();
		}
		if(fi_completed_result === 1){
			generateList7Days();

			if(fi_basic_data.return_date && fi_basic_data.trip === "return")
				generateList7DaysReturn();
		}
	});
}

function fi_facilities_refund_wording(airline_code){

	var url = refund_baseurl;
	var fi_facilities_refund_wording = 'Tiket dapat direfund. Silahkan cek ' +
			'<a href="#" onclick="showSk(\'' + airline_code + '\')">' +
			'<span class="kudo--text-primary-color">Syarat dan Ketentuan</span></a>' +
			' prosedur refund tiket';
	return fi_facilities_refund_wording;
}

function generateFlightSchedules(dataList, airlineName){
	for(i = 0; i < dataList.length; i++){
		generateOneFlightSchedule(dataList[i], airlineName);
	}
}

function clickOneWay(elem, autoClick){

	if(autoClick){
		fi_confdata_oneway = back_odata.ow_data;
		var dataOneLine = back_odata.ow_dataOneLine;
		fi_selected_oneway.arrival = dataOneLine.sta;
	}
	else{
		fi_confdata_oneway = $(elem).data("data");
		var dataOneLine = $(elem).data("dataOneLine");
		fi_selected_oneway.arrival = dataOneLine.sta;
	}

	fi_odata.ow_data = fi_confdata_oneway;
	fi_odata.ow_dataOneLine = dataOneLine;

	var segments = dataOneLine.segments;
	fi_segments_oneway = [];
	fi_segments_oneway = fi_segments_oneway.concat(segments);

	var require_dob = dataOneLine.require_dob;
	fi_require_dob = fi_require_dob.concat(require_dob);

	$("#show_ticket_detail_conf").data("data", dataOneLine);

	var oneway_trip_type = fi_confdata_oneway.trip_type;
	var date_str = fi_confdata_oneway.date_str + "";

	var date_info = dateIndo(date_str, 0, 0, 1);
	var date_human = dateIndo(date_str, true);
	var dep_h_i = fi_confdata_oneway.departure_h_i;

	var departure_timezone = fi_confdata_oneway.departure_timezone;

	var str_1 = "Berangkat " + date_info + ", " + dep_h_i + " " + departure_timezone;
	var str_2 = fi_confdata_oneway.airline_code + " | " + oneway_trip_type + " (" + numRp(fi_confdata_oneway.final_price) + "/orang)";
	$("#fi_oneway_summary_h1").text(str_1);
	$("#fi_oneway_summary_h2").text(str_2);

	fi_confdata_oneway.date_human = date_human;
	fi_confdata_oneway.final_price_human = numRp(fi_confdata_oneway.final_price);
	fi_confdata_oneway.ori_price_human = numRp(dataOneLine.ori_price);

	$(".ow_arrival_plusone").addClass("hidden");
	if(!fi_confdata_oneway.date_equal_std_sta){
		$(".ow_arrival_plusone").removeClass("hidden");
	}

	$("#ow_ori_price_span").removeClass("hidden");
	if(parseInt(dataOneLine.ori_price) === parseInt(fi_confdata_oneway.final_price)){
		$("#ow_ori_price_span").addClass("hidden");
	}

	if(fi_basic_data.trip === "oneway" && fi_basic_data.return_date === ""){
		ticketConfirmation();
		return;
	}

	if(fi_selected_oneway.arrival && autoClick == null){
		hideFlightsBelowSixHours();
	}

	$("#fi_no_flight_result_ret").addClass("hidden");
	$("#flight_return_results").show();

	switchView("RETURN");

}

function ticketConfirmation(){

	var f = fi_basic_data;
	if(f.trip === "oneway"){
		var trip_method = "Sekali Jalan";
	}
	else if(f.trip === "return"){
		var trip_method = "Pulang Pergi";
	}

	fi_segments = fi_segments_oneway.concat(fi_segments_return);

	var dep_arr = f.from + "-" + f.to;
	var pax_summary = updatePaxSummary();
	var conf_summary = trip_method + " " + dep_arr + ", " + pax_summary;

	var id_html = {};
	id_html = fi_confdata_oneway;
	id_html.confirmation_summary = conf_summary;
	id_html.total_final_price = fi_confdata_oneway.total_final_price;
	id_html.total_final_price_human = numRp(id_html.total_final_price);

	$("#ow_airline_img").attr("src", id_html.airline_img_src);

	for (var id_selector in id_html){
		$("#ow_"+id_selector).html(id_html[id_selector]);
	}

	if(f.trip === "return"){

		$("#confirmation_return_flight").removeClass("hidden");

		var ret_id_html = {};
		ret_id_html = fi_confdata_return;

		var totalFinalPriceOw = id_html.total_final_price;
		var totalFinalPriceRet = fi_confdata_return.total_final_price;
		var total_final_price = totalFinalPriceOw + totalFinalPriceRet;
		var total_final_price_human = numRp(total_final_price);

		$("#ret_airline_img").attr("src", ret_id_html.airline_img_src);
		for (var id_selector in ret_id_html){
			$("#ret_"+id_selector).html(ret_id_html[id_selector]);
		}

		$("#ow_total_final_price_human").html(total_final_price_human);

		fi_final_price_segment = total_final_price;
	}
	else{
		fi_final_price_segment = fi_confdata_oneway.total_final_price;
	}
	switchView("CONFIRM");
}

$("#confirmation-ticket-back").click(function(){
	// add condition for oneway and return
	if(fi_basic_data.trip === "oneway"){
		switchView("ONEWAY");
	}
	else if(fi_basic_data.trip === "return"){

		if(back_odata.ret_data)
			switchView("ONEWAY");
		else
			switchView("RETURN");
	}
});

function hideFlightsBelowSixHours(){

	var flight_show = 0;

	$(".ret_flight_result_one").each(function() {
		var data = $(this).data("data");

		// string
		var sta_str = fi_selected_oneway.arrival + "";
		var sta_arr = sta_str.split(/[- :]/);
		var oneway_arrival = new Date(sta_arr[0], sta_arr[1]-1, sta_arr[2], sta_arr[3], sta_arr[4], sta_arr[5]);

		var return_departure = data.sort_departure;
		var diff_return_oneway_in_minutes = diff_minutes(return_departure, oneway_arrival);

		if(return_departure < oneway_arrival || diff_return_oneway_in_minutes < 360){
			$(this).hide();
		}
		else{
			flight_show += 1;
			$(this).show();
		}
	});

	// important: show not found while percentage === 100
	if(flight_show < 1 && percentage_completed === 100){

		var return_date_text = dateIndo(fi_basic_data['return_date']);
		$("#fi_date_noflight_ret").text(return_date_text);

		$("#flight_return_results").hide();
		$("#fi_no_flight_result_ret").removeClass("hidden");
	}
}

function generateSortOptions(){

	var sort_options = {
		"final_price": "Harga Termurah",
		"sort_duration": "Durasi Tercepat",
		"sort_departure": "Waktu Keberangkatan Paling Awal",
		"sort_arrival": "Waktu Tiba Paling Awal"
	};

	$.each(sort_options, function(key, value) {

		var $li = $("<div />").addClass("mui-col-xs-12 flight-divider sembunyikan-detail");
		var $li_1 = $("<div />").addClass("mui-col-xs-1 mui--text-center padding-reset");
		var $label = '<label class="control control--radio">\
							<input name="radio" type="radio" onclick="clickSortParams(this)" data-value="'+ key +'">\
							<div class="control__indicator"></div>\
						</label>';
		$li_1.html($label);
		$li.append($li_1);

		var $li_2 = $("<div />").addClass("mui-col-xs-11");
		$li_2.text(value);
		$li.append($li_2);

		$("#sort_criteria_list").append($li);
	});

}

function generateFilterAirlineList(){

	var filter_trip_type = {
		"DIRECT" : "Langsung",
		"TRANSIT" : "Transit"
	};

	var filter_departure_times = {
		 1: "Pagi (04:00 - 11:00)",
		 2: "Siang (11:00 - 15:00)",
		 3: "Sore (15:00 - 18:30)",
		 4: "Malam (18:30 - 04:00)"
	};

	$.each(filter_trip_type, function(key, value) {

		var $li = $("<div />").addClass("mui-col-xs-12 flight-divider");
		var $li_1 = $("<div />").addClass("mui-col-xs-10 flight-pd-left-0");
		$li_1.text(value);
		$li.append($li_1);

		var $li_2 = $("<div />").addClass("mui-col-xs-2 mui--text-center");
		var $li_2_html = '<label class="control control--checkbox">\
							<input type="checkbox" class="kf_filter" onclick="clickFilterTripType(this)" data-value="'+ key +'" />\
							<div class="control__indicator"></div>\
						</label>';
		$li_2.html($li_2_html);
		$li.append($li_2);

		$("#filter_triptype_list").append($li);
	});

	$.each(filter_departure_times, function(key, value) {

		var $li = $("<div />").addClass("mui-col-xs-12 flight-divider");
		var $li_1 = $("<div />").addClass("mui-col-xs-10 flight-pd-left-0");
		$li_1.text(value);
		$li.append($li_1);

		var $li_2 = $("<div />").addClass("mui-col-xs-2 mui--text-center");
		var $li_2_html = '<label class="control control--checkbox">\
							<input type="checkbox" class="kf_filter" onclick="clickFilterDepartureTime(this)" data-value="'+ key +'" />\
							<div class="control__indicator"></div>\
						</label>';
		$li_2.html($li_2_html);
		$li.append($li_2);

		$("#filter_deptime_list").append($li);
	});

	$.each(filter_airlines, function(key, value) {

		var $li = $("<div />").addClass("mui-col-xs-12 flight-divider");
		var $li_1 = $("<div />").addClass("mui-col-xs-10 flight-pd-left-0");
		$li_1.text(value);
		$li.append($li_1);

		var $li_2 = $("<div />").addClass("mui-col-xs-2 mui--text-center");
		var $li_2_html = '<label class="control control--checkbox">\
							<input type="checkbox" class="kf_filter" onclick="clickFilterAirline(this)" data-value="'+ key +'" />\
							<div class="control__indicator"></div>\
						</label>';
		$li_2.html($li_2_html);
		$li.append($li_2);

		$("#filter_airline_list").append($li);
	});
}

function clickFilterTripType(elem){
	var checked = ($(elem).is(":checked")) ? true : false;
	var value = $(elem).attr("data-value");

	if(value === "DIRECT"){
		if(checked)
			filterParams.trip_type.direct = true;
		else
			filterParams.trip_type.direct = false;
	}
	else if(value === "TRANSIT"){
		if(checked)
			filterParams.trip_type.transit = true;
		else
			filterParams.trip_type.transit = false;
	}
}

function clickFilterDepartureTime(elem){
	var checked = ($(elem).is(":checked")) ? true : false;
	var dep_time_enum = parseInt( $(elem).attr("data-value") );

	if(checked){
			if(!inArray(dep_time_enum, filterParams.arrival_time_enums))
				filterParams.arrival_time_enums.push(dep_time_enum);
		}
	else{
		if(inArray(dep_time_enum, filterParams.arrival_time_enums)){
			var index = $.inArray(dep_time_enum, filterParams.arrival_time_enums);
			filterParams.arrival_time_enums.splice(index, 1);
		}
	}
}

function clickFilterAirline(elem){
		var checked = ($(elem).is(":checked")) ? true : false;
		var airline_code = $(elem).attr("data-value");

		if(checked){
			if(!inArray(airline_code, filterParams.airline_codes))
				filterParams.airline_codes.push(airline_code);
		}
		else{
			if(inArray(airline_code, filterParams.airline_codes)){
				var index = $.inArray(airline_code, filterParams.airline_codes);
				filterParams.airline_codes.splice(index, 1);
			}
		}
}

function autoSortByPrice(){
	sort_by = "final_price";

	// oneway case
	sortParams.key = sort_by;
	sortResult();

	// return case
	retSortParams.key = sort_by;
	sortResultReturn();
}

function clickSortParams(elem){
	var sort_by = $(elem).attr("data-value");
	sortParams.key = sort_by;

	sortResult();
	toggleFlightSort();
}

function applyFilter(){
	var filter = filterParams;
	lastFilterParams = JSON.parse(JSON.stringify(filter));

	if(count_data_depart){
		filterResult();
	}

	toggleFlightFilter();
}

function resetFilter(){
	filterParams.trip_type = {};
	filterParams.airline_codes = [];
	filterParams.arrival_time_enums = [];
	$('.kf_filter').attr('checked', false);
}

//tab filter
$('#back-flight-filter').click(function() {
	var lastFilter = lastFilterParams;
	filterParams = JSON.parse(JSON.stringify(lastFilter));
	toggleFlightFilter();
});

$('#flight-filter').click(function() {

	var arrival_time = lastFilterParams.arrival_time_enums;
	var airlines = lastFilterParams.airline_codes;

	if(lastFilterParams.trip_type.direct){
		autoCheckFilter("DIRECT");
	}
	if(lastFilterParams.trip_type.transit){
		autoCheckFilter("TRANSIT");
	}
	for(i=0; i<arrival_time.length; i++){
		var key = arrival_time[i];
		autoCheckFilter(key);
	}
	for(i=0; i<airlines.length; i++){
		var key = airlines[i];
		autoCheckFilter(key);
	}

	toggleFlightFilter();
});

$('#flight-urutkan, #back-flight-urutkan').click(function() {
	toggleFlightSort();
});

$('#flight-ganti-tanggal, #back-flight-ganti-tanggal').click(function() {
	toggleFlightChangeDate();
});

function toggleFlightFilter() {
	toggleByClass("slide-div-bottom-flight-filter");
}

function toggleFlightSort() {
	toggleByClass("slide-div-bottom-flight-urutkan");
}

function toggleFlightChangeDate() {
	toggleByClass("slide-div-bottom-flight-ganti-tanggal");
}

function autoCheckFilter(key){
	$(".kf_filter[data-value='"+ key +"']").prop('checked', true);
}

function toHourMinutes(mysqlDateStr){
	
	var mysqlDateStr = mysqlDateStr + "";
	var arr = mysqlDateStr.split(/[- :]/);
 	var date1 = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);

	var hours = date1.getHours();
	var minutes = date1.getMinutes();

	if(hours < 10)
		hours = "0"+ hours;
	if(minutes < 10)
		minutes = "0"+ minutes;

	var str = hours + ":" + minutes;
	return str;
}

function toHour(mysqlDateStr){
	date1 = new Date ( mysqlDateStr );
	var hours = date1.getHours();
	return parseInt(hours);
}

function toMinute(mysqlDateStr){
	date1 = new Date ( mysqlDateStr );
	var minutes = date1.getMinutes();
	return parseInt(minutes);
}

function numRp(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + '.' + '$2');
	}
	return 'Rp ' + x1 + x2;
}

Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = this.getDate().toString();
        return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};

// todo: build better html display with those data
function generateOneFlightSchedule(dataOneLine, airlineName){

	var flight_designator = dataOneLine.segments[0].FlightDesignator;
	var origin = dataOneLine.segments[0].Origin;
	var destination = dataOneLine.segments[0].Destination;

	var transit = (dataOneLine.segments.length > 1) ? true : false;
	var airline_img_src = dataOneLine.image_airline;

	var airline_name_seg0 = flight_designator.CarrierName;
	var airline_name_seg1 = (dataOneLine.segments[1]) ?  dataOneLine.segments[1].FlightDesignator.CarrierName : false;
	var airline_name = summarizeAirlineName(transit, airline_name_seg0, airline_name_seg1);

	var departure_h_i = toHourMinutes(dataOneLine.std);
	var departure_timezone = origin.Timezone_name;
	var arrival_h_i = toHourMinutes(dataOneLine.sta);
	var arrival_timezone = destination.Timezone_name;
	var from = dataOneLine.depart_airport_code;
	var to = dataOneLine.arrival_airport_code;
	var duration = dataOneLine.duration;
	var trip_type = (transit) ? "Transit" : "Langsung";

	var show_harga_coret = (dataOneLine.ori_price !== dataOneLine.final_price) ? true : false;

	var harga_coret = (show_harga_coret) ? numRp(parseInt(dataOneLine.ori_price)) : 0;
	var price = numRp(parseInt(dataOneLine.final_price)); //dataOneLine.ori_price;

	var data = {};
	data.transit = transit;
	data.hour = toHour(dataOneLine.std);
	data.minute = toMinute(dataOneLine.std);
	data.airline_code = flight_designator.CarrierName;
	data.final_price = parseInt(dataOneLine.final_price);

	data.index = fi_ow_result_index;
	fi_ow_result_index += 1;

	var std_str = dataOneLine.std + "";
	var std_arr = std_str.split(/[- :]/);
	var ios_std = new Date(std_arr[0], std_arr[1]-1, std_arr[2], std_arr[3], std_arr[4], std_arr[5]);

	var sta_str = dataOneLine.sta + "";
	var sta_arr = sta_str.split(/[- :]/);
	var ios_sta = new Date(sta_arr[0], sta_arr[1]-1, sta_arr[2], sta_arr[3], sta_arr[4], sta_arr[5]);

	data.date_equal_std_sta = dateEqual(std_str, sta_str);
	dataOneLine.date_equal_std_sta = data.date_equal_std_sta;

	data.sort_duration = diff_minutes(ios_sta, ios_std);
	data.sort_departure = ios_std;
	data.sort_arrival = ios_sta;
	data.date_str = data.sort_departure.yyyymmdd();
	data.departure_h_i = departure_h_i;
	data.departure_timezone = departure_timezone;

	data.airline_img_src = airline_img_src;
	data.airline_name = airline_name;
	data.trip_type = trip_type;
	data.arrival_h_i = arrival_h_i;
	data.arrival_timezone = arrival_timezone;
	data.from = from;
	data.to = to;
	data.duration = duration;
	data.total_final_price = dataOneLine.total_final_price;

	if(!filter_airlines[flight_designator.CarrierName])
		filter_airlines[flight_designator.CarrierName] = flight_designator.CarrierName;

	var $li = $('<div />').addClass("mui-panel flight-mrgn-bot flight_result_one flight-border-radius-4 flight-pd-btm-10 flight-pd-left-8 flight-pd-right-8").data("data", data);

	var $li_1 = $('<a />').addClass("txt-decoration-none").attr("href", "#").attr("onclick", "clickOneWay(this)").data("data", data).data("dataOneLine", dataOneLine);

	var $li_1a = $('<div />').addClass("mui-col-xs-12").addClass("padding-reset").addClass('flight-mrgn-bot');

	var $div_airline_img = $('<div />').addClass('mui-col-xs-2').addClass('flight-img').addClass('padding-reset').addClass('mui--text-center');
	var img_airline = $('<img>').attr('src', airline_img_src).attr("style", "width:100%;");
	$div_airline_img.append(img_airline);

	var $div_departure = $('<div />').addClass('mui-col-xs-4').addClass('box-bestselling');
	var span_departure = '<span class="mui--text-subhead flight-black font-bold">' + departure_h_i + '</span> <span class="flight-caption-airport flight-black font-semibold">'+ departure_timezone +'</span><br>';
	var span_departure = span_departure + '<span class="mui--text-caption flight-black font-semibold">' + from + '</span>';
	$div_departure.append(span_departure);

	var $div_flight_icon = '<div class="mui-col-xs-1 mui-col-md-1 padding-reset mui--text-center"><i class="material-icons flight-icon flight-black">&#xE539;</i></div>';

	var span_plus_one_date = data.date_equal_std_sta ? '' : '<span class="plus-1 flight-black font-flight-10">+1</span>';
	var $div_arrival = $('<div />').addClass('mui-col-xs-4 to-right').addClass('padding-reset');
	var span_arrival = '<span class="mui--text-subhead flight-black font-bold">' + arrival_h_i + '</span> <span class="flight-caption-airport flight-black font-semibold">'+ arrival_timezone +'</span>' + span_plus_one_date + '<br />';
	var span_arrival = span_arrival + '<span class="mui--text-caption flight-black font-semibold">'+ to +'</span>';
	$div_arrival.append(span_arrival);

	var $li_1ab = $('<div />').addClass("mui-col-xs-12 mui-col-md-12 padding-reset mui--text-right");
	var span_harga_coret = '<span class="flight-harga-coret font-regular">';
	span_harga_coret += harga_coret + '<span class="mui--text-right flight-harga-coret font-regular"> /org</span></span>';

	var $li_1b = $('<div />').addClass("mui-col-xs-12").addClass("padding-reset").addClass('flight-mrgn-bot');
	var $div_airline_name = $('<div />').addClass('mui-col-xs-2').addClass('padding-reset').addClass('mui--text-center');
	var span_airline_name = '<span class="font-flight-10 kudo--text-grey-color font-regular">' + airline_name + '</span>';
	$div_airline_name.append(span_airline_name);

	var $div_duration = $('<div />').addClass('mui-col-xs-5').addClass('box-bestselling');
	var span_duration = '<span class="font-flight-10 kudo--text-grey-color font-regular">' + duration + " | " + trip_type + '</span>';
	$div_duration.append(span_duration);

	var $div_xs_one = $('<div />').addClass('padding-reset');

	var $div_price = $('<div />').addClass('mui-col-xs-5 to-right mui--text-right').addClass('padding-reset');
	var span_price = '<span class="flight-price mui--text-subhead font-semibold">';
	var span_price = span_price + price + '<span class="mui--text-right flight-caption-airport font-regular"> /org</span></span>';
	$div_price.append(span_price);


	$li_1a.append($div_airline_img);
	$li_1a.append($div_departure);
	$li_1a.append($div_flight_icon);
	$li_1a.append($div_arrival);

	$li_1b.append($div_airline_name);
	$li_1b.append($div_duration);
	$li_1b.append($div_xs_one);
	$li_1b.append($div_price);

	$li_1.append($li_1a);

	if(show_harga_coret) {
		$li_1ab.append(span_harga_coret);
		$li_1.append($li_1ab);
	}

	$li_1.append($li_1b);

	$li_2 = $('<a />').addClass("mui-col-xs-12 txt-decoration-none").addClass("padding-reset").attr("href", "#");
	var divider = '<div class="mui-divider"></div>';
	var a_elem = $('<a />').addClass('flight-bottom-nav').attr('href', '#').attr('onclick', "generateFlightDetail(this)").data('data',dataOneLine);
	var a_select_detail = '<div class="mui-col-xs-12 mui-col-md-12 mui--text-body1 padding-reset">';
	var a_select_detail = a_select_detail + '<div class="mui-col-xs-12 mui-col-md-12 flight-margin-top mui--text-left padding-reset kudo--text-grey-color font-regular">LIHAT DETAIL TIKET</div></div>';
	a_elem.append(a_select_detail);

	$li_2.append(divider);
	$li_2.append(a_elem);

	$li.append($li_1);
	$li.append($li_2);

	$("#flight_results").append($li);
}

function durationHelper(hours, minutes){

	var str = hours + " jam " + minutes + " menit";
	return str;
}

function generateFlightDetail(elem){

	var data = $(elem).data('data');

	var transit = (data.segments.length > 1) ? true : false;

	var flight_designator = data.segments[0].FlightDesignator;
	var fare = data.segments[0].Fare;
	var origin = data.segments[0].Origin;
	var destination = data.segments[0].Destination;
	var facilities = data.segments[0].Facilities;
	var duration_total = data.duration;

	var duration = data.segments[0].Duration;
	var duration_wording = durationHelper(duration.Hours, duration.Minutes);

	var facilities_sum = facilities_summary(facilities);
	var facilities_separator = (facilities_sum != "") ? ". " : "";
	var facilities_wording = facilities_sum + facilities_separator + fi_facilities_refund_wording(flight_designator.CarrierCode);

	var div_html = {};
	var id_html = {};
	var class_html = {};

	var transit = (data.segments.length > 1) ? true : false;
	if(transit)
	{
		var t_index = 1;
		var segment = data.segments[t_index];
		var flight_designator_t = segment.FlightDesignator;
		var fare_t = segment.Fare;
		var origin_t = segment.Origin;
		var destination_t = segment.Destination;
		var facilities_t = segment.Facilities;
		var duration_t = segment.Duration;
		var duration_wording_t = durationHelper(duration_t.Hours, duration_t.Minutes);

		var facilities_sum_t = facilities_summary(facilities_t);
		var facilities_separator_t = (facilities_sum_t != "") ? ". " : "";
		var facilities_wording_t = facilities_sum_t + facilities_separator_t + fi_facilities_refund_wording(flight_designator_t.CarrierCode);

		var std1_str = segment.Std + "";
		var std1_arr = std1_str.split(/[- :]/);
		var ios_std1 = new Date(std1_arr[0], std1_arr[1]-1, std1_arr[2], std1_arr[3], std1_arr[4], std1_arr[5]);

		var sta0_str = data.segments[0].Sta + "";
		var sta0_arr = sta0_str.split(/[- :]/);
		var ios_sta0 = new Date(sta0_arr[0], sta0_arr[1]-1, sta0_arr[2], sta0_arr[3], sta0_arr[4], sta0_arr[5]);

		//var transit_duration_in_minute = diff_minutes(new Date(segment.Std), new Date(data.segments[0].Sta));
		var transit_duration_in_minute = diff_minutes(new Date(ios_std1), new Date(ios_sta0));
		var transit_duration = convertMinute(transit_duration_in_minute);

		id_html.df_transit_wording = "Transit "+ transit_duration;
		id_html.df_transit_airport = destination.Name;

		id_html.df_flight_code_t = flight_designator_t.CarrierName + " "+ flight_designator_t.CarrierCode + "-" + flight_designator_t.FlightNumber;

		id_html.df_duration_t = duration_wording_t;

		id_html.df_facilities_summary_t = facilities_wording_t;

		id_html.df_date_departure_t = dateIndo(segment.Std, false, true);
		id_html.df_from_time_t = segment.Origin.City + " (" + origin_t.Code + "), " + toHourMinutes(segment.Std);
		id_html.df_depart_airport_name_t = origin_t.Name;

		id_html.df_date_arrival_t = dateIndo(segment.Sta, false, true);
		id_html.df_to_time_t = segment.Destination.City + " (" + destination_t.Code + "), " + toHourMinutes(segment.Sta);
		id_html.df_arrival_airport_name_t = destination_t.Name;

		$(".transit-toggle").removeClass("hidden");
	}
	else
	{
		$(".transit-toggle").addClass("hidden");
	}

	div_html.df_image_airline = data.image_airline;
	var img_elem = $("<img />").attr("src", div_html.df_image_airline).attr("style", "width:50px;");
	$("#df_image_airline").html(img_elem);

	id_html.df_carrier_name = flight_designator.CarrierName;
	id_html.df_departure_time = toHourMinutes(data.std);
	id_html.df_departure_timezone = origin.Timezone_name;

	id_html.df_arrival_time = toHourMinutes(data.sta);
	id_html.df_arrival_timezone = destination.Timezone_name;

	id_html.df_depart_airport_code = data.depart_airport_code;
	id_html.df_arrival_airport_code = data.arrival_airport_code;

	$(".ow_arrival_plusone").addClass("hidden");
	if(!data.date_equal_std_sta){
		$(".ow_arrival_plusone").removeClass("hidden");
	}

	var duration_and_type = (transit) ? duration_total + "| Transit " : duration_total + "| Langsung";
	id_html.df_total_duration = duration_and_type;
	id_html.df_ori_price = numRp(parseInt(data.ori_price));
	id_html.df_final_price = numRp(parseInt(data.final_price));

	if(data.ori_price == data.final_price){
		$(".fi_ori_price").hide();
	}
	else{
		$(".fi_ori_price").show();
	}

	id_html.df_facilities_summary = facilities_wording;

	id_html.df_date_departure = dateIndo(data.sta, false, true);
	id_html.df_from_time = departure_city + " (" + data.depart_airport_code + "), " + toHourMinutes(data.std);
	id_html.df_depart_airport_name = data.depart_airport_name;
	id_html.df_fare_class = fare.FareClass + " Class";
	id_html.df_duration = duration_wording;

	// this will use class as identifier
	class_html.df_total_duration = data.duration;
	class_html.df_flight_code = flight_designator.CarrierName + " "+ flight_designator.CarrierCode + "-" + flight_designator.FlightNumber;

	id_html.df_date_arrival = dateIndo(data.segments[0].Std, false, true);
	id_html.df_to_time = data.segments[0].Destination.City + " (" + destination.Code + "), " + toHourMinutes(data.segments[0].Sta);
	id_html.df_arrival_airport_name = destination.Name;

	for (var id_selector in id_html){
		$("#"+id_selector).html(id_html[id_selector]);
	}

	for (var id_selector in class_html){
		$("."+id_selector).html(class_html[id_selector]);
	}

	var animation = 400;

	if(fi_default_view === "CONFIRM"){
		switchView("ONEWAY");
		fi_default_view = "CONFIRM";
		animation = 0;
	}

	toggleByClass("slide-div-bottom-ticket-detail-langsung", animation);
}

function summarizeAirlineName(transit, airlineNameSeg0, airlineNameSeg1){
	if(!transit || airlineNameSeg0 === airlineNameSeg1)
		return airlineNameSeg0;

	if(transit && (airlineNameSeg0 !== airlineNameSeg1) )
		return "Multi Maskapai";
}

function facilities_summary(facilities){
	var fi_facilities = {};

	for(i = 0; i < facilities.length; i++){

		var key = (facilities[i].Category) ? facilities[i].Category : "";
		var value = (facilities[i].Value) ? parseInt(facilities[i].Value) : 0;

		if(key)
			fi_facilities[key] = value;
	}

	var strArr = [];

	if(fi_facilities.hasOwnProperty("PSC")) { strArr.push("Termasuk PSC") } //strArr.push(qty_adult+" Dewasa") }
	if(fi_facilities.hasOwnProperty("MEAL")) { strArr.push("GRATIS Makanan") }
	if(fi_facilities["BAG"]) { strArr.push("GRATIS Bagasi " + fi_facilities["BAG"] + "kg" ) }

	strArr = strArr.filter(Boolean);

	var return_str = strArr.join(", ");

	return return_str;
}

function fi_navbar_data(){
	var str_date_pax = dateIndo(fi_basic_data['date'], true) + " | " + updatePaxSummary();
	$("#fi_h2").html(str_date_pax);

	var str_navbar_changedate = dateIndo(fi_basic_data['date'], true) + " | " + fi_basic_data.from + " - " + fi_basic_data.to;

	$("#fi_h_changedate").html(str_navbar_changedate);
}

$("#redirect_to_index").click(function(){
	redirectToSearchIndex();
});

function redirectToSearchIndex(){

	fi_basic_data.departure_city = departure_city;
	fi_basic_data.arrival_city = arrival_city;

	$.ajax({
	url: redirect_to_index,
	method: "POST",
	data: fi_basic_data,
	}).done(function(data) {

		if(data.status == 200 && data.redirect){
			window.location = data.redirect;
		}
	});
}

function dateIndo(mysqlDateStr, showDay, hideYear, shortMonth){
	var mysqlDateStr = mysqlDateStr + "";
	var arr = mysqlDateStr.split(/[- :]/);
 	var date1 = new Date(arr[0], arr[1]-1, arr[2]);

	date = date1.getDate();
	year = date1.getFullYear();
	month = date1.getMonth();
	day = date1.getDay();

	var hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
	var hari = hari[day];

	var bulan = [ "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember" ];
	var bulan = bulan[month];

	var bulan_short = [ "Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des" ];
	var bulan_short = bulan_short[month];

	if(showDay)
		var str = hari + ", " + date + " " + bulan + " " + year;
	else if(hideYear)
		var str = date + " " + bulan;
	else if(shortMonth)
		var str = date + " " + bulan_short + " " + year;
	else
		var str = date + " " + bulan + " " + year;

	return str;
}

function updatePaxSummary(){

	var qty_adult = parseInt(fi_basic_data.adult);
	var qty_child = parseInt(fi_basic_data.child);
	var qty_infant = parseInt(fi_basic_data.infant);

	var strArr = [];

	if(qty_adult > 0) { strArr.push(qty_adult+" Dewasa") }
	if(qty_child > 0) { strArr.push(qty_child+" Anak-anak") }
	if(qty_infant > 0) { strArr.push(qty_infant+" Bayi") }

	strArr = strArr.filter(Boolean);

	var return_str = strArr.join(", ");

	return return_str;
}

function showCommision(){

	$.ajax({
		method: "GET",
		async: false,
		url: ajax_status_ticket,
	}).done(function( data ) {
		if(data.data) {
			fi_unit_commision = data.data;
		}
	});

	var multiplier = 1;
	if(fi_basic_data.trip === "return"){
		var multiplier = 2;
	}

	var qty_adult = parseInt(fi_basic_data.adult);
	var qty_child = parseInt(fi_basic_data.child);
	var total_adult_child = parseInt(qty_adult) + parseInt(qty_child);

	var unit_commision = parseInt(fi_unit_commision);
	var total_commision = multiplier * total_adult_child * unit_commision;

	var commisionRp = numRp(total_commision);

	$("#fi_total_commision_human").text(commisionRp);
}

function filterResult(){

	// trip_type[ transit: t/f, direct: t/f], arrival_time_enums[], airline_codes[]
	$("#flight_results").show();
	$("#fi_filter_result_nil").addClass("hidden");

	var count = 0;
	var hide = 0;
	var show = 0;
	// default condition
	$(".flight_result_one").each(function() {
		$(this).show();
		count += 1;
	});

	var hidden_index = [];

	$(".flight_result_one").each(function() {
		var data = $(this).data("data");
		var hour = data.hour;
		var minute = data.minute;
		var index = data.index;

		if(filterParams.trip_type){
			if(!(filterParams.trip_type.transit === true && filterParams.trip_type.direct === true)){
				if(filterParams.trip_type.transit === true){
					if(!data.transit){
						$(this).hide();
						hidden_index.push(index);
					}
				}

				if(filterParams.trip_type.direct === true){
					if(data.transit){
						$(this).hide();
						hidden_index.push(index);
					}
				}
			}
		}

		if(filterParams.airline_codes.length > 0){
			var found_in_array = inArray(data.airline_code, filterParams.airline_codes);

			if(!found_in_array){
				$(this).hide();
				hidden_index.push(index);
			}
		}

		if(filterParams.arrival_time_enums.length > 0){
			if(parseAllowedHour(filterParams.arrival_time_enums, hour, minute) === false ){
				$(this).hide();
				hidden_index.push(index);
			}
		}
	});

	// count hide first
	var unique_hidden_index = [];
	$.each(hidden_index, function(i, el){
		if($.inArray(el, unique_hidden_index) === -1){
			unique_hidden_index.push(el);
		}
	});

	var hide = unique_hidden_index.length;

	show = count-hide;

	if(show <= 0){
		$("#flight_results").hide();
		$("#fi_filter_result_nil").removeClass("hidden");

		var oneway_date_text = dateIndo(fi_basic_data['date']);
		$("#fi_date_filter").text(oneway_date_text);

		var filterSummaryStr = filterSummary(filterParams);
		$("#fi_filter_summary").text(filterSummaryStr);
	}
}

function filterSummary(fsParams){

	var trip_type_strs = [];
	var airline_name_strs = fsParams.airline_codes;
	var departure_time_strs = [];
	var strArr = [];

	if(fsParams.trip_type.direct)
		trip_type_strs.push("Langsung");
	if(fsParams.trip_type.transit)
		trip_type_strs.push("Transit");
	if(inArray(1, fsParams.arrival_time_enums))
		departure_time_strs.push("Pagi");
	if(inArray(2, fsParams.arrival_time_enums))
		departure_time_strs.push("Siang");
	if(inArray(3, fsParams.arrival_time_enums))
		departure_time_strs.push("Sore");
	if(inArray(4, fsParams.arrival_time_enums))
		departure_time_strs.push("Malam");

	var airline_str = (airline_name_strs.length) ? "maskapai: " + airline_name_strs.join(", ") : "";
	var trip_str = (trip_type_strs.length) ? trip_type_strs.join(", ") : "";
	var deptime_str = (departure_time_strs.length) ? "Waktu penerbangan: " + departure_time_strs.join(", ") : "";

	if(airline_str)
		strArr.push(airline_str);
	if(trip_str)
		strArr.push(trip_str);
	if(deptime_str)
		strArr.push(deptime_str);

	var return_str = strArr.join(". ");
	return return_str;
}

function inArray(value, haystackArr){
	var index = $.inArray(value, haystackArr);

	if(index != -1)
		return true;
	else
		return false;
}

function parseAllowedHour(enumArrInt, hourTime, minuteTime){

	if(inArray(1, enumArrInt))
	{
		if(hourTime >= 4 && hourTime < 11)
			return true;
	}

	if(inArray(2, enumArrInt))
	{
		if(hourTime >= 11 && hourTime < 15)
			return true;
	}

	if(inArray(3, enumArrInt))
	{
		if(hourTime >= 15 && hourTime < 18)
			return true;
		if(hourTime === 18 && minuteTime < 30)
			return true;
	}

	if(inArray(4, enumArrInt))
	{
		if(hourTime === 18 && minuteTime >= 30)
			return true;
		else if(hourTime >= 19 || hourTime < 4)
			return true;
	}

	return false;
}

function sortResult() {
	// final_price, sort_duration, sort_departure, sort_arrival
	$(".flight_result_one").sort(sortAlgoritm).appendTo('#flight_results');
}

function sortAlgoritm(a, b) {
	var sort_key = sortParams.key;
	return ($(b).data('data')[sort_key]) < ($(a).data('data')[sort_key]) ? 1 : -1;
}

function diff_minutes(dt2, dt1) {
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

function convertMinute(minuteInt){
	var hours = Math.floor( minuteInt/60);
    var minutes = minuteInt % 60;

	var str = hours + " jam " + minutes + " menit";
	return str;
}

function generateList7Days(){

 	interval = 7;

	between = [];

	var start = fi_basic_data.date;

	var date1_str = fi_basic_data.date;
	var date1_arr = date1_str.split(/[- :]/);
	var ios_date = new Date(date1_arr[0], date1_arr[1]-1, date1_arr[2]);

	var start_time = ios_date.setDate(ios_date.getDate() - 3);
	var end_time = ios_date.setDate(ios_date.getDate() + 6);
	var start_obj = new Date(start_time);
	var end_obj = new Date(end_time);

	var currentDate = new Date(start_time);

	while (currentDate <= end_obj) {

		between.push( new Date(currentDate).yyyymmdd() );
		currentDate.setDate(currentDate.getDate() + 1);
	}

	$.each(between, function(key, value) {

		date1 = new Date ( value );
		day = date1.getDay();

		var hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
		var hari = hari[day];
		var tanggal = dateIndo(value); //dateIndo(mysqlDateStr, showDay, hideYear)
		var highlight = false;

		if(value === new Date().yyyymmdd()){
			hari = "Hari Ini";
		}
		if(value === fi_basic_data.date){
			highlight = true;
		}

		var date_one_line = {
			"hari": hari,
			"tanggal": tanggal,
			"sql_date": value,
			// enum - 1:price available, 2:cek harga, 3: validation tanggal berangkat
			"show_price_type": 1,
			"lowest_price" : 25,
			"clickable": true,
			"highlight": highlight
		}

		fi_change_date.push(date_one_line);
	});

	getCalendarFare(start, end_obj.yyyymmdd());
}

function clickChangeDate(elem){
	var data = $(elem).data("data");
	var sql_date = data.sql_date;

	fi_basic_data.date = sql_date;

	if(data.show_price_type === 3 || data.show_price_type === 4){
		return;
	}

	var full_url = search_flight_baseurl + httpBuildQuery(fi_basic_data);
	window.location = full_url;
}

function generateListGantiTanggal(){

	$.each(fi_change_date, function(key, value) {

		var highlight_class = (value.highlight) ? "kudo--text-positive-color" : "";

		var $li = $("<div />");

		var $li_row = $("<div />").addClass("mui-row sembunyikan-detail nav-bottom-ganti-tanggal " + highlight_class);
		var $li_row_left = $("<div />").addClass("mui-col-xs-7");
		$li_row.data("data", value).attr("onclick", "clickChangeDate(this)").attr("tabindex", 1);
		var $li_row_right = $("<div />").addClass("mui-col-xs-5");

		var $li_row_left_content = '<span class="ganti-tanggal-small-caption">' + value.hari + '</span><br />\
							<span class="ganti-tanggal-date">'+ value.tanggal + '</span>';

		if(value.show_price_type === 1){
			$li_row_right.addClass("mui--text-right");
			var $li_row_right_content = '<span class="ganti-tanggal-small-caption">Mulai dari</span><br />\
							<span class="ganti-tanggal-price">' + numRp(value.lowest_price) + '<span class="flight-caption-airport"> /org</span></span>\
						</div>';
		}
		else if(value.show_price_type === 2){
			$li_row_right.addClass("mui--text-right");
			var $li_row_right_content = '<span class="ganti-tanggal-price mui-col-xs-10 flight-date-return to-right padding-reset">\
											Cek Harga</span>';
		}
		else if(value.show_price_type === 3){
			$li_row_right.addClass("mui--text-left");
			var $li_row_right_content = '<span class="ganti-tanggal-small-caption mui-col-xs-10 mui-col-md-10 flight-divider to-right padding-reset">\
											Tanggal berangkat harus lebih awal dari tanggal kembali\
											</span>';
		}
		else if(value.show_price_type === 4){
			$li_row_right.addClass("mui--text-left");
			var $li_row_right_content = '<span class="ganti-tanggal-small-caption mui-col-xs-10 mui-col-md-10 flight-divider to-right padding-reset">\
											Tanggal sudah tidak tersedia\
											</span>';
		}

		var $li_divider = $("<div />").addClass("mui-divider");

		// bottom up
		$li_row_left.append($li_row_left_content);
		$li_row_right.append($li_row_right_content);

		$li_row.append($li_row_left);
		$li_row.append($li_row_right);

		$li.append($li_row);
		$li.append($li_divider);

		$("#flight_change_date").append($li);

	});
}

function getCalendarFare(startDate, endDate) {
	var calendar_params = {
		'from': fi_basic_data.from,
		'to': fi_basic_data.to,
		'start_date': startDate,
		'end_date': endDate
	};
	$.ajax({
		url: ajax_lowest_price,
		type: "get",
		data: calendar_params
	}).done(function(data) {
		if(data.data_calendar_price){
			calendar_oneway_lowest_price = data.data_calendar_price;

			var keys_calendar_price = $.map( calendar_oneway_lowest_price, function( value, key ) {
				return key;
			});

			for(var key in fi_change_date) {
				var sql_date = fi_change_date[key]["sql_date"];

				if(inArray(sql_date, keys_calendar_price)) {
					fi_change_date[key]["show_price_type"] = 1;
					fi_change_date[key]["lowest_price"] = calendar_oneway_lowest_price[sql_date];
				}
				else {
					fi_change_date[key]["show_price_type"] = 2;
				}

				var display_date_obj = new Date(sql_date);
				var return_date_obj = new Date(fi_basic_data.return_date);
				
				var today_str = new Date().yyyymmdd();
				var today_date_obj = new Date(today_str);

				if(display_date_obj > return_date_obj){
					fi_change_date[key]["show_price_type"] = 3;
				}
				else if(display_date_obj < today_date_obj){
					fi_change_date[key]["show_price_type"] = 4;					
				}
			}
		}
	}).complete(function(data){
		generateListGantiTanggal();
	});
}

//ticket detail langsung
$('#ticket-detail-langsung').click(function() {
	toggleByClass("slide-div-bottom-ticket-detail-langsung");
});

$('#back-ticket-detail-langsung').click(function() {
	toggleByClass("slide-div-bottom-ticket-detail-langsung");

	if(fi_default_view === "CONFIRM"){
		switchView("CONFIRM");
	}
});

//ticket detail transit
$('#ticket-detail-transit').click(function() {
	toggleByClass("slide-div-bottom-ticket-detail-transit");
});

$('#back-ticket-detail-transit').click(function() {
	toggleByClass("slide-div-bottom-ticket-detail-transit");
});

//syarat dan ketentuan refund
function showSk(airline_code)
{
	toggleByClass("slide-div-bottom-sk-refund");
	ajaxSk(airline_code);
}

$('.back-sk-refund').click(function() {
	toggleByClass("slide-div-bottom-sk-refund");
});

function ajaxSk(airline_code){
	var url = ajax_airline_coc + "/" + airline_code;

	$.ajax({
		url: url
	}).done(function(data) {

		if(data.data){
			applyAjaxSk(data.data);
		}
		else{
			// toggle hide
		}
	});
}

function applyAjaxSk(data){
	for(var i in data){
		var id = ".coc_" + i;
		var html = data[i];
		$(id).html(html);
	}

	$(".coc_airline_name_1").html(data.airline_name);
	$(".coc_url_1").attr("href", data.url);
	$(".coc_url_1").html(data.url);
	$(".coc_icon_1").attr("src", data.icon);
}

function dateEqual(std, sta){
	var std_str = std + "";
	var std_arr = std_str.split(/[- :]/);
	var ios_std = new Date(std_arr[0], std_arr[1]-1, std_arr[2]);

	var sta_str = sta + "";
	var sta_arr = sta_str.split(/[- :]/);
	var ios_sta = new Date(sta_arr[0], sta_arr[1]-1, sta_arr[2]);

	if(ios_std.getTime() == ios_sta.getTime()){
		return true;
	}
	else{
		return false;
	}
}

// Move Progress Bar
function moveProgressBar(percent) {
	var getPercent = ($('.progress-wrap') / 100);
	if (percent)
		getPercent= percent/100;
	var getProgressWrapWidth = $('.progress-wrap').width();
	var progressTotal = getPercent * getProgressWrapWidth;
	var animationLength = 2500;

	// on page load, animate percentage bar to data percentage length
	// .stop() used to prevent animation queueing
	$('.progress-bar').stop();
}