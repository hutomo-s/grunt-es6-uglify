 $(document).ready(function (){
        
        var toggleEls = document.querySelectorAll('[data-mui-controls^="pane-justified-"]');
        for (var i=0; i < toggleEls.length; i++) 
        {
            toggleEls[i].addEventListener('mui.tabs.showstart', logFn);
        }
        var getNews = $.ajax({
                        url     : urlLoadNews,
                        method  : "get",
                        dataType: "json",
                        data    : {minId : setPagePromo.minId, maxId : setPagePromo.maxId },
                        beforeSend : function (){
                            $('.news-content-append').html('<div class="news-onloading-msg"><p class="font-medium font-semibold primary-grey">Sedang memuat ...</p></div>');
                        },
                        success : function (retval){
                            if (retval.status)
                            {
                                setPagePromo.minId = retval.minId;
                                setPagePromo.maxId = retval.maxId
                                if (retval.last_retrieved_newsfeed_id == 0)
                                {
                                    if (setActiveTabs != 'pane-justified-1')
                                    {
                                        $("[data-mui-controls=pane-justified-1] > span").removeClass('hidden').text(retval.totalPromo);
                                    }
                                }
                                else
                                {
                                    if (setActiveTabs != 'pane-justified-1')
                                    {
                                        if (retval.totalPromo != 0)
                                        {
                                            $("[data-mui-controls=pane-justified-1] > span").removeClass('hidden').text(retval.totalPromo);
                                            setFooterCounter(retval.totalPromo);
                                        }
                                    }
                                }

                                $('.news-content-append').html(retval.html);
                            }
                            else
                            {
                                $('.news-content-append').html('<div class="news-onloading-msg"><div class="news-circle-gray">\
                                                        <i class="material-icons news-notif-null-icon">&#xE7F8;</i>\
                                                    </div> <p class="font-medium font-semibold primary-grey">Belum ada Promo untuk saat ini.</p></div>');
                            }
                        },
                        complete : function (){
                            $('.news-content-append').removeClass("vh100");
                            $('#pane-justified-1').css('height', 'auto');
                            $('body').css({paddingBottom: 0});
                            if ($('#pane-justified-1').height() < $(window).height()) {
                                $('#pane-justified-1').height($(window).height()-168);
                            }
                        },
                        error: function (request, status, error) {
                            $('.news-content-append').html($('.news-feed-null'));
                        }
                    });
        getNotif();
        hideCountNotif(getActiveTabs.selector);
        $(window).scroll(function() {
            if($(window).scrollTop() == $(document).height() - $(window).height())
            {
                if (getActiveTabs == "pane-justified-1")
                {
                    loadMoreNews(urlLoadNews, setPagePromo);
                }
                else
                {
                    if (statusLoadMore.notif)
                    {
                        loadMoreNotif(urlLoadNotif, setPageNotif);
                    }
                }
            }
        });
        //for fullscreen background if data null
        var height = ($(window).height()-170);
        $('.news-feed-null').css('height', height);
        // set active tabs
        mui.tabs.activate(setActiveTabs);

        // set counter number


    });

    function logFn(ev)
    {
        if (ev.paneId == "pane-justified-2")
        {
            if(checkContent() == 'true')
            {
                getNotif();
            }
             //$("[data-mui-controls=pane-justified-1] > span").addClass('hidden');
            if(!$("[data-mui-controls=pane-justified-2] > span").hasClass('hidden'))
            {
                setLastReadForNotification();
            }
        }
        else
        {
            if(!$("[data-mui-controls=pane-justified-1] > span").hasClass('hidden'))
            {
                setLastReadForNewsfeed();
            }
        }
        hideFooterCounter();
        hideCountNotif(ev.paneId);
        getActiveTabs.selector = ev.paneId;
    }

    function setLastReadForNewsfeed()
    {
        $.ajax({
                url     : setLastRetrive,
                method  : "get",
                dataType: "json",
                data    : {newsfeed_id : setPagePromo.maxId},
                success : function (retval){
                  $("[data-mui-controls=pane-justified-1] > span").addClass('hidden');
                },
                error: function (request, status, error) {

                }
        });
    }

    function setLastReadForNotification()
    {
        $.ajax({
                url     : setLastRetriveNotification,
                method  : "get",
                dataType: "json",
                data    : {notif_id : setPageNotif.maxId},
                success : function (retval){
                  $("[data-mui-controls=pane-justified-2] > span").addClass('hidden');
                },
                error: function (request, status, error) {

                }
        });
    }
    function hideCountNotif(selectId)
    {
        //$("[data-mui-controls="+selectId+"] > span").addClass('hidden')
    }
    function showCountNotif(selectId, valueCount)
    {
        $("[data-mui-controls="+selectId+"] > span").removeClass('hidden');
        $("[data-mui-controls="+selectId+"] > span").text(valueCount);
    }
    function getNotif()
    {
        $.ajax({
            url     : urlLoadNotif,
            method  : "get",
            dataType: "json",
            data    : {minId : setPageNotif.minId, maxId : setPageNotif.maxId },
            beforeSend : function (){
                $('.notif-content-append').html('<div class="news-onloading-msg"><p class="font-medium font-semibold primary-grey">Sedang memuat ...</p></div>');
            },
            success : function (retval){
                if (retval.status)
                {
                    setPageNotif.minId = retval.minId;
                    setPageNotif.maxId = retval.maxId;
                    $('.notif-content-append').html(retval.html);
                    $('.notif-content-append').attr('data-is-empty','false');
                    if (retval.last_retrieved_notif_id == 0)
                    {
                        if (setActiveTabs != 'pane-justified-2')
                        {
                            $("[data-mui-controls=pane-justified-2] > span").removeClass('hidden').text(retval.totalPromo);
                        }
                    }
                    else
                    {
                        if (setActiveTabs != 'pane-justified-2')
                        {
                            if (retval.totalPromo != 0)
                            {
                                $("[data-mui-controls=pane-justified-2] > span").removeClass('hidden').text(retval.totalPromo);
                                setFooterCounter(retval.totalPromo);
                            }
                        }
                    }
                }
                else
                {
                    $('.notif-content-append').html('<div class="news-onloading-msg"><div class="news-circle-gray">\
                                                        <i class="material-icons news-notif-null-icon">&#xE7F8;</i>\
                                                    </div> <p class="font-medium font-semibold primary-grey">Belum ada notif untuk saat ini.</p></div>');
                }
            },
            complete : function (){
                $('.news-content-append').removeClass("vh100");
                $('#pane-justified-2').css('height', 'auto');
                $('body').css({paddingBottom: 0});
                if ($('#pane-justified-2').height() < $(window).height()) {
                    $('#pane-justified-2').height($(window).height()-168);
                }
            },
            error: function (request, status, error) {
                $('.news-content-append').html($('.news-feed-null'));
            }
        });
    }

    function setFooterCounter(countData)
    {
        $("[data-mui-controls=berita] > span").removeClass('hidden').text(countData);
    }

    function hideFooterCounter(countData)
    {
        $("[data-mui-controls=berita] > span").addClass('hidden').text("");
    }

    function loadMoreNews(urlLoad, setPagePromo)
    {
        $.ajax({
            url: urlLoad,
            method: "get",
            dataType: "json",
            async   :false,
            data    : {minId : setPagePromo.maxId },
            beforeSend : function (){
                $('.news-content-append').append('<p id="loadingData" style="text-align: center;padding: 8px; margin-reset">Sedang memuat ...</p>');
            },
            success : function (retval){
                if (retval.status){
                    setPagePromo.maxId = retval.maxId
                    $('.news-content-append').append(retval.html);
                }
                else
                {
                    statusLoadMore.promo = false;
                    return false;
                }
                $('#loadingData').hide();
            },
            error: function (request, status, error) {
            }
        });
    }

    function loadMoreNotif(urlLoad, setPageNotif)
    {
        statusLoadMore.notif = false;
        $.ajax({
            url: urlLoad,
            method: "get",
            dataType: "json",
            data    : {minId : setPageNotif.maxId },
            beforeSend : function (){
                $('.notif-content-append').append('<p id="loadingData" style="text-align: center;padding: 8px; margin-reset">Sedang memuat ...</p>');
            },
            success : function (retval){
                $('.notif-content-append > p#loadingData').text('');
                if (retval.status){
                    statusLoadMore.notif = true;
                    setPageNotif.maxId = retval.maxId
                    $('.notif-content-append').append(retval.html);
                }
                else
                {
                    statusLoadMore.notif = false;
                    return false;
                }

            },
            error: function (request, status, error) {
            }
        });
    }

    function checkContent()
    {
        var checkNotif = $('.notif-content-append').attr('data-is-empty');
        return checkNotif;
    }

    $('.search-mainmenu').keydown(function(event){
        if(event.keyCode == 13) {
            var keyword = $('.search-mainmenu').val();
            var key = keyword.replace(/\s+/g, '');
            if (key == ''){
                return false;
            }
        }
    });

    function submitSearch(){
        var keyword = $('.search-mainmenu').val();
            var key = keyword.replace(/\s+/g, '');
            if (key != '')
            {
                $("#ajaxSpinnerContainer").show();
                $( "#searcGlobal" ).submit();
            }
    }

    $('#input_item').autocomplete({
        delay: 1100,
        type: 'GET',
        source: function (request, response)
        {
            $(".loader-search").removeClass("hidden").show();
            jQuery.get(base_url+'/search/suggest/ajax', {
                query: request.term,'token':token
            }, function (data) {
                $(".loader-search").hide();
                if(data['code']==1000){
                    // var message = "";
                    $(data['message']).each(function (index, value){
                        var checksearch = value.label.search(request['term']);
                        if (Number(checksearch) < Number(0) ){
                            data['message'][index]['label'] =  request['term']+" "+data['message'][index]['label']
                        }
                    });
                    response(data['message']);
                }
            }).fail(function(){
                $(".loader-search").hide();
            });
        },
        minLength: 2,
        select: function(event, ui) {
            window.location.href=ui.item.link;
        }
    }).autocomplete( "instance" )._renderItem = function( ul, item ) {
        var temp_label=item.label;
            temp_label=temp_label.split(" ");
        var label=item.label;

        if(temp_label.length > 0){
            label="";
            for(var i=0;i<temp_label.length;i++){
                if(item.keyword == temp_label[i]){
                    temp_label[i]="<span class='text-green'>"+temp_label[i]+"</span>";
                }
                if(i == 0){
                    label += temp_label[i];
                }
                else
                {
                    label += (" "+temp_label[i]);
                }
            }
        }
        var li=[];
        if(item.status != null ){
            switch(item.status){
                case 'keyword':     li.push( $( "<li>" ).append( "<strong class='text-blue'> Kata Kunci </strong>" )); break;
                case 'category':    li.push( $( "<li>" ).append( "<strong class='text-blue'> Kategori </strong>" ));     break;
                case 'vendor':      li.push( $( "<li>" ).append( "<strong class='text-blue'> Penjual </strong>" ));    break;
            }

        }
        li.push( $( "<li>" ).append( "<a>" + label+ ""+item.predikat+" <span>"+item.desc +"</span> </a>" ).click(function(){ return window.location.href=item.link}));
        return ul.append( li );
    };

    function setRead(url, param, urlReadirect)
    {
        $.ajax({
            url     : url,
            method  : "get",
            dataType: "json",
            data    : param,
            beforeSend : function (){
            },
            success : function (retval){
                window.location  = urlReadirect;
            },
            error: function (request, status, error) {
                $('.news-content-append').html($('.news-feed-null'));
            }
        });
    }

    function setStorage(data, notif_id, status)
    {
        localStorage.setItem("detailPush",data);
        var urlRedirect    = urlPushNotif+'?n=notif';
        var param          = {notif_id : notif_id};
        if (status == 'true')
        {
            setRead(urlSetRead, param, urlRedirect);
        }
        else
        {
           window.location  = urlRedirect;
        }
    }

    function setReadPromo(type_id, notif_id)
    {
        var param          = {notif_id : notif_id, type_id : type_id};
        $.ajax({
            url     : urlSetReadNotif,
            method  : "get",
            dataType: "json",
            data    : param,
            beforeSend : function (){
            },
            success : function (retval){
               if (retval.status)
               {
                   window.location  = retval.url;
               }
            },
            error: function (request, status, error) {
                $('.news-content-append').html($('.news-feed-null'));
            }
        });
    }

    function updateRead(urlRedirect, id)
    {
        $.ajax({
            url     : urlUpdateRead,
            method  : "get",
            data    : {id : id},
            dataType: "json",
            beforeSend : function (){
            },
            success : function (retval){
                window.location  = urlRedirect;
            },
            error: function (request, status, error) {

            }
        });
    }
