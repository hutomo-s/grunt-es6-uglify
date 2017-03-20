$(document).ready(function() {
var msg="";
var elements = jQuery('input');
for (var i = 0; i < elements.length; i++) {
 elements[i].oninvalid =function(e) {
      if (!e.target.validity.valid) {
      switch(e.target.id){
          case 'dari_rek_no' : 
          e.target.setCustomValidity("Nomor Rekening Tidak Boleh Kosong");break;
          case 'dari_rek_name' : 
          e.target.setCustomValidity("Nama Pemilik Rekening Tidak Boleh Kosong");break;
          case 'jumlah' : 
          e.target.setCustomValidity("Jumalah Uang Transfer Tidak Boleh Kosong");break;
          case 'username' : 
          e.target.setCustomValidity("Username cannot be blank");break;
      default : e.target.setCustomValidity("");break;

      }
     }
  };
 elements[i].oninput = function(e) {
      e.target.setCustomValidity(msg);
  };
} 
})	

function cancelOnClickListener(){
$("#yakin-batal").modal("hide");
$("#modal_pin").modal("show");

}

function hide_modal_pin()
{
  $("#modal_pin").modal("hide");
}

$("input[name=pin]").keypress( function(e) {
          if ( e.keyCode === 13 ) 
          {
              e.preventDefault();
              $( "#modal_pin_submit" ).trigger("click");
          }
});

$("#modal_pin_submit").click(function(){
  $("#ajaxSpinnerContainer").show();
  hideAllTooltip();
  var pin = $("input[name=pin]").val();
  var form_data = {
      "pin" : pin,
      "deposit_id" : form_deposit_id,
      "deposit_amount" : form_deposit_amount,
  };
  
  $.ajax({
       url: submit_pin_for_cancel,
       method: "POST",
       dataType: 'json',
       data: form_data,
       success: function(result) {
           var jsonObj = result;
           OnMaintenanceServerListener(jsonObj);
           $("#ajaxSpinnerContainer").hide();
           if (result.redirect)
               window.location = result.redirect;
           else if (result.empty_fields && result.error_msg)
               show_tooltip(result.empty_fields, result.error_msg);
           else if(result.message && result.message_header)
           {
               hide_modal_pin();
               cart_popup(result.message, result.message_header);
            }
       }  
   });
});

function show_tooltip(tooltipArray, errorMsgArray) {
   hideAllTooltip();
   var emptyFieldName = tooltipArray[0];
   var divName = "tooltip_" + emptyFieldName;
   $("#" + divName).removeClass("hide");
   $("#" + divName + " span").text(errorMsgArray[0]);
   $('html, body').animate({
       'scrollTop': $("#" + divName).position().top
   });
}

function hideAllTooltip() {
   var tooltips = config_tooltips;
   for (i = 0; i < tooltips.length; i++) {
       var divName = "tooltip_" + tooltips[i];
       $("#" + divName).addClass("hide");
   }
}