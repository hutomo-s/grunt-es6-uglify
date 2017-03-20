var fi_ret_result_index = 0;
var retSortParams = {};
var retFilterAirlines = {};
var retFilterParams = {};
retFilterParams.trip_type = {};
retFilterParams.airline_codes = [];
retFilterParams.arrival_time_enums = [];
var lastRetFilterParams = JSON.parse(JSON.stringify(retFilterParams));

fi_navbar_return_data();

function generateFlightReturnSchedules(dataList, airlineName){
	for(i = 0; i < dataList.length; i++){
		generateOneFlightReturnSchedule(dataList[i], airlineName);
	}
}

function generateOneFlightReturnSchedule(dataOneLine, airlineName){

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

	data.index = fi_ret_result_index;
	fi_ret_result_index += 1;

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

	data.airline_img_src = airline_img_src;
	data.airline_name = airline_name;
	data.trip_type = trip_type;
	data.departure_h_i = departure_h_i;
	data.departure_timezone = departure_timezone;
	data.arrival_h_i = arrival_h_i;
	data.arrival_timezone = arrival_timezone;
	data.from = from;
	data.to = to;
	data.duration = duration;
	data.total_final_price = dataOneLine.total_final_price;

	if(!retFilterAirlines[flight_designator.CarrierName])
		retFilterAirlines[flight_designator.CarrierName] = flight_designator.CarrierName;

	var $li = $('<div />').addClass("mui-panel flight-mrgn-bot ret_flight_result_one flight-border-radius-4 flight-pd-btm-10 flight-pd-left-8 flight-pd-right-8").data("data", data);

	var $li_1 = $('<a />').addClass("txt-decoration-none").attr("href", "#").attr("onclick", "clickReturn(this)").data("data", data).data("dataOneLine", dataOneLine);

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
	var a_elem = $('<a />').addClass('flight-bottom-nav').attr('href', '#').attr('onclick', "generateReturnFlightDetail(this)").data('data',dataOneLine);
	var a_select_detail = '<div class="mui-col-xs-12 mui-col-md-12 mui--text-body1 padding-reset">';
	var a_select_detail = a_select_detail + '<div class="mui-col-xs-12 mui-col-md-12 flight-margin-top mui--text-left padding-reset kudo--text-grey-color font-regular">LIHAT DETAIL TIKET</div></div>';
	a_elem.append(a_select_detail);

	$li_2.append(divider);
	$li_2.append(a_elem);

	$li.append($li_1);
	$li.append($li_2);

	$("#flight_return_results").append($li);
}

function fi_navbar_return_data() {

	var str_navbar_h1 = arrival_city + " - " + departure_city;
	$("#fi_return_h1").text(str_navbar_h1);

	if(fi_basic_data.return_date){
		var str_return_date_pax = dateIndo(fi_basic_data['return_date'], true) + " | " + updatePaxSummary();
		$("#fi_return_h2").text(str_return_date_pax);

		var str_navbar_changedate_ret = dateIndo(fi_basic_data['return_date'], true) + " | " + fi_basic_data.to + " - " + fi_basic_data.from;
		$("#fi_h_changedate_ret").text(str_navbar_changedate_ret);
	}
}

function toggleByClass(classNameStr, duration) {

	if(duration === 0)
		var d = duration;
	else if(duration)
		var d = duration;
	else
		var d = 400;

	$('.' + classNameStr).animate({
		height: 'toggle'
		}, d, function() {
	});
}

