var setPinController = angular.module('setPinController', []);
setPinController.controller('Step_one', ['$scope', '$http', '$location', function ($scope, $http, $location) {

}]);

setPinController.controller('Step_two', ['$scope', '$http', '$location', function ($scope, $http, $location) {

}]);

setPinController.controller('Step_three', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.postdata = {};
    $scope.ngpop = {};
    $scope.ngpop.show = false;
    $scope.pin_icon = "&#xE417;";
    angular.element(document).ready(function () {
        $(".param_3").addClass('validate[required]');
        new MaskedPassword(document.getElementById("pin"), '\u25CF');
        new MaskedPassword(document.getElementById("pin_confirmation"), '\u25CF');
        var pin_focus = $('#pin').focus();
        onlyNumbers();
    });

    $scope.konfirmasi = function () {
        var post_data = $('#form-pin').serialize();
        var validate = $("#form-pin").validationEngine('validate');
        if (validate) {
            // set json
            var data_post = convertQueryStringToJson(post_data);
            data_post.token = token;
            // set json

            $http.post(base_url + "/set-pin/do-create-pin", data_post).success(function (data) {
                var jsonObj = data;
                OnMaintenanceServerListener(jsonObj);
                if (data.status) {
                    $location.path("/step-four");
                } else {
                    // validate API
                    $('.modal-header > .primary-black').text('Informasi').css('margin', "10px");
                    $('.vendor-msg > .primary-black').text(data.message);
                    cart_green_popup(data.message);
                }
            }).error(function (data, status, headers, config) {
                    $('.modal-header > .primary-black').text('Informasi').css('margin', "10px");
                    $('.vendor-msg > .primary-black').text(message_error_api);
                    cart_green_popup(message_error_api, "Error");
            });
        }
    };

    $scope.pin_show = function () {
        var query = convertQueryStringToJson($('#form-pin').serialize());
        $('#pin').val(query.pin);
        toggleEyes('.pin-material', '#pin');
    };

    $scope.pin_confirmation_show = function () {
        var query = convertQueryStringToJson($('#form-pin').serialize());
        $('#pin_confirmation').val(query.pin_confirmation);
        toggleEyes('.confirm-pin-material', '#pin_confirmation');
    };

    $scope.redirect_page = function () {

        $location.path("/step-two");
    };


}]);

setPinController.controller('Step_four', ['$scope', '$http', '$location', function ($scope, $http, $location) {

}]);

function convertQueryStringToJson(param) {
    var arr = param.split('&');
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        var bits = arr[i].split('=');
        obj[bits[0]] = bits[1];
    }
    return obj;
}

function generateStars(n) {
    var stars = '';
    for (var i = 0; i < n; i++) {
        stars += '*';
    }
    return stars;
}

function toggleEyes(selector, input) {

    if ($(selector).hasClass("visible-eye")) {
        $(selector).removeClass('visible-eye');
        $(selector).addClass('invisible-eye');

    } else {
        $(selector).addClass('visible-eye');
        $(selector).removeClass('invisible-eye');
        var text = "";
        for (i = 1; i <= $(input).val().length; i++) {
            text += "\u25CF";
        }

        $(input).val(text);
    }
}

function onlyNumbers(selector, input) {

    $(".onlyNumbers").keydown(function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}        

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