var timerStart = Date.now();
var isEnableScroll=false;
// jangan di pindahin dlu untuk handle pada saat program pertama kali di jalankan
// jika di click spinnernya maka akan hilang loadingnya
function enableScroll(){
    $('#ajaxSpinnerContainer').hide();
    $('html').css({
        overflow: '',
        top: ''
    });

    $('body').css({
        overflow: '',
        top: ''
    });
    isEnableScroll=true;

    $('body').off('touchmove');
}
// untuk handle all ajax maintenance server
function OnMaintenanceServerListener(data){
    try{
        var jsonObj = data;
        if(typeof jsonObj.maintenance != 'undefined'){
            window.location.href=jsonObj.maintenance_url;
            exit;
        }
    }catch(e){
    }

}

$(function (){
    $(window).bind('load', function () {
        $("#ajaxSpinnerContainer").fadeOut(100, function() {
            enableScroll();
        });
    });

});

$(function () {
    $(window).bind('load', function () {
        setTimeout(function () {
            enableScroll();
        }, 2000);
    });
});

new vUnit({
    CSSMap: {
        '.vh': {
            property: 'height',
            reference: 'vh'
        },
        '.vw': {
            property: 'width',
            reference: 'vw'
        },
        '.vwfs': {
            property: 'font-size',
            reference: 'vw'
        },
        '.vhmt': {
            property: 'margin-top',
            reference: 'vh'
        },
        '.vhmb': {
            property: 'margin-bottom',
            reference: 'vh'
        },
        '.vminw': {
            property: 'width',
            reference: 'vmin'
        },
        '.vmaxw': {
            property: 'width',
            reference: 'vmax'
        }
    }
}).init();

function newDateRangePickerRekamTransaksi(dateFrom, dateTo) {
    var dFrom = dateFrom;
    var dTo = dateTo;
    if(dFrom != undefined && dTo != undefined) {
        var newFrom = dFrom.split('-').reverse();
        var newTo = dTo.split('-').reverse();
    }
    var monthName = ['', 'JAN','FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGS', 'SEP', 'OKT', 'NOV', 'DES'];
    if (dFrom === dTo) {
        var newDate = (newFrom[0] + " " + monthName[newFrom[1].replace(/^0+/, '')]);
    } else {
        if (newFrom[2] == newTo[2]) {
            var newDate = (newFrom[0] + " " + monthName[newFrom[1].replace(/^0+/, '')] + " - " + newTo[0] + " " + monthName[newTo[1].replace(/^0+/, '')]);
        } else {
            var newDate = (newFrom[0] + " " + monthName[newFrom[1].replace(/^0+/, '')] + " " + newFrom[2] + " - " + newTo[0] + " " + monthName[newTo[1].replace(/^0+/, '')] +" " + newTo[2]);
        }
    }
    return newDate;
}
