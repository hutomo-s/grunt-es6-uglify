function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function showRequest() {
  const checkEmail = validateEmail($('.email-data').val());
  if (checkEmail === false) {
    const checkNumber = $('.email-data').val().match(/^[0-9]+$/) !== null;
    if (checkNumber === false) {
      $('.danger-image').text('xxxKombinasi e-mail/Handphone Tidak sesuai !');
      return false;
    }
    const countData = $('.email-data').val().length;
    if (Number(countData) < Number(6)) {
      return false;
    }
  }
  $('.danger-image').text('');
  return true;
}

function showResponse(responseText, statusText) {
  alert(`status: ${statusText}\n\nresponseText: \n${responseText}
         \n\nThe output div should have already been updated with the responseText.`);
}

$(document).ready(() => {
  const options = {
    target: '#output2',
    beforeSubmit: showRequest,
    success: showResponse,
  };
  $('.login-form').submit(function () {
    $(this).ajaxSubmit(options);
    return false;
  });
});


function isNumber(evt) {
  const iKeyCode = (evt.which) ? evt.which : evt.keyCode;
  if (iKeyCode !== 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57)) {
    return true;
  }
  return false;
}