function generateReturnFlightDetail(elem){

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

	div_html.df_image_airline = data.image_airline;
	var img_elem = $("<img />").attr("src", div_html.df_image_airline).attr("style", "width:50px;");
	$("#ret_df_image_airline").html(img_elem);

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

	id_html.df_carrier_name = flight_designator.CarrierName;
	id_html.df_departure_time = toHourMinutes(data.std);
	id_html.df_departure_timezone = origin.Timezone_name;

	id_html.df_arrival_time = toHourMinutes(data.sta);
	id_html.df_arrival_timezone = destination.Timezone_name;

	id_html.df_depart_airport_code = data.depart_airport_code;
	id_html.df_arrival_airport_code = data.arrival_airport_code;

	id_html.df_facilities_summary = facilities_wording;

	// this will use class as identifier
	class_html.df_total_duration = data.duration;
	class_html.df_flight_code = flight_designator.CarrierName + " "+ flight_designator.CarrierCode + "-" + flight_designator.FlightNumber;

	id_html.df_date_departure = dateIndo(data.sta, false, true);
	id_html.df_from_time = origin.City + " (" + data.depart_airport_code + "), " + toHourMinutes(data.std);
	id_html.df_depart_airport_name = data.depart_airport_name;
	id_html.df_duration = duration_wording;

	id_html.df_date_arrival = dateIndo(data.segments[0].Std, false, true);
	id_html.df_to_time = data.segments[0].Destination.City + " (" + destination.Code + "), " + toHourMinutes(data.segments[0].Sta);
	id_html.df_arrival_airport_name = destination.Name;

	$(".ret_arrival_plusone").addClass("hidden");
	if(!data.date_equal_std_sta){
		$(".ret_arrival_plusone").removeClass("hidden");
	}

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

		$(".ret-transit-toggle").removeClass("hidden");
	}
	else
	{
		$(".ret-transit-toggle").addClass("hidden");
	}

	for (var id_selector in id_html){
		$("#ret_"+id_selector).html(id_html[id_selector]);
	}

	for (var id_selector in class_html){
		$(".ret_"+id_selector).html(class_html[id_selector]);
	}

	var animation = 400;

	if(fi_default_view === "CONFIRM"){
		switchView("RETURN");
		fi_default_view = "CONFIRM";
		animation = 0;
	}

	toggleByClass("detail-ticket-return", animation);
}

function generateReturnFilterList(){

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
							<input type="checkbox" class="kf_ret_filter" onclick="clickRetFilterTripType(this)" data-value="'+ key +'" />\
							<div class="control__indicator"></div>\
						</label>';
		$li_2.html($li_2_html);
		$li.append($li_2);

		$("#ret_filter_triptype_list").append($li);
	});

	$.each(filter_departure_times, function(key, value) {

		var $li = $("<div />").addClass("mui-col-xs-12 flight-divider");
		var $li_1 = $("<div />").addClass("mui-col-xs-10 flight-pd-left-0");
		$li_1.text(value);
		$li.append($li_1);

		var $li_2 = $("<div />").addClass("mui-col-xs-2 mui--text-center");
		var $li_2_html = '<label class="control control--checkbox">\
							<input type="checkbox" class="kf_ret_filter" onclick="clickRetFilterDepartureTime(this)" data-value="'+ key +'" />\
							<div class="control__indicator"></div>\
						</label>';
		$li_2.html($li_2_html);
		$li.append($li_2);

		$("#ret_filter_deptime_list").append($li);
	});

	$.each(retFilterAirlines, function(key, value) {

		var $li = $("<div />").addClass("mui-col-xs-12 flight-divider");
		var $li_1 = $("<div />").addClass("mui-col-xs-10 flight-pd-left-0");
		$li_1.text(value);
		$li.append($li_1);

		var $li_2 = $("<div />").addClass("mui-col-xs-2 mui--text-center");
		var $li_2_html = '<label class="control control--checkbox">\
							<input type="checkbox" class="kf_ret_filter" onclick="clickRetFilterAirline(this)" data-value="'+ key +'" />\
							<div class="control__indicator"></div>\
						</label>';
		$li_2.html($li_2_html);
		$li.append($li_2);

		$("#ret_filter_airline_list").append($li);
	});
}

