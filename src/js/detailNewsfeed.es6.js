$('.title-image').hide('slow');
$('.event-image').click(() => {
  if ($('.title-image').is(':hidden')) {
    $('.title-image').show('slow');
  } else {
    $('.title-image').slideUp('slow', () => {
      $('.title-image').removeClass('hide');
    });
  }
  setTimeout(() => {
    $('.title-image').slideUp('slow', () => {
      $('.title-image').removeClass('hide');
    });
  }, 3000);
});
$(() => {
  const viewer = ImageViewer();
  $('.gallery-items').click(function () {
    const imgSrc = this.src;
    const highResolutionImage = $(this).data('high-res-img');
    viewer.show(imgSrc, highResolutionImage);
  });
});
