var fi_default_data = {};
var calendar_oneway_lowest_price = {};
var calendar_return_lowest_price = {};
var seen_on_departure = {};
var seen_on_arrival = {};
var search_history_list = {};
var fi_current_pax_state = {};
var fi_current_calendar_state = {};
var clearFilterText = false;
var temp_return_date = "";

// initial condition
fi_default_data.state_return_trip = 0;
fi_default_data.departure_city = (fi_basic_data.from) ? fi_basic_data.departure_city : "Jakarta";
fi_default_data.arrival_city = (fi_basic_data.to) ? fi_basic_data.arrival_city : "Denpasar Bali";

fi_default_data.city_from = (fi_basic_data.from) ? fi_basic_data.from : "JKT";
fi_default_data.city_to = (fi_basic_data.to) ? fi_basic_data.to : "DPS";

Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString();
	var dd = this.getDate().toString();
	return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};

var todaydateobj = new Date();
var plusonedateobj = todaydateobj.setDate(todaydateobj.getDate() + 1);

fi_default_data.date = (fi_basic_data.date) ? fi_basic_data.date : new Date(plusonedateobj).yyyymmdd();

if(fi_basic_data.return_date)
{
	fi_default_data.return_date = fi_basic_data.return_date;
}

$( "input[name='city_from']").val(fi_default_data.city_from);
$( "input[name='city_to']").val(fi_default_data.city_to);
$( "input[name='date']").val(fi_default_data.date);

if(fi_basic_data.state_return_trip){
	$("#flight-return-date").trigger("click");
	toggleReturnTripCalendar();
}

function dateObjectFromSql(sqlDate){
	var dateParts = sqlDate.split("-");
	var current_date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
	return current_date;
}

function countEndDate(startDateMysql){
	var x_months = 2;

	var dateParts = startDateMysql.split("-");
	var current_date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
	current_date.setMonth(current_date.getMonth() + x_months);
	var upcoming_month = current_date.yyyymmdd();
	return upcoming_month;
}

function updateOneWayCalendarFare(){
	var calendar_params = {
		'from': $( "input[name='city_from']").val(),
		'to': $( "input[name='city_to']").val(),
		'start_date': $( "input[name='date']").val(),
		'end_date': countEndDate($( "input[name='date']").val())
	};
	$.ajax({
		url: ajax_lowest_price,
		type: "get",
		data: calendar_params
	}).done(function(data) {
		if(data.data_calendar_price){
			calendar_oneway_lowest_price = data.data_calendar_price;
			updateDatePickerCells("ONEWAY");
		}
	});
}

function updateReturnCalendarFare(){
	var calendar_params = {
		'from': $( "input[name='city_to']").val(),
		'to': $( "input[name='city_from']").val(),
		'start_date': $( "input[name='date']").val(),
		'end_date': countEndDate($( "input[name='date']").val())
	};
	$.ajax({
		url: ajax_lowest_price,
		type: "get",
		data: calendar_params
	}).done(function(data) {
		if(data.data_calendar_price){
			calendar_return_lowest_price = data.data_calendar_price;
			updateDatePickerCells("RETURN");
		}
	});
}
// on runtime/initial
updateCalendarFare();

function updateCalendarFare(strCustom){
	// will run the function if RETURNONLY option == false
	if(strCustom != "RETURNONLY"){
		// if one way, just this function
		updateOneWayCalendarFare();
	}
	// if two way, the function will be
	if(fi_default_data.state_return_trip){
		updateReturnCalendarFare();
	}
}

function getSearchHistory(){
	$.ajax({
		url: ajax_search_history
	}).done(function(data) {
		if(data.history)
			search_history_list = data.history.history;
		else
			hidePencarianTerakhir();
	});
}

function hidePencarianTerakhir(){

	if(search_history_list.length === undefined || search_history_list.length === 0 ){
		$("#arrival_airport_history").hide();
		$("#departure_airport_history").hide();
	}
}

function validateDepArr(dep_code, arr_code){
	if (dep_code === arr_code){
		var params = {};
		params.title = "Perhatian";
		params.message = "Kota tujuan dan asal tidak boleh sama.";
		params.hide_cancel= true;
		params.small_modal = true;
		params.heightNone_mode = true;
		activateModal(params);
		return true;
	}
	else{
		return false;
	}
}

