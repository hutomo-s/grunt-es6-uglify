$(document).ready(
        function() {
          var cek = diff;
          var renderedOffline = false;
          var pernahOnline = false;
          var information = [0,0,'desktop_browser'];
          var timer,
          canvas = document.getElementById('progressBar'),
          context = canvas.getContext('2d'),
          centerX = canvas.width / 2,
          centerY = canvas.height / 2;

          //cek if session has expired
          if(cek > 0) {
             showOverlayQr(); 
          } else { 
            document.getElementById('result').innerHTML = 'Loading';
            pernahOnline = true;
            renderedOffline = false;
            renderOffline();
            generateQrCode();
          }

          //action when 'perbarui' button clicked
          $('#perbarui-button').on('click', function() {
            //cek if isOnline 
            if(isOnline()) {
              document.getElementById('qrCode0').src = '';
              document.getElementById('qrCode0').style.display = 'block';
              document.getElementById('result').innerHTML = 'Loading';
              canvas.style.display = 'block';
              hideOverlayQr();
              disableScroll();
              renderOffline();
              generateQrCode();
            } else {
              //cek if qr has been generated before
              if(pernahOnline) {    
                //cek if offline qrcode has been rendered
                if (!renderedOffline) {
                  document.getElementById('qrCode10').style.display = 'block';
                  document.getElementById('result').innerHTML = 20;
                  hideOverlayQr();
                  startTimer(20); 
                  setTimeout(function(){
                    document.getElementById('result').innerHTML = '';
                    document.getElementById('qrCode10').style.display = 'none';
                    renderedOffline=true;
                    clearInterval(timer);
                    clearProgress();
                    showOverlayQr();  
                  },20000);
                } else {
                  document.getElementById('modalWrongTitle').innerHTML = 'Tidak ada koneksi internet, Tidak dapat membuat QR-Code';
                  $('#modalWrong').modal('show');
                  $("#modalWrong").on("hidden.bs.modal", function () {
                    showOverlayQr();
                  });
                }

              } else {
                  document.getElementById('modalWrongTitle').innerHTML = 'Tidak ada koneksi internet, Tidak dapat membuat QR-Code';
                  $('#modalWrong').modal('show');
                  $("#modalWrong").on("hidden.bs.modal", function () {
                    showOverlayQr();
                  }); 
              } 
            }
          });

          //this function will show the refresh layout
          function showOverlayQr() {
            canvas.style.display='none';
            document.getElementById('result').style.display = 'none';
            document.getElementById('container-timer').style.display = 'none';
            document.getElementById('qrCode0').style.display = 'none';
            document.getElementById('expImgDiv').style.display = 'block';
            document.getElementById('messageQr').style.display = 'block';
            document.getElementById('perbarui-button').style.display =' block';
          }

          //this function will hide the refresh layout, and show counter
          function hideOverlayQr() {
            canvas.style.display='block';
            document.getElementById('result').style.display = 'block';
            document.getElementById('container-timer').style.display = 'block';
            document.getElementById('expImgDiv').style.display = 'none';
            document.getElementById('messageQr').style.display = 'none';
            document.getElementById('perbarui-button').style.display = 'none';
          }

          //this function will ping to check connection
          function isOnline() {
           var xhr = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );
           var status;
           xhr.open( "GET", window.location.origin + window.location.pathname + "/ping",false);
            try {
              xhr.send();
              return ( xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304) );
            } catch (error) {
              return false;
            }
          }

          //this function is to create a random string
          function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
          }

          function errorShow(){
            document.getElementById('modalWrongTitle').innerHTML = "Sedang terjadi gangguan jaringan, silahkan coba beberapa saat lagi";
            $('#modalWrong').modal('show');
            $("#modalWrong").on("hidden.bs.modal", function () {
                 window.history.back();
            });
          }

          //this function is to render offline qrcode
          function renderOffline() {
            var keyOffline = randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            $.ajax({
                url: base_url + '/qrcode/render',
                type: 'post',
                dataType: 'json',
                data: { 
                        "nis" : nis + '_offline',
                        "key" : nis + "|" + keyOffline,
                        "isOffline": 'F'
                      },success: function(data) {
                          if(data.code == 1000) {
                            hasil = data.message.img_path;
                            document.getElementById('qrCode10').setAttribute('src',hasil + '?' + new Date().getTime());
                          }else{
                            errorhandle();
                          }
                      } ,error: function(e) {
                        errorhandle();
                      }
            });
          }

          function errorhandle(){
               document.getElementById('modalWrongTitle').innerHTML = "Sedang terjadi gangguan jaringan, silahkan coba beberapa saat lagi";
              $('#modalWrong').modal('show');
              $("#modalWrong").on("hidden.bs.modal", function () {
                   window.location.href=base_url+'/agent/setting'
              });           
          }

          //this function will handle if geolocation is not supported or isn't activated yet
          function handleNoGeolocation(errorFlag) {
            if (errorFlag) {
              document.getElementById('modalWrongTitle').innerHTML = "Aktifkan fitur location pada android anda kemudian tekan tombol ok";
              $('#modalWrong').modal('show');
              $("#modalWrong").on("hidden.bs.modal", function () {
                 window.location.reload();
              });
            } else if(!errorFlag) {
              document.getElementById('modalWrongTitle').innerHTML = "Sedang terjadi gangguan jaringan, silahkan coba beberapa saat lagi";
              $('#modalWrong').modal('show');
              $("#modalWrong").on("hidden.bs.modal", function () {
                   window.history.back();
              });              
            }
          }

          //this function will start the counter and progress bar
          function startTimer(startingTime) {
            var currentTime = startingTime - 1; // fix 1 sec start delay
            timer = setInterval( function() {
              document.getElementById('result').innerHTML = currentTime--;
                
              if (currentTime < 0) { 
                document.getElementById('result').innerHTML = '0';
                clearProgress();
                clearInterval(timer);
              } // finish
                
              function updateProgress() {
                var radius = 23;
                var circ = Math.PI * 2;
                var percent = currentTime / startingTime;
                
                context.clearRect(centerX - radius - context.lineWidth, 
                  centerY - radius - context.lineWidth, 
                  radius * 2 + (context.lineWidth*2), 
                  radius * 2 + (context.lineWidth*2));
                context.beginPath();
                context.arc(centerX, centerY, 23, 0, circ, false);
                context.lineWidth = 3;
                context.strokeStyle = '#FFF';
                context.stroke();
                context.closePath();
                context.beginPath();
                context.arc(centerX, centerY, radius, ((circ) * percent), circ, false);
                context.lineWidth = 4;
                context.strokeStyle = '#30597F';
                context.stroke();
                context.closePath();
              } // progress bar

              updateProgress();
            
            }, 1000);            
          }    
          
          //this function used to clear the progressbar canvas
          function clearProgress() {
              context.clearRect(0, 0, canvas.width, canvas.height);
          }

          //this function is used to generate QR-Code
          function generateQrCode() {   
            if(isMobile) {
              information[2] = 'mobile_browser';
            }

            if(isSecure()){
              if(navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position) {
                  information[0] = position.coords.latitude;
                  information[1] = position.coords.longitude;
                  hitAPI(information);
              }, function(error) {
                  hitAPI(information);
                  //handleNoGeolocation(true);
              });
            } else {
               hitAPI(information);
               //handleNoGeolocation(false);
            } 

          }else{
            hitAPI(information);
          }
                    
        }

        //this function used to get the qr-code data
        function hitAPI(information) {
          $.ajax({
              url: base_url + '/qrcode/generate',
              type: 'post',
              dataType: 'json',
              data: {
                      "long"  : information[1],
                      "lat"   : information[0],
                      "source": information[2],
                      "token" : token
                    } ,success: function(data) {
                        if(data.code == 1000) {
                            if(data.message == 2019) {
                              document.getElementById('modalWrongTitle').innerHTML = "Mohon maaf, token tidak valid";
                              $('#modalWrong').modal('show');
                              $("#modalWrong").on("hidden.bs.modal", function () {
                                window.location = base_url;
                              });
                            }
                              hasil = data.message.key;
                              if (hasil.code == 405)
                              {
                                document.getElementById('modalWrongTitle').innerHTML = "Mohon maaf, token tidak valid";
                                $('#modalWrong').modal('show');
                                $("#modalWrong").on("hidden.bs.modal", function () {
                                  window.location = base_url;
                                });
                                return false;
                              }
                              render(hasil);
                          
                        }
                    } ,error: function(e) {
                            document.getElementById('modalWrongTitle').innerHTML = "Sedang terjadi gangguan jaringan, silahkan coba beberapa saat lagi";
                            $('#modalWrong').modal('show');
                            $("#modalWrong").on("hidden.bs.modal", function () {
                                 window.history.back();
                            });
                      }
          });
        }

        //this function is for rendering the qrcode
        function render(hasil) {
          var arrHasil = JSON.parse(hasil);
          var hasilImage = [];
          var i = 0;
          getData();

          function getData() {
            $.ajax({
            url: base_url + '/qrcode/render',
            type: 'post',
            async: true,
            data: { 
                    "nis" : nis +'_'+i,
                    "key" : arrHasil[i],
                    "isOffline": 'N'
                  } ,success: function(data) {
                  
                    if(data.code == 1000) {
                      hasilImage[i] = data.message.img_path;
                      document.getElementById('qrCode'+i).setAttribute('src',hasilImage[i] + '?' + new Date().getTime());
                      i++;
                      if (i == 1) {
                        processQr();
                      }
                      if (i < arrHasil.length){
                         getData(); 
                      }     
                    }
                  } ,error:function(e) {
                      document.getElementById('modalWrongTitle').innerHTML = "Sedang terjadi gangguan jaringan, silahkan coba beberapa saat lagi";
                      $('#modalWrong').modal('show');
                      $("#modalWrong").on("hidden.bs.modal", function () {
                           window.history.back();
                      });
                  }
            });
          }
        
        //this function is used to process the showing of qrcode within an interval
        function processQr() {
          document.getElementById('qrCode0').style.display='block';
          document.getElementById('result').innerHTML='20';
          enableScroll();
          startTimer(20);
          var num = 0;
          var myVar = setInterval(function() { 
            document.getElementById('qrCode'+num).style.display='none';
            num++;
            if(num > 9) {
              if(num == 10) {
                clearInterval(myVar);
                clearInterval(timer);
                clearProgress();
                showOverlayQr();
                document.getElementById('result').innerHTML = '';
                document.getElementById('qrCode0').style.display = 'none';
              }
            } else {
              clearInterval(timer);
              clearProgress();
              startTimer(20);
              document.getElementById('result').innerHTML = 20;
              if(document.getElementById('qrCode'+num).src == ''){
                    document.getElementById('modalWrongTitle').innerHTML = "Sedang terjadi gangguan jaringan, silahkan coba beberapa saat lagi";
                    $('#modalWrong').modal('show');
                    $("#modalWrong").on("hidden.bs.modal", function () {
                         window.history.back();
                    });
              }
              document.getElementById('qrCode'+num).style.display = 'block';
            }
          }, 20000);
        }
      }

});  
