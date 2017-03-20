if (screen.width >= 480) {
  var cw = $('.item-crop').height();
  $('.item-crop').css({
    'height': 'auto'
  });
  $('.maintenance-size').css({
    'height': cw + 'px'
  });
}

$(document).ready(function() {
  $(document).on('keypress', '#buyPulsaGlobal', function(e) {
    if (e.keyCode == 13) {
      submitProcess();
    } else {
      $('.errors').html('');
    }
  });
  $('#clickBuyPulsaGlobal').click(function(e) {
      submitProcess();
  });
});

$('.provider-maintenance').click(function() {
  var maintenance_header = $(this).attr('data-name') + " dalam perbaikan";
  var maintenance_msg = $(this).attr('data-name') + " sedang dalam perbaikan. Silahkan kembali beberapa saat lagi";
  callDialog({
    'selectorId': 'maintenance-dialog',
    'title': maintenance_header,
    'image': "",
    'LabelBtnClose': "Close",
    'desc': maintenance_msg
  });
});

function checkNumber(field, rules, i, options) {
  var field = field.val();
  if (isInt(field)) {
    var checkPrefix = field.substr(0, 1);
    if (checkPrefix == "+") {
      var checkPrefixPlus = field.substr(0, 3);
      if (checkPrefixPlus != '+62') {
        return "Nomor Handphone yang Anda masukan salah !";
      }
    } else {
      var noHpdata = field.substr(0, 1);
      if (Number(noHpdata) !== Number(0)) {
        return "Nomor Handphone yang Anda masukan salah !";
      }
    }
  } else {
    if (field != "") {
      var checkEmail = validateEmail(field);
      if (checkEmail == false) {
        return "Email yang Anda masukan salah !";
      }
    } else {
      return "";
    }
  }
}

function isInt(value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10));
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function getPwd(field, rules, i, options) {
  var field = field.val();
  if (field != "") {
    if (Number(field.length) <= Number(6)) {
      return "Masukan nomor Telepon minimal 6 Digit";
    }
  } else {
    return "";
  }
}

function globalNumberSubmit() {
  var val = $('#buyPulsaGlobal').val();
  if (val != "") {
    submitProcess();
  }
}

function submitProcess() {
  var noGlobal = $('input[name="noGlobal"]').val();
  var prefArea = noGlobal.substr(0, 4);
  var listLabelData = "";
  var id = "";

  for (x in prefixValue) {
    $.each(prefixValue[x], function(index, value) {
      if (value == prefArea) {
        for (y in listLabel) {
          if (y == x) {
            listLabelData = listLabel[y];
            id = x;
          }
        }
      }
    });
  }
  if (listLabelData != "" && id != "") {
    if (maintenance_msg.indexOf(listLabelData) <= -1) {
      window.location = urlPulsa + slugify(listLabelData) + "/?no=" + noGlobal;
    } else {
      $('.errors').html('<div class="tooltip-alert"> <div class="arrowdown"></div>' + listLabelData + ' Sedang dalam perbaikan. </div>');
    }
  } else {
    var status_nohp = false;
    var operator = "/flexi";
    $.each(listPrefixArea, function(index, value) {
      if (Number(noGlobal.substr(0, Number(value.prefix.length) + Number(1))) == Number("0" + value.prefix)) {
        var numberStart = Number(value.prefix.length) + Number(1);
        var st = noGlobal.substr(numberStart, noGlobal);
        var numberPrefix = st.substr(0, 1);
        /* check Flexi  */
        var flexi = ['2', '3', '4', '6', '7', '8'];
        var a = flexi.indexOf(numberPrefix);
        if (Number(a) >= 0) {
          operator = "/flexi";
        } else {
          operator = "/esia";
        }
        /* check Flexi  */
        status_nohp = true;
      }
      if (Number(noGlobal.substr(0, 1)) == 9) {
        status_nohp = true;
        operator = "/bolt";
      }
    });
    if (status_nohp == true) {
      window.location = urlPulsa + operator + "?no=" + noGlobal;
    } else {
      $('.mui-textfield').find('.tooltip-alert').remove();
      $('.mui-textfield').append('<div class="tooltip-alert"><div class="arrowdown"></div>Operator tidak di temukan.</label>');
    }
  }
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