function clickDepartureReact(code, city){

	var old_code = $( "input[name='city_from']").val();
	var code = code;
	var city = city;

	var arrival_airport_code = $( "input[name='city_to']").val();
	if( validateDepArr(code, arrival_airport_code) )
		return;

	$("#city_from").text(city  + " (" + code + ")" );
	$("input[name='city_from']").val(code);

	toggleByClass("slide-div-bottom-kota-asal");

	fi_default_data.departure_city = city;
	fi_default_data.city_from = code;

	if(old_code != code){
		updateCalendarFare();
	}
}

function clickArrivalReact(code, city){

	var old_code = $( "input[name='city_to']").val();
	var code = code;
	var city = city;

	var departure_airport_code = $( "input[name='city_from']").val();
	if( validateDepArr(code, departure_airport_code) )
		return;

	$("#city_to").text(city + " (" + code + ")" );
	$("input[name='city_to']").val(code);

	toggleByClass("slide-div-bottom-kota-tujuan");

	fi_default_data.arrival_city = city;
	fi_default_data.city_to = code;

	if(old_code != code){
		updateCalendarFare();
	}
}

function showCommision(){

	var qty_adult = fi_current_pax_state.count_adult;
	var qty_child = fi_current_pax_state.count_child;
	var total_adult_child = parseInt(qty_adult) + parseInt(qty_child);

	var multiplier = 1;
	if(fi_default_data.state_return_trip){
		var multiplier = 2;
	}

	var unit_commision = parseInt(fi_unit_commision);
	var total_commision = total_adult_child * unit_commision;
	var calculated_total_commision = multiplier * total_commision;

	var commisionRp = numRp(calculated_total_commision);

	if(total_adult_child === 1){
		var commision_message = commisionRp;
	}
	else if(total_adult_child > 1){
		var commision_message = commisionRp;
	}

	$("#div_commision_message").removeClass("hidden");
	$("#commision_message").text(commision_message);
}

$("#searchFlightBtn").click(function(){
	searchTicket();
});

function searchTicket(){
	var params = {
		'from': $( "input[name='city_from']").val(),
		'to': $( "input[name='city_to']").val(),
		'date': $( "input[name='date']").val(),
		'return_date': '',
		'adult': $( "input[name='count_adult']").val(),
		'child': $( "input[name='count_child']").val(),
		'infant': $( "input[name='count_infant']").val(),
		'trip': ''
	};

	var return_trip = fi_default_data.state_return_trip;
	var return_date = (fi_default_data.return_date) ? fi_default_data.return_date : temp_return_date;

	params.return_date = return_trip ? return_date : "";
	params.trip = return_trip ? "return" : "oneway";

	// post history and redirect
	var full_url = search_flight_baseurl + httpBuildQuery(params);
	postHistoryCookies(full_url);
}

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

// here to put csrf
function postHistoryCookies(full_url_redirect)
{
	var param = {
		'city_from' : fi_default_data.city_from,
		'departure_city' : fi_default_data.departure_city,
		'city_to' : fi_default_data.city_to,
		'arrival_city' : fi_default_data.arrival_city
	};

	$.ajax({
		method: "POST",
		url: ajax_post_history,
		data: param
	}).done(function( data ) {
		window.location = full_url_redirect;
	});
}

$(document).ready(function(){

	$("#city_from").text( fi_default_data.departure_city + " (" + fi_default_data.city_from + ")");
	$("#city_to").text( fi_default_data.arrival_city + " (" + fi_default_data.city_to + ")");
});

function toggleReturnTripCalendar(){
	// toggle for return_trip state
	fi_default_data.state_return_trip = (fi_default_data.state_return_trip) ? 0 : 1;
	// update calendar fare if the state is going to be show (state = 1)
	if(fi_default_data.state_return_trip)
		updateCalendarFare("RETURNONLY");

	if(fi_default_data.state_return_trip)
		$("#flight_return").show();
	else
		$("#flight_return").hide();
}

//swap cities on flight index
$("#swap").click(function(){
	swapFromToInput();

});