function clickRetFilterAirline(elem){
	var checked = ($(elem).is(":checked")) ? true : false;
	var airline_code = $(elem).attr("data-value");

	if(checked){
		if(!inArray(airline_code, retFilterParams.airline_codes))
			retFilterParams.airline_codes.push(airline_code);
	}
	else{
		if(inArray(airline_code, retFilterParams.airline_codes)){
			var index = $.inArray(airline_code, retFilterParams.airline_codes);
			retFilterParams.airline_codes.splice(index, 1);
		}
	}
}

function clickRetFilterTripType(elem){
	var checked = ($(elem).is(":checked")) ? true : false;
	var value = $(elem).attr("data-value");

	if(value === "DIRECT"){
		if(checked)
			retFilterParams.trip_type.direct = true;
		else
			retFilterParams.trip_type.direct = false;
	}
	else if(value === "TRANSIT"){
		if(checked)
			retFilterParams.trip_type.transit = true;
		else
			retFilterParams.trip_type.transit = false;
	}
}

function clickRetFilterDepartureTime(elem){
	var checked = ($(elem).is(":checked")) ? true : false;
	var dep_time_enum = parseInt( $(elem).attr("data-value") );

	if(checked){
		if(!inArray(dep_time_enum, retFilterParams.arrival_time_enums))
			retFilterParams.arrival_time_enums.push(dep_time_enum);
	}
	else{
		if(inArray(dep_time_enum, retFilterParams.arrival_time_enums)){
			var index = $.inArray(dep_time_enum, retFilterParams.arrival_time_enums);
			retFilterParams.arrival_time_enums.splice(index, 1);
		}
	}
}

function retFilterResult(){

	// trip_type[ transit: t/f, direct: t/f], arrival_time_enums[], airline_codes[]
	$("#flight_return_results").show();
	$("#fi_filter_result_nil_ret").addClass("hidden");

	var count = 0;
	var hide = 0;
	var show = 0;
	// default condition
	$(".ret_flight_result_one").each(function() {
		$(this).show();
		count += 1;
	});

	hideFlightsBelowSixHours();
	var hidden_index = [];

	$(".ret_flight_result_one").each(function() {
		var data = $(this).data("data");
		var hour = data.hour;
		var minute = data.minute;
		var index = data.index;

		if(retFilterParams.trip_type){
			if(!(retFilterParams.trip_type.transit === true && retFilterParams.trip_type.direct === true)){
				if(retFilterParams.trip_type.transit === true){
					if(!data.transit){
						$(this).hide();
						hidden_index.push(index);
					}
				}

				if(retFilterParams.trip_type.direct === true){
					if(data.transit){
						$(this).hide();
						hidden_index.push(index);
					}
				}
			}
		}

		if(retFilterParams.airline_codes.length > 0){
			var found_in_array = inArray(data.airline_code, retFilterParams.airline_codes);
			if(!found_in_array){
				$(this).hide();
				hidden_index.push(index);
			}
		}

		if(retFilterParams.arrival_time_enums.length > 0){
			if(parseAllowedHour(retFilterParams.arrival_time_enums, hour, minute) === false ){
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
		$("#flight_return_results").hide();
		$("#fi_filter_result_nil_ret").removeClass("hidden");

		var return_date_text = dateIndo(fi_basic_data['return_date']);
		$("#fi_date_filter_ret").text(return_date_text);

		var filterSummaryStr = filterSummary(retFilterParams);
		$("#fi_filter_summary_ret").text(filterSummaryStr);
	}

}

function applyRetFilter(){

	var lastRetFilter = retFilterParams;
	lastRetFilterParams = JSON.parse(JSON.stringify(lastRetFilter));

	retFilterResult();
	toggleByClass("slide-div-bottom-flight-filter-ret");
}

function resetRetFilter(){
	retFilterParams.trip_type = {};
	retFilterParams.airline_codes = [];
	retFilterParams.arrival_time_enums = [];

	$('.kf_ret_filter').attr('checked', false);
}

function generateList7DaysReturn(){

	// http://jsfiddle.net/TMsXM/3/
	interval = 7;

	between = [];

	// reset data
	fi_change_date_ret = [];

	var start = fi_basic_data.return_date;

	var date1_str = fi_basic_data.return_date;
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
		if(value === fi_basic_data.return_date){
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

		fi_change_date_ret.push(date_one_line);
	});

	getCalendarFareReturn(start, end_obj.yyyymmdd());
}

function generateListGantiTanggalReturn(){

	$.each(fi_change_date_ret, function(key, value) {

		var highlight_class = (value.highlight) ? "kudo--text-positive-color" : "";

		var $li = $("<div />");

		var $li_row = $("<div />").addClass("mui-row sembunyikan-detail nav-bottom-ganti-tanggal " + highlight_class);
		var $li_row_left = $("<div />").addClass("mui-col-xs-7");
		$li_row.data("data", value).attr("onclick", "clickChangeDateReturn(this)").attr("tabindex", 1);
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
											Tanggal pulang tidak boleh mendahului tanggal berangkat\
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

		$("#flight_change_date_ret").append($li);
	});
}

function generateSortOptionsReturn(){

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
							<input name="radio" type="radio" onclick="clickSortReturnParams(this)" data-value="'+ key +'">\
							<div class="control__indicator"></div>\
						</label>';
		$li_1.html($label);
		$li.append($li_1);

		var $li_2 = $("<div />").addClass("mui-col-xs-11");
		$li_2.text(value);
		$li.append($li_2);

		$("#sort_criteria_list_ret").append($li);
	});

}

