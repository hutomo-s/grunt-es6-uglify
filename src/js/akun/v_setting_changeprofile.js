var profile = angular.module('profile', ['ngImgCrop', 'ui.bootstrap.modal', 'moment-picker']);
profile.service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
                var fd = new FormData();
                fd.append('photo', file);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(){
                })
                .error(function(){
                });
            }
         }]);
var profile = angular.module('profile', ['ngImgCrop', 'ui.bootstrap.modal', 'moment-picker']);
profile.controller('profileCtrl', ['$scope', '$http', 'fileUpload', function($scope, $http, fileUpload) {
    // get userdata from ajax
    $scope.refreshProfile = function(status_envet) {
        $("#ajaxSpinnerContainer").show();
        $scope.pekerjaans = [];
        var pekerjaanData = base_url + '/getPekerjaan';
        $http.post(pekerjaanData)
        .success(function(data) {
            $("#ajaxSpinnerContainer").hide();
            var b = { pekerjaan_id : "0",pekerjaan_name: "(Pilih Pekerjaan)" };
            var myArray = [];
            for (var i = 0; i < data.message.length+1; i++) {
                if (i == 0){
                    myArray[i] = b;
                }else{
                    var l = Number(i)-1;
                    myArray[i] = data.message[l];
                }
            }
            $scope.pekerjaans = myArray;
        });
        $http.get(profileDataUrl)
        .success(function(data) {
            $("#ajaxSpinnerContainer").hide();
            $scope.user = data.profile;
            $scope.fixed = $scope.user;
            if (status_envet === true){
                var img = new Image();
                img.src = data.profile.avatar;
                img.onload=function(){

                };
                img.onerror=function(){
                   $('#myModal').modal({backdrop: 'static', keyboard: false});
                };
            }
            if(!$scope.user.avatar){
                $scope.user.avatar = default_image;
            }
        });
    };
    $scope.refreshProfile();
    $scope.myImage='';
    $scope.myCroppedImage='';
    var handleFileSelect=function(evt) {
    var file=evt.currentTarget.files[0];
    var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
      // detect if the file is match to image
      var match = file.type.match('image.*') ? 1 : 0;
      // add defensive here
      if(match === 0)
      {
        $scope.clearFileInput();
        $scope.openNotifModal("Tipe gambar yang Anda masukkan salah.", "Perhatian");
        return;
      }
      if(file.size > 5 * 1024 * 1024)
      {
        $scope.clearFileInput();
        $scope.openNotifModal("Ukuran gambar yang Anda masukkan lebih dari 5 MB.", "Perhatian");
        return;
      }
      var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if(iOS)
      {
          var fileBase64 = file;
          var uploadUrl = uploadAvatarUrl + "?ios=1";
          $scope.uploadFilesService(fileBase64, uploadUrl);
          return;
      }
      $("#ajaxSpinnerContainer").show();
      $scope.openResizeAvatar();
    };
    angular.element(document.querySelector('#file_avatar')).on('change',handleFileSelect);
    $scope.openResizeAvatar = function () {
        $("#ajaxSpinnerContainer").hide();
        // default condition
        $scope.ngpop = {};
        $scope.ngpop.header = "Resize";
        $scope.ngpop.message = "";
        $scope.ngpop.croparea = true;
        $scope.ngpop.dismiss_wording = "BATAL";
        $scope.ngpop.dismiss_action = "clearFileInput";
        $scope.ngpop.ok_wording = "UPLOAD";
        $scope.ngpop.ok_action = "uploadFileAvatar";
        $scope.ngpop.show = true;
    };
    $scope.clearFileInput = function() {
        angular.element("input[type='file']").val(null);
        if($scope.ngpop)
            $scope.ngpop.show = false;
    };
    $scope.openNotifModal = function (message, header, redirectUrl) {
        // default condition
        $scope.ngpop = {};
        if(header)
            $scope.ngpop.header = header;
        else
            $scope.ngpop.header = "Update Akun";
            $scope.ngpop.message = message;
            $scope.ngpop.ok_wording = "OK";
            $scope.ngpop.ok_action = "cancel";
        if(redirectUrl)
        {
            $scope.ngpop.redirectUrl = redirectUrl;
            $scope.ngpop.ok_action = "redirectTo";
        }
            $scope.ngpop.show = true;
    };
    $scope.cancel = function () {
            $scope.ngpop.show = false;
    };
    $scope.redirectTo = function() {
        window.location = $scope.ngpop.redirectUrl;
    };
    $scope.avatarClick = function() {
        angular.element(document.querySelector(".modal-update")).removeClass("hidden");
            document.getElementById('file_avatar').click();
            $scope.clicked = true;
    };
    $scope.uploadFileAvatar = function(){
        var file = $scope.myCroppedImage;
        var uploadUrl = uploadAvatarUrl;
        // old - using service
        //fileUpload.uploadFileToUrl(file, uploadUrl);
        // new - using scope
        $scope.uploadFilesService(file, uploadUrl);
    };
    $scope.uploadFilesService = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('photo', file);
        var request = {
                    method: 'POST',
                    url: uploadUrl,
                    data: fd,
                    headers: {
                        'Content-Type': undefined
                    }
                };
        $("#ajaxSpinnerContainer").show();
        $http(request)
            .success(function (data) {
                $("#ajaxSpinnerContainer").hide();
                $scope.refreshProfile(true);
                $scope.openNotifModal("Update akun berhasil");
            })
            .error(function () {
            });
    };
    $scope.showDatePicker = function () {
        // default condition
        $scope.ngpop = {};
        $scope.ngpop.header = "Pilih Tanggal Lahir";
        $scope.ngpop.datepicker = true;
        $scope.ngpop.ok_wording = "OK";
        $scope.ngpop.ok_action = "cancel";
        $scope.ngpop.show = true;
        angular.element('#birthdate').trigger('click');
    };
    $scope.callFunction = function (name) {
        angular.isFunction($scope[name])
        $scope[name]()
    };
    $scope.callCancelFunction = function (name) {
        if(angular.isFunction($scope[name]))
            $scope[name]()
        else
            $scope.cancel();
    };
    // process the form
    $scope.updateAccount = function(){
      if ($scope.fixed.pekerjaan_id != 0 || $scope.fixed.pekerjaan_id != "0"){
        $scope.updateAccountService($scope.user, updateAccountUrl)
      }else{
        $scope.cancel();
        var errorOcupation = {'occupation' : ['Pekerjaan Wajib diisi']};
        var $scrollTo  = $('select[name="pekerjaan"]');
        $scope.errors = errorOcupation;
        var $container = $("html,body");
        if($scrollTo.length){
          $container.animate({scrollTop: $scrollTo.offset().top - $container.offset().top, scrollLeft: 0},300);
        }
      }
    }
    $scope.updateAccountService = function(modelName, postUrl) {
        $("#ajaxSpinnerContainer").show();
        $http({
        method  : 'POST',
        url     : postUrl,
        data    : $.param(modelName),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            $("#ajaxSpinnerContainer").hide();
              if(data.status === 200)
              {
                  $scope.errors.occupation = false;
                  var message = "Update akun berhasil";
                  // todo AJAX Request for updated profile
                  $scope.refreshProfile(true);
                  $scope.openNotifModal(message, "", $scope.ngpop.redirectUrl);
              }
              else if(data.status === 500)
              {
                  $scope.cancel();
                  var $container = $("html,body");
                  for (var key in data.error_messages) {
                    if (data.error_messages.hasOwnProperty(key)) {
                      var $scrollTo = $('input[name="'+key+'"]');
                      if ($scrollTo.length) {
                          $container.animate({scrollTop: $scrollTo.offset().top - $container.offset().top, scrollLeft: 0},300);
                          $scope.errors = data.error_messages;
                      }
                    }
                  }
              }
        });
    };

    $scope.changeWarning = function(){
        var message = "Harap hubungi Customer Service untuk melakukan perubahan data nomor handphone atau email.";
        $scope.openNotifModal(message);
    };

    $scope.confirmSave = function()
    {
        angular.element(document.querySelector(".modal-update")).removeClass("hidden");
        var message = "Apakah Anda yakin melakukan perubahan data?";
        // default condition
        $scope.ngpop = {};
        $scope.ngpop.header = "Update Akun";
        $scope.ngpop.message = message;
        $scope.ngpop.dismiss_wording = "TIDAK";
        $scope.ngpop.ok_wording = "YA";
        $scope.ngpop.ok_action = "updateAccount";
        $scope.ngpop.redirectUrl = navbarBackUrl;
        $scope.ngpop.show = true;
    }
    $scope.confirmSaveBack = function()
    {
        angular.element(document.querySelector(".modal-update")).removeClass("hidden");
        var message = "Apakah Anda yakin melakukan perubahan data?";
        // default condition
        $scope.ngpop = {};
        $scope.ngpop.header = "Update Akun";
        $scope.ngpop.message = message;
        //$scope.ngpop.croparea = false;
        $scope.ngpop.dismiss_wording = "TIDAK";
        $scope.ngpop.dismiss_action = "backUrlSetting";
        $scope.ngpop.ok_wording = "YA";
        $scope.ngpop.ok_action = "updateAccount";
        $scope.ngpop.redirectUrl = navbarBackUrl;
        $scope.ngpop.show = true;
    }
    $scope.confirmupdate = function()
    {
        angular.element(document.querySelector(".modal-update")).removeClass("hidden");
        $scope.class_dialog = "";
        var message = "Apakah Anda yakin melakukan perubahan data?";
        // default condition
        $scope.ngpop = {};
        $scope.ngpop.header = "Update Akun";
        $scope.ngpop.message = message;
        $scope.ngpop.dismiss_wording = "TIDAK";
        $scope.ngpop.ok_wording = "YA";
        $scope.ngpop.ok_action = "updateAccount";
        $scope.ngpop.show = true;
    }
    $scope.backUrlSetting = function (){
        window.location = navbarBackUrlSetting;
    }
}]);
profile.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
       var fd = new FormData();
       fd.append('photo', file);
       $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
       })
       .success(function(){
       })
       .error(function(){
       });
    }
}]);