function swapFromToInput()
{
	var original_city_from = $( "input[name='city_from']").val();
	var original_city_to = $( "input[name='city_to']").val();

	// display
	var $original_city_from_name = $("#city_from").html();
	var $original_city_to_name = $("#city_to").html();

	// swap input value
	$( "input[name='city_from']").val(original_city_to);
	$( "input[name='city_to']").val(original_city_from);
	$("#city_to").html($original_city_from_name);
	$("#city_from").html($original_city_to_name);

	// swap fi_default_data
	var current_departure_city = fi_default_data.departure_city;
	var current_arrival_city = fi_default_data.arrival_city;
	fi_default_data.city_from = original_city_to;
	fi_default_data.city_to = original_city_from;

	fi_default_data.departure_city = current_arrival_city;
	fi_default_data.arrival_city = current_departure_city;

	updateCalendarFare();
}

//calendar berangkat on index
$('#calendar-berangkat').click(function(e) {
	e.preventDefault();
	togglePilihTanggalPergi();
});
$('#back-calendar-berangkat').click(function(e) {
	revertCurrentCalendarState("ONEWAY");
	e.preventDefault();
	togglePilihTanggalPergi();
});
//calendar pulang on index
$('#calendar-pulang').click(function(e) {
	e.preventDefault();
	togglePilihTanggalPulang();
});
$('#back-calendar-pulang').click(function(e) {
	e.preventDefault();
	revertCurrentCalendarState("RETURN");
	togglePilihTanggalPulang();
});
$('#close_return_calendar').click(function(e) {
	e.preventDefault();
	setupCurrentCalendarState();
	togglePilihTanggalPulang();
});

//kota asal on index
$('#kota-asal').click(function(e) {
	e.preventDefault();
	clearFilterText = false;
	toggleByClass("slide-div-bottom-kota-asal");
});
$('#back-kota-asal').click(function(e) {
	e.preventDefault();
	toggleByClass("slide-div-bottom-kota-asal");
	});

//kota tujuan on index
$('#kota-tujuan').click(function(e) {
	e.preventDefault();
	clearFilterText = false;
	toggleByClass("slide-div-bottom-kota-tujuan");
});

$('#back-kota-tujuan').click(function(e) {
	e.preventDefault();
	toggleByClass("slide-div-bottom-kota-tujuan");
});

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