function clickSortReturnParams(elem){
	var sort_by = $(elem).attr("data-value");
	retSortParams.key = sort_by;

	sortResultReturn();
	toggleByClass("slide-div-bottom-flight-urutkan-ret");
}

function sortResultReturn() {
	// final_price, sort_duration, sort_departure, sort_arrival
	$(".ret_flight_result_one").sort(sortAlgoritmReturn).appendTo('#flight_return_results');
}

function sortAlgoritmReturn(a, b) {
	var sort_key = retSortParams.key;
	return ($(b).data('data')[sort_key]) < ($(a).data('data')[sort_key]) ? 1 : -1;
}

function clickChangeDateReturn(elem) {
	var data = $(elem).data("data");
	var sql_date = data.sql_date;

	fi_basic_data.return_date = sql_date;

	if(data.show_price_type !== 3){
		callbackAirlineChangeDateReturn();
	}
}

function callbackAirlineChangeDateReturn(){

	delete fi_odata.ret_data;
	delete fi_odata.ret_dataOneLine;

	var PostData = {
		fi_basic_data: fi_basic_data,
		odata: JSON.stringify(fi_odata)
	};

	$.ajax({
		url: redirect_to_search,
		method: "POST",
		data: PostData,
	}).done(function(data) {
		if(data.status == 200 && data.redirect){
			window.location = data.redirect;
		}
	});
}

function getCalendarFareReturn(startDate, endDate) {
	var calendar_params = {
		'from': fi_basic_data.to,
		'to': fi_basic_data.from,
		'start_date': startDate,
		'end_date': endDate
	};
	$.ajax({
		url: ajax_lowest_price,
		type: "get",
		data: calendar_params
	}).done(function(data) {
		if(data.data_calendar_price){
			calendar_return_lowest_price = data.data_calendar_price;

			var keys_calendar_price = $.map( calendar_return_lowest_price, function( value, key ) {
				return key;
			});

			for(var key in fi_change_date_ret) {
				var sql_date = fi_change_date_ret[key]["sql_date"];

				if(inArray(sql_date, keys_calendar_price)) {
					fi_change_date_ret[key]["show_price_type"] = 1;
					fi_change_date_ret[key]["lowest_price"] = calendar_return_lowest_price[sql_date];
				}
				else {
					fi_change_date_ret[key]["show_price_type"] = 2;
				}

				var current_date_obj = new Date(sql_date);
				var oneway_date_obj = new Date(fi_basic_data.date);

				if(current_date_obj < oneway_date_obj){
					fi_change_date_ret[key]["show_price_type"] = 3;
				}
			}
		}
	}).complete(function(data){
		generateListGantiTanggalReturn();
	});
}

