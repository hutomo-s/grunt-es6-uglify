var onlineApp = angular.module('onlineApp', ['ui.bootstrap.modal']);

var onlineIndexCtrl = onlineApp.controller('onlineIndexCtrl', ["$scope", "$http", "$interval", function ($scope, $http, $interval) {
    $scope.device = (typeof(device_android) != "undefined" ) ? device_android : false;
    $scope.show_bar = false;
    $scope.view_on_cart = (typeof(view_on_cart) != "undefined") ? view_on_cart : false;
    $scope.is_installed = (typeof(is_installed) != "undefined") ? is_installed : 0;

    $scope.img_left = "";
    $scope.text_left = "";
    $scope.text_rp = "";
    $scope.text_right = "";
    $scope.attempt = 0;
    $scope.customer_mode = null;
    $scope.validation_msg_passwd = "";

    $scope.showpasswd = false;
    $scope.option_expire_time = {};
    $scope.user = {}; // model object

    $scope.ngpop = {};
    $scope.ngpop.show = false;
    $scope.var_mode_box = '';
    $scope.isLoading = true;
    $scope.tooltip = false;
    var repeatAjax = function () {
        $http.get(get_mode_url).success(function (data) {
            var jsonObj = data;
            OnMaintenanceServerListener(jsonObj);
            $scope.isLoading = false;
            // for detect session exist
            if (typeof data.data === "undefined") {
                $http.get(base_url + "/check-session").success(function (retval) {
                    var jsonObj = retval;
                    OnMaintenanceServerListener(jsonObj);
                });
                return false;
            }

            // refresh if mode is changed
            if ($scope.attempt > 1 && $scope.customer_mode !== data.data.customer_mode) {
                window.location = "";
            }

            $scope.option_expire_time = data.data.option_expire_time;
            $scope.user.duration = "30";

            $scope.attempt += 1;
            $scope.customer_mode = data.data.customer_mode;
            // add condition
            $scope.text_left = $scope.showTextLeft(data.data, $scope.view_on_cart);

            if (!$scope.customer_mode && !$scope.view_on_cart){
                $scope.agent_url = (data.data.agent_url) ? data.data.agent_url : "#";
            }

            // takeout condition
            $scope.text_rp = (parseInt(data.data.profile.balance) >= 0) ? $scope.numRp(data.data.profile.balance) : $scope.numRp(-1 * parseInt(data.data.profile.balance));
            $scope.text_right = (data.data.customer_mode) ? "Aktifkan Mode Agen" : "Mode Agen";

            // add condition
            $scope.bg_color_bar = $scope.bgColorBar(data.data, $scope.view_on_cart);
            $scope.show_bar = true;
            $("#mode_bar").removeClass("hide");
            // add for loading
            $("#isLoading").addClass("hide");

        });
    };
    if ($scope.device === true && $scope.is_installed == 1) {
        $scope.var_mode_box = 'mtop-84';
    }
    repeatAjax();
    $interval(repeatAjax, ajax_duration);
    $scope.showTextLeft = function (data, view_on_cart) {
        if (parseInt(data.profile.balance) >= 0)
            return "Saldo: ";
        else if (parseInt(data.profile.balance) < 0)
            return "Hutang: ";
    };

    $scope.bgColorBar = function (data, view_on_cart) {
       if (parseInt(data.profile.balance) >= 0)
            return "bg-green";
        else if (parseInt(data.profile.balance) < 0)
            return "bg-red";
    };


    $scope.numRp = function (nStr) {
        nStr = parseInt(nStr);
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
        }
        return 'Rp ' + x1 + x2;
    };

    $scope.open = function (customer_mode) {
        $('html').css({
            overflow: 'hidden'
        });
        // default condition
        $scope.ngpop = {};
        $scope.validation_msg_passwd = "";

        if (customer_mode) {
            $scope.ngpop.header = "Mode Agen";
            $scope.ngpop.message = "Anda akan mengaktifkan mode Agen.";
            $scope.ngpop.dismiss_wording = "BATAL";
            $scope.ngpop.ok_wording = "AKTIFKAN";
            $scope.ngpop.ok_action = "confirmToAgentMode";
            $scope.ngpop.show = true;
        }
        else {
            $scope.confirmToCustomerMode();
        }


    };

    $scope.ok = function () {
        $scope.ngpop.show = false;
        $('html').css({
            overflow: ''
        });
    };

    $scope.cancel = function () {
        $scope.ngpop.show = false;
        $('html').css({
            overflow: ''
        });
    };

    $scope.confirmToAgentMode = function () {
        $scope.ngpop.header = "Aktifkan Mode Agen?";
        $scope.ngpop.message = "Dalam Mode Agen Anda dapat melihat komisi produk dan menggunakan fitur khusus Agen";
        $scope.ngpop.template = "konfirmasi_mode_agen";
        $scope.user.password = "";
        $scope.ngpop.dismiss_wording = "BATAL";
        $scope.ngpop.ok_wording = "KONFIRMASI";
        $scope.ngpop.ok_action = "submitToAgent";
        $scope.ngpop.lupa_password_url = lupa_password_url;
    };

    $scope.submitToAgent = function () {

        $http({
            method: 'POST',
            url: set_to_agent,
            data: $scope.user, //forms user object
        }).success(function (data) {
            var jsonObj = data;
            OnMaintenanceServerListener(jsonObj);
            $scope.tooltip = false;
            if (data.status == 500 && data.error_message)
            {
                $scope.tooltip = true;
                $scope.message_warning_alert = data.error_message;
            }
            else if (data.status == 500 && data.error)
            {
                $scope.ngpop = {};
                $scope.ngpop.header = data.error.header;
                $scope.ngpop.message = data.error.message;

                $scope.ngpop.ok_wording = "OK";
                $scope.ngpop.ok_action = "cancel";
                $scope.ngpop.show = true;
            }
            else
            {
                $scope.tooltip = false;
                window.location = "";
            }

        });

    };


    $scope.confirmToCustomerMode = function () {

        $scope.ngpop.option_expire_time = $scope.option_expire_time;

        $scope.ngpop.header = "Aktifkan Mode Pelanggan?";
        $scope.ngpop.message = "Mode Pelanggan ditujukan agar pelanggan Anda dapat melihat produk,";
        $scope.ngpop.message += " namun tidak dapat mengetahui komisi produk dan mengakses fitur khusus Agen.";
        $scope.ngpop.template = "konfirmasi_mode_pelanggan";

        $scope.ngpop.dismiss_wording = "BATAL";
        $scope.ngpop.ok_wording = "AKTIFKAN";
        $scope.ngpop.ok_action = "submitToCustomer";
        $scope.ngpop.show = true;
    };

    $scope.submitToCustomer = function () {

        $http({
            method: 'POST',
            url: set_to_customer,
            data: $scope.user, //forms user object
        }).success(function (data) {
            var jsonObj = data;
            OnMaintenanceServerListener(jsonObj);
            if (data.status == 200) {
                window.location = "";
            }
            else if (data.error) {
                $scope.ngpop = {};
                $scope.ngpop.header = data.error.header;
                $scope.ngpop.message = data.error.message;

                $scope.ngpop.ok_wording = "OK";
                $scope.ngpop.ok_action = "cancel";

                $scope.ngpop.show = true;
            }
            else {
                window.location = "";
            }

        });

    };

    $scope.callFunction = function (name) {
        angular.isFunction($scope[name]);
        $scope[name]();
    };

    // to be used in template: konfirmasi_mode_agen
    $scope.changeInputType = function () {
        $scope.showpasswd = !$scope.showpasswd;
    };

}]);