//toastr for jumlah penumpang
function showToastr(strMsg) {
	var x = document.getElementById("toastr-penumpang");
	x.innerHTML = strMsg;
	x.className = "show";
	setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

$(function() {
  $('.jumlah-penumpang').on('click', '.minus', function () {
    var $quantity = $(this).siblings('.total-penumpang'),
    	value     = +$quantity.val();

    var	min_qty = parseInt($quantity.attr("data-min"));
    if (value > min_qty) {
      $quantity.val(value - 1);
    }
    if(validatePaxQty()){
    	$quantity.val(value);
    }
  });

  $('.jumlah-penumpang').on('click', '.plus', function () {
    var $quantity = $(this).siblings('.total-penumpang');
    value = +$quantity.val();

    var	max_qty = parseInt($quantity.attr("data-max"));
    if (value < max_qty) {
      $quantity.val(value + 1);
    }
    if(validatePaxQty()){
    	$quantity.val(value);
    }
  });
});

function updatePaxSummary(){
	var qty_adult = $("input[name='count_adult']").val();
	var qty_child = $("input[name='count_child']").val();
	var qty_infant = $("input[name='count_infant']").val();

	var strArr = [];

	if(qty_adult > 0) { strArr.push(qty_adult+" Dewasa") }
	if(qty_child > 0) { strArr.push(qty_child+" Anak-anak") }
	if(qty_infant > 0) { strArr.push(qty_infant+" Bayi") }

	strArr = strArr.filter(Boolean);

	var return_str = strArr.join(", ");

	$("#summary_passenger").html(return_str);
}

// on minus penumpang dewasa
function validatePaxQty(){

	var qty_adult = parseInt($("input[name='count_adult']").val());
	var qty_infant = parseInt($("input[name='count_infant']").val());
	var max_qty_infant = 4;

	if(qty_infant > qty_adult)
	{
		$("input[name='count_infant']").val(qty_adult);
		showToastr("Jumlah Penumpang Bayi tidak boleh lebih banyak dari penumpang dewasa");
		return false;
	}

	if(qty_infant > max_qty_infant)
	{
		showToastr("Jumlah Penumpang Bayi maksimal 4 orang");
		// if validation returns true, the input value will be reverted
		return true;
	}

	var qty_total_max = 7;
	var qty_child = parseInt($("input[name='count_child']").val());
	var over_quota = (qty_adult + qty_child > 7) ? true : false;
	if(over_quota){
		showToastr("Jumlah penumpang dewasa dan anak maksimal 7 orang");
		// if validation returns true, the input value will be reverted
		return true;
	}
	else{
		return false;
	}
}

// on runtime
updatePaxSummary();
setupCurrentPaxState();
setupCurrentCalendarState();

function setupCurrentPaxState(){
	fi_current_pax_state.count_adult = $("input[name='count_adult']").val();
	fi_current_pax_state.count_child = $("input[name='count_child']").val();
	fi_current_pax_state.count_infant = $("input[name='count_infant']").val();
	updatePaxSummary();
	showCommision();
}

if(fi_basic_data.adult !== undefined) {
	fi_current_pax_state.count_adult = fi_basic_data.adult;
	fi_current_pax_state.count_child = fi_basic_data.child;
	fi_current_pax_state.count_infant = fi_basic_data.infant;
	revertCurrentPaxState();
}

function revertCurrentPaxState(){
	$("input[name='count_adult']").val(fi_current_pax_state.count_adult);
	$("input[name='count_child']").val(fi_current_pax_state.count_child);
	$("input[name='count_infant']").val(fi_current_pax_state.count_infant);
	updatePaxSummary();
	showCommision();
}

function setupCurrentCalendarState(){
	fi_current_calendar_state.date = fi_default_data.date;

	if(fi_default_data.return_date)
		fi_current_calendar_state.return_date = fi_default_data.return_date;
}

function revertCurrentCalendarState(strOption){

	// oneway = penerbangan pergi
	if(strOption === "ONEWAY")
	{
		fi_default_data.date = fi_current_calendar_state.date;
		$('#date_input_oneway').val(fi_default_data.date);
		$('#date_input_oneway_display').val(dateIndo(fi_default_data.date, true));
		$('#oneway_datepicker').datepicker('setDate', fi_default_data.date);
		updateDatePickerCells("ONEWAY");
	}

	// return = penerbangan pulang
	if(strOption === "RETURN" && fi_current_calendar_state.return_date)
	{
		var invalid = isReturnDateInvalid(fi_default_data.date, fi_current_calendar_state.return_date);

		if(invalid){
			var dateObj = dateObjectFromSql(fi_default_data.date);
			var retDateObj = dateObj.setDate(dateObj.getDate() + 2);

			fi_default_data.return_date = new Date(retDateObj).yyyymmdd();
		}
		else{
			fi_default_data.return_date = fi_current_calendar_state.return_date;
		}

		$("#date_input_return_display").val(dateIndo(fi_default_data.return_date, true));
		$('#date_input_return').val(fi_default_data.return_date);
		$('#return_datepicker').datepicker('setDate', fi_default_data.return_date);
		updateDatePickerCells("RETURN");
	}
	else if(strOption === "RETURN" && temp_return_date)
	{
		$("#date_input_return_display").val(dateIndo(temp_return_date, true));
		$('#return_datepicker').datepicker('setDate', temp_return_date);
		updateDatePickerCells("RETURN");
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

// toggle for pilih tanggal pergi
function togglePilihTanggalPergi(){
	toggleByClass("slide-div-bottom-calendar-berangkat");
}
// toggle for pilih tanggal pulang
function togglePilihTanggalPulang(){
	toggleByClass("slide-div-bottom-calendar-pulang");
}
// toggle for pilih penumpang new div
function togglePilihPenumpang(){
	toggleByClass("slide-div-bottom-penumpang");
}
$('#penumpang').click(function(e) {
	e.preventDefault();
	togglePilihPenumpang();
});
$("#fi_pax_update").click(function(){
	setupCurrentPaxState();
	togglePilihPenumpang();
});
$("#fi_pax_revert, #back-penumpang").click(function(e){
	e.preventDefault();
	revertCurrentPaxState();
	togglePilihPenumpang();
});


function dateIndo(mysqlDateStr, showDay){

	var mysqlDateStr = mysqlDateStr + "";
	var arr = mysqlDateStr.split(/[- :]/);
 	var date1 = new Date(arr[0], arr[1]-1, arr[2]);

	date = date1.getDate();
	year = date1.getFullYear();
	month = date1.getMonth();
	day = date1.getDay();

	var hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
	var hari = hari[day];

	var hari_text = showDay ? hari + ", " : "";

	var bulan = [ "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember" ];
	var bulan = bulan[month];

	var str = hari_text + date + " " + bulan + " " + year;
	return str;
}

function setOneWayPriceOnDate(sqlDate)
	{
     	//var valueset = {'2016-10-01': '1988', '2016-09-30': '1988', '2016-10-02': '1988'};
     	var valueset = calendar_oneway_lowest_price;
     	var price = parseInt(valueset[sqlDate]/1000) || 0;
     	return price;
	}

	function setReturnPriceOnDate(sqlDate)
	{
     	//var valueset = {'2016-10-01': '1988', '2016-09-30': '1988', '2016-10-02': '1988'};
     	var valueset = calendar_return_lowest_price;
     	var price = parseInt(valueset[sqlDate]/1000) || 0;
     	return price;
	}

	$(function() {
    var currentDate = dateObjectFromSql(fi_default_data.date);
    $('#date_input_oneway_display').datepicker({
        dateFormat: 'DD, dd MM yy'
    });
    $("#date_input_oneway_display").datepicker("setDate", currentDate);
	$('#ui-datepicker-div').css('visibility','hidden');
});

function onSelectOnewayDate(date){
	updateDatePickerCells("ONEWAY");
	fi_default_data.date = date;
	$('#date_input_oneway').val(fi_default_data.date);
	$('#date_input_oneway_display').val(dateIndo(fi_default_data.date, true));

	var onewayDateObj = dateObjectFromSql(fi_default_data.date);
	SelectedDates = {};
	SelectedDates[onewayDateObj] = new Date(fi_default_data.date);
}

function onSelectReturnDate(date){
	updateDatePickerCells("RETURN");

	fi_default_data.return_date = date;
	$('#date_input_return').val(fi_default_data.return_date);
	$('#date_input_return_display').val(dateIndo(fi_default_data.return_date, true));
}

$("#close_oneway_calendar").click(function(){
	togglePilihTanggalPergi();
	setupCurrentCalendarState();
	tempReturnDate();

	$('#return_datepicker').datepicker('option', 'minDate', dateObjectFromSql(fi_default_data.date));
	updateDatePickerCells("RETURN");

	var show_return_calendar = false;

	if(typeof fi_default_data.return_date === "undefined" && fi_default_data.state_return_trip){
		var show_return_calendar = true;
	}

	if(fi_default_data.return_date){

		if(dateObjectFromSql(fi_default_data.return_date) < dateObjectFromSql(fi_default_data.date)){
			var show_return_calendar = true;
		}
	}

	if(show_return_calendar){

		var default_object_date = dateObjectFromSql(fi_default_data.date);
		var default_object_return_date = default_object_date.setDate(default_object_date.getDate() + 2);
		// upgrade return date
		fi_default_data.return_date = new Date(default_object_return_date).yyyymmdd();
		$("#date_input_return_display").val(dateIndo(fi_default_data.return_date, true));
		$('#date_input_return').val(fi_default_data.return_date);

		$('#return_datepicker').datepicker('setDate', fi_default_data.return_date);
		togglePilihTanggalPulang();
	}
});

var SelectedDates = {};
var onewayDateObj = dateObjectFromSql(fi_default_data.date);
SelectedDates[onewayDateObj] = new Date(fi_default_data.date);

$('#oneway_datepicker').datepicker({
    changeMonth: false,
    changeYear: false,
    minDate: 0,
    yearRange: "0:+1",
    //The calendar is recreated OnSelect for inline calendar
    onSelect: function (date, dp) {
        onSelectOnewayDate(date);
    },
    onChangeMonthYear: function(month, year, dp) {
       updateDatePickerCells("ONEWAY");
    },
    beforeShow: function(elem, dp) { //This is for non-inline datepicker
        updateDatePickerCells("ONEWAY");
    }
});

// on runtime
updateDatePickerCells("ONEWAY");

function updateDatePickerCells(strTrip) {
    /* Wait until current callstack is finished so the datepicker
       is fully rendered before attempting to modify contents */
    setTimeout(function () {
        //Fill this with the data you want to insert (I use and AJAX request).  Key is day of month
        //NOTE* watch out for CSS special characters in the value
        //var cellContents = {1: '20', 15: '60', 28: '99.99'};

		// default value
		var datepicker_selector = "#oneway_datepicker";

		if(strTrip === "ONEWAY")
			datepicker_selector = "#oneway_datepicker";
		if(strTrip === "RETURN")
			datepicker_selector = "#return_datepicker";

        //Select disabled days (span) for proper indexing but // apply the rule only to enabled days(a)
        //$('.ui-datepicker td > *').each(function (idx, elem) {
		$( datepicker_selector ).find('.ui-datepicker td > *').each(function (idx, elem) {

            var dateOnly = $(this).html();
		   	var monthDp = $(this).closest( "td" ).attr("data-month");
		   	var month = parseInt(monthDp);
		   	var year = $(this).closest( "td" ).attr("data-year");

		   	var jsDate = new Date(year, month, dateOnly);
		   	var sqlDate = jsDate.yyyymmdd();

   			//var value = cellContents[idx + 1] || 0;
			var value = 0;
			if(strTrip === "ONEWAY"){
            	var value = setOneWayPriceOnDate(sqlDate) || 0;
			}
			if(strTrip === "RETURN"){
				var value = setReturnPriceOnDate(sqlDate) || 0;
			}

            // dynamically create a css rule to add the contents //with the :after
  			//selector so we don't break the datepicker //functionality
            //var className = 'datepicker-content-' + CryptoJS.MD5(value).toString();
            var className = 'datepicker-content-' + value;

            if(value == 0)
                addCSSRule('.ui-datepicker td a.' + className + ':after {content: "\\a0";}'); //&nbsp;
            else
                addCSSRule('.ui-datepicker td a.' + className + ':before {content: "' + value + ' rb";}');

            $(this).addClass(className);
        });
    }, 0);
}

$('#return_datepicker').datepicker({
    changeMonth: false,
    changeYear: false,
    yearRange: "0:+1",
	// initial value
    minDate: dateObjectFromSql(fi_default_data.date),
    //The calendar is recreated OnSelect for inline calendar
    onSelect: function (date, dp) {
		onSelectReturnDate(date);
    },
    onChangeMonthYear: function(month, year, dp) {
       updateDatePickerCells("RETURN");
    },
    beforeShow: function(elem, dp) { //This is for non-inline datepicker
        updateDatePickerCells("RETURN");
    },
	beforeShowDay: function(date) {
            var Highlight = SelectedDates[date];
            if (Highlight) {
                return [true, "tanggal-berangkat-highlight"];
            }
            else {
                return [true, '', ''];
            }
	}
});

$('#oneway_datepicker').datepicker('setDate', fi_default_data.date);

// initial condition
if(fi_basic_data.return_date){
	$('#date_input_return_display').val(dateIndo(fi_basic_data.return_date, true));
	$('#return_datepicker').datepicker('setDate', fi_basic_data.return_date);
}

var dynamicCSSRules = [];
function addCSSRule(rule) {
    if ($.inArray(rule, dynamicCSSRules) == -1) {
        $('head').append('<style>' + rule + '</style>');
        dynamicCSSRules.push(rule);
    }
}

function tempReturnDate(){

	if(fi_default_data.return_date == undefined){
		var default_object_date = dateObjectFromSql(fi_default_data.date);
		var default_object_return_date = default_object_date.setDate(default_object_date.getDate() + 2);
		var return_date_str = new Date(default_object_return_date).yyyymmdd();

		temp_return_date = return_date_str;
		$('#date_input_return_display').val(dateIndo(return_date_str, true));
		$('#return_datepicker').datepicker('setDate', return_date_str);
	}
}

function isReturnDateInvalid(date, return_date){
	var dateObj = dateObjectFromSql(date);
	var returnDateObj = dateObjectFromSql(return_date);

	if(returnDateObj < dateObj)
	 	return true;
	else
	 	return false;
}

$(function(){
		$("#flight-return-date").click(function(){
			toggleReturnTripCalendar();
			showCommision();
			tempReturnDate();
		});
	});

(function ($) {

    $.fn.toggleSwitch = function () {
        var id = this.attr("id"),
            switchDivId = id + "-switch";
        $("<div/>", {class: "onoffswitch", id: switchDivId}).insertAfter(this);
        $("div#" + switchDivId).append(this.clone().addClass('onoffswitch-checkbox'));
        $("<label/>", {
            class: "onoffswitch-label",
            for: id
        }).appendTo("div#" + switchDivId);
        this.remove();
    };
}(jQuery));