function clickReturn(elem, autoClick){

	if(autoClick){
		fi_confdata_return = back_odata.ret_data;
		var dataOneLine = back_odata.ret_dataOneLine;
	}
	else{
		fi_confdata_return = $(elem).data("data");
		var dataOneLine = $(elem).data("dataOneLine");
	}

	fi_odata.ret_data = fi_confdata_return;
	fi_odata.ret_dataOneLine = dataOneLine;

	var segments = dataOneLine.segments;
	fi_segments_return = [];
	fi_segments_return = fi_segments_return.concat(segments);

	var require_dob = dataOneLine.require_dob;
	fi_require_dob = fi_require_dob.concat(require_dob);

	$("#show_ticket_detail_conf_ret").data("data", dataOneLine);

	var date_str = fi_confdata_return.date_str;
	var date_human = dateIndo(date_str, true);

	fi_confdata_return.date_human = date_human;
	fi_confdata_return.final_price_human = numRp(fi_confdata_return.final_price);
	fi_confdata_return.total_final_price_human = numRp(fi_confdata_return.total_final_price);
	fi_confdata_return.ori_price_human = numRp(dataOneLine.ori_price);

	$("#ret_ori_price_span").removeClass("hidden");
	if(parseInt(dataOneLine.ori_price) === parseInt(fi_confdata_return.final_price)){
		$("#ret_ori_price_span").addClass("hidden");
	}

	$(".ret_arrival_plusone").addClass("hidden");
	if(!fi_confdata_return.date_equal_std_sta){
		$(".ret_arrival_plusone").removeClass("hidden");
	}

	ticketConfirmation();
	switchView("CONFIRM");
}

$("#ret-back-flight-filter").click(function(){
	var lastRetFilter = lastRetFilterParams;
	retFilterParams = JSON.parse(JSON.stringify(lastRetFilter));
	toggleByClass("slide-div-bottom-flight-filter-ret");		
});

$("#ret-flight-filter").click(function(){

	var arrival_time = lastRetFilterParams.arrival_time_enums;
	var airlines = lastRetFilterParams.airline_codes;

	if(lastRetFilterParams.trip_type.direct){
		autoCheckRetFilter("DIRECT");
	}
	if(lastRetFilterParams.trip_type.transit){
		autoCheckRetFilter("TRANSIT");
	}
	for(i=0; i<arrival_time.length; i++){
		var key = arrival_time[i];
		autoCheckRetFilter(key);
	}
	for(i=0; i<airlines.length; i++){
		var key = airlines[i];
		autoCheckRetFilter(key);
	}

	toggleByClass("slide-div-bottom-flight-filter-ret");
});

function autoCheckRetFilter(key){
	$(".kf_ret_filter[data-value='"+ key +"']").prop('checked', true);
}

$("#ret-flight-urutkan, #back-flight-urutkan-ret").click(function(){
	toggleByClass("slide-div-bottom-flight-urutkan-ret");
});

$("#ret-flight-ganti-tanggal, #back-flight-ganti-tanggal-ret").click(function(){
	toggleByClass("slide-div-bottom-flight-ganti-tanggal-ret");
});

$("#back-detail-ticket-return").click(function(){
	if(fi_default_view === "CONFIRM"){
		switchView("CONFIRM");
	}
	toggleByClass("detail-ticket-return");
});

$("#back_to_oneway").click(function(){
	switchView("ONEWAY");
});

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
	$('.progress-bar').stop().animate({
		left: progressTotal
	}, animationLength);
}