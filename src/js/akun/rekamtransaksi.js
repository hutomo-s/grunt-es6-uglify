    if (history && history.pushState) {
        history.pushState({module:"leave"}, document.title, this.href);
    }
    $(window).bind("popstate", function(evt) {
        var state = evt.originalEvent.state;
        if (state && state.module === "leave") {
            $.getScript(location.href);
        }
    });
    $('.no-transaksi-content').height($(window).height()-150);
    $('.centered').height($(window).height()-150);
    $('.rd-wrapper').height($(window).height()-50);

    // global variabel
    var isRunning=false;
    var endPage=false;
    var dataItem=[];
    var temp_date_from_change=date_from_default;
    var temp_date_to_change=date_to_default;
    var onChangeDate=false;
    var firstNoChange=true;
    var changeStatus=defaultStatus;
    var page =1;
    var tempDate="";
    var isNotItem=false;
    messageTransaksi(1);
    jQuery(document).ready(function () {
        setCheckBox(changeStatus);
        setLabelStatus(getCheckBoxName(changeStatus));
        onLoadRekamTransaksi();
        // Summon modal
        jQuery(window).scroll(function (e) {
        if ($(this).scrollTop() >= $(document).height() - ($(this).height())) {
            if (isRunning === false) {
                onLoadRekamTransaksi();
            }
        }
        });
    });

    /**
     * untuk active modal
     * @return {[type]} [description]
     */
    function activateModal() {
        // initialize modal element
        var modalEl = document.createElement('div');
        var options = {
            'keyboard': true, // teardown when <esc> key is pressed (default: true)
            'static': false, // maintain overlay when clicked (default: false)
            'onclose': function enableScroll() {
                          // enable scrolling and bounce effect on Safari iOS
                          document.ontouchmove = function(e) { return true; }
                      } // execute function when overlay is closed
        };
        modalEl.style.width           = '80%';
        modalEl.style.minWidth        = '250px';
        modalEl.style.maxWidth        = '250px';
        modalEl.style.height          = '330px';
        modalEl.style.margin          = 'auto';
        modalEl.style.position        = 'absolute';
        modalEl.style.top             = '0';
        modalEl.style.left            = '0';
        modalEl.style.bottom          = '0';
        modalEl.style.right           = '0';
        modalEl.style.backgroundColor = '#fff';
        modalEl.style.webkitOverflowScrolling = 'touch';
        modalEl.style.verticalAlign   = 'middle';
        modalEl.innerHTML = $('#modal_wrapper').html();
        // show modal
        mui.overlay('on', options, modalEl);
        // disable scrolling and bounce effect on Safari iOS
        document.ontouchmove = function(e){ e.preventDefault(); e.stopPropagation(); }
    }

    // dismiss modal
    function modalClose(modalDiv) {
        modalEl = document.getElementById(modalDiv);
        mui.overlay('off', modalEl);
        // enable scrolling and bounce effect on Safari iOS
        document.ontouchmove = function(e) { return true; }
    }
    $("#e1").daterangepicker({
        datepickerOptions : {
            numberOfMonths : 1,
             minDate: new Date(end_date_default)
        },
        open: function(event, data)
        {
          $('.comiseo-daterangepicker-mask').css({opacity: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)'});
          $('.comiseo-daterangepicker ').css({position: 'fixed', margin: 'auto', top: 0, left: 0, bottom: 0, right: 0, width: '250px', height: '304px'});
          $('body').css({overflowY: 'hidden'});
        },
        change: function(event, data)
        {
            onChangeDate=true;
            firstNoChange=false;
            var date = JSON.parse($('#e1').val());
            if (date.start != ''){
                temp_date_from_change=date.start;
            }
            if (date.end != ''){
                temp_date_to_change=date.end;
            }
            doFilter();
            setDateRangePickerLabel(newDateRangePicker(temp_date_from_change,temp_date_to_change));
        },
        clear: function(event, data)
        {
            onChangeDate=false;
            firstNoChange=true;
            temp_date_from_change=defaultRekamTransaksi['date_from'];
            temp_date_to_change=defaultRekamTransaksi['date_to'];
            changeStatus=defaultRekamTransaksi['status'];
            LabelDefault=defaultRekamTransaksi['label_date'];
            setDateRangePickerLabel(LabelDefault);
            doFilter();
            $('button.comiseo-daterangepicker-triggerbutton.ui-button.ui-corner-all.ui-widget.comiseo-daterangepicker-bottom').html('7 HARI TERAKHIR');
        },cancel:function(event, data){
            onChangeDate=false;
            setDateRangePickerLabel(newDateRangePicker(temp_date_from_change,temp_date_to_change));
            $('body').css({overflowY: 'scroll'});
        },
        close: function(event, data)
        {
            onChangeDate=false;
            setDateRangePickerLabel(newDateRangePicker(temp_date_from_change,temp_date_to_change));
            $('body').css({overflowY: 'scroll'});
        },
        initialText :LabelDefault
    });

    /**
     * untuk mengeset label
     * [setDateRangePickerLabel description]
     * @param {[type]} label [description]
     */
    function setDateRangePickerLabel(label){
        $('button.comiseo-daterangepicker-triggerbutton.ui-button.ui-corner-all.ui-widget.comiseo-daterangepicker-bottom').html(label);
    }

    /**
     * trigger click out datepicker
     * @param  {[type]} ){                     if(onChangeDate [description]
     * @return {[type]}     [description]
     */
    $('.comiseo-daterangepicker-mask').click(function(){
        if(firstNoChange == true){
            setDateRangePickerLabel(LabelDefault);
        }else if(onChangeDate == false ){
            setDateRangePickerLabel(newDateRangePicker(temp_date_from_change,temp_date_to_change));
        }
        onChangeDate=false;
    });
    $('.comiseo-daterangepicker.comiseo-daterangepicker-right.ui-widget.ui-widget-content.ui-corner-all.ui-front > .ui-helper-clearfix > div > button:nth-child(3)').click(function(){
        if(firstNoChange == true){
            setDateRangePickerLabel(LabelDefault);
        }else{
            setDateRangePickerLabel(newDateRangePicker(temp_date_from_change,temp_date_to_change));
        }
    })

    /**
     * untuk set check box
     * [setCheckBox description]
     * @param {[type]} status [description]
     */
    function setCheckBox(status)
        {
          var domHtml = $('input[name=filterStatus]');
          domHtml.removeAttr('checked');
          domHtml.each(function (index, value)
          {
            if ($(this).val() == status)
            {
              $(this).attr('checked', true);
            }else{
              $(this).attr("checked", false);
            }
          });
    }
    function getCheckBoxName(status)
        {
          var domHtml = $('input[name=filterStatus]');
          var label="";
          domHtml.each(function (index, value)
          {
                if ($(this).val() == status)
                {
                  label= $(this).attr('label');
                }
          });
          return label;
    }
    function handleClick(option){
        changeStatus=$(option).val();
    }

    /**
     * untuk set variabel global default
     * [setDefaultGlobalVariabel description]
     */
    function setDefaultGlobalVariabel(){
        isRunning=false;
        endPage=false;
        dataItem=[];
        page=1;
        isNotItem=false;
        $("#transaksi-content").empty();
        noTransaksi(false);
    }
    function noTransaksi(is_no_transaksi){
            $("#message-proses-content").addClass("hidden");
        if(is_no_transaksi == true){
            $(".no-transaksi-content").removeClass("hidden");
            $("#transaksi-content").addClass("hidden");
        }else{
            $(".no-transaksi-content").addClass("hidden");
            $("#transaksi-content").removeClass("hidden");
        }

    }

    /**
     * message transaksi
     * @param  {[type]} id [description]
     * @return string
     */
    function messageTransaksi(id){
        $("#no-transaksi-content").addClass("hidden");
        $("#transaksi-content").addClass("hidden");
        $("#message-proses-content").removeClass("hidden");
        if(id == 1){
            $("#message-proses-content span.message").html("Sedang memuat ...");
            return "";
        }
        $("#message-proses-content span.message").html("Sedang mengalami gangguan jaringan, <br> mohon ditunggu beberapa saat lagi.");
        return "";
    }
    function showContentTransaksi(){
            $("#transaksi-content").removeClass("hidden");
            $("#no-transaksi-content").addClass("hidden");
            $("#message-proses-content").addClass("hidden");
    }

    /**
     * untuk push address setelah di filter
     * [pushAddress description]
     * @param  {[type]} title   [description]
     * @param  {[type]} address [description]
     * @return null
     */
    function pushAddress(title,address){
        try{
            history.pushState({}, "", address);
        }catch(e){
            window.location.href=address;
        }
    }
    function updateQueryStringParameter(uri, key, value) {
        if (!uri) {
            uri = window.location.href;
        }
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            return uri + separator + key + "=" + value;
        }
    }
    function setLabelStatus(label){
        $('.label-status').text(label);
    }
    function doFilter(){
        setCheckBox(changeStatus);
        setLabelStatus(getCheckBoxName(changeStatus));
        modalClose('modal_wrapper');
        var address=updateQueryStringParameter(null, 'date_to', temp_date_to_change);
        address=updateQueryStringParameter(address, 'date_from', temp_date_from_change);
        address=updateQueryStringParameter(address, 'status', changeStatus);
        pushAddress("Rekam Transaksi",address);
        setDefaultGlobalVariabel();
        onLoadRekamTransaksi();
    }

    /**
     * untuk onload rekam transaksi
     * [onLoadRekamTransaksi description]
     * @return {[type]} [description]
     */
    function onLoadRekamTransaksi(){
        if (endPage == false && isNotItem ==false) {
            isRunning = true;
            jQuery.ajax({
                url: apiRekamTransaksi,
                method: "post",
                dataType: "json",
                data: {
                    "page": page,
                    "date_from": temp_date_from_change,
                    "date_to": temp_date_to_change,
                    "_token": token,
                    "status": changeStatus+''
                }
            }).done(function (data_parser) {
                var is_action = false;
                isRunning = false;
                if (data_parser.code == "1000") {
                    if(data_parser.message.data.length > 0){
                        is_action = true;
                        $.each(data_parser.message.data,function(index,value){
                            if(tempDate != value.date_format_2){
                                tempDate=value.date_format_2;
                                $("#transaksi-content").append(RenderDateListRekamTransaksi(value));
                            }
                            $("#transaksi-content").append(RenderListRekamTransaksi(value));
                        });
                        page+=1;
                        showContentTransaksi();
                    }else{
                        isNotItem=true;
                        if(page ==1){
                            noTransaksi(true);
                        }
                    }
                } else {
                    messageTransaksi(2);
                    isRunning = false;  
                }
                isRunning = false;
                // if(page == 2 ){
                //     onLoadRekamTransaksi();
                // }
            }).fail(function () {
                  messageTransaksi(2);
                isRunning = false;
            });
        }
    }

    /**
     * list tanggal rekam transaksi
     * [RenderDateListRekamTransaksi description]
     * @param {[type]} data [description]
     * return string
     */
    function RenderDateListRekamTransaksi(data){
            var ContentDate='<div class="rd-date-header font-semibold mui-row margin-o rd-details bg-white-2">';
                ContentDate+='<div class="mui-col-xs-12 mui-col-md-12 rd-padding-reset bg-white-2"><p class="margin-o">'+data.date_format_2+'</p></div>';
                ContentDate+='</div>      ';
                return ContentDate;
    }

    /**
     * list content rekam transaksi
     * [RenderListRekamTransaksi description]
     * @param {[type]} data [description]
     */
    function RenderListRekamTransaksi(data){
        var url = base_url+'/agent/rekam-transaksi/'+data.order_id+'/show';
        if(queryString != ""){
            url += queryString;
        }
        if (data.order_type == blockKai) {
            url = "javascript:void(0)";
        }
        var ListRekamTransaksi='<a href="'+url+'">';
            ListRekamTransaksi+='<div class="mui-row margin-o bg-white rd-details">';
            ListRekamTransaksi+='<div class="mui-col-xs-12 mui-col-md-12 rd-padding-reset">';
            ListRekamTransaksi+='<p class="font-semibold margin-o">#'+data.reference+'</p>';
            ListRekamTransaksi+='</div>';
            ListRekamTransaksi+='<div class="mui-col-xs-8 mui-col-md-8 rd-padding-reset">';
            ListRekamTransaksi+='<p class="font-semibold margin-o">'+data.item_name+'</p>';
            ListRekamTransaksi+='<p class="primary-grey margin-o">'+data.date_format_1+'</p>';
            ListRekamTransaksi+='</div>';
            ListRekamTransaksi+='<div class="mui-col-xs-4 mui-col-md-4 rd-padding-reset">';
            ListRekamTransaksi+='<div class="mui-col-xs-10 mui-col-md-10 rd-padding-reset mtopmin10">';
            ListRekamTransaksi+='<span>';
            ListRekamTransaksi+='<p class="font-semibold primary-grey mui--text-right margin-o">'+data.status_trx_name+'</p>';
            ListRekamTransaksi+='<p class="font-semibold primary-grey mui--text-right margin-o">'+data.order_total+'</p>';
            ListRekamTransaksi+='</span>';
            ListRekamTransaksi+='</div>';
            ListRekamTransaksi+='<div class="mui-col-xs-2 mui-col-md-2 rd-padding-reset">';
            ListRekamTransaksi+='<i class="material-icons primary-grey mtopmin2">&#xE5CC;</i>';
            ListRekamTransaksi+='</div>';
            ListRekamTransaksi+='</div>';
            ListRekamTransaksi+='</div>';
            ListRekamTransaksi+='</a>';
            return ListRekamTransaksi;
    }
