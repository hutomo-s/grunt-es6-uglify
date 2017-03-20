function activateModal() {
    var modalEl = document.createElement('div');
    var options = {
        'keyboard': true, // teardown when <esc> key is pressed (default: true)
        'static': false, // maintain overlay when clicked (default: false)
        'onclose': function enableScroll() {
            // enable scrolling and bounce effect on Safari iOS
            document.ontouchmove = function(e) {
                return true;
            }
        } // execute function when overlay is closed
    };

    modalEl.style.width = '100%';
    modalEl.style.minWidth = '480px';
    modalEl.style.maxWidth = '480px';
    modalEl.style.maxHeight = '168px';
    modalEl.style.height = 'auto';
    modalEl.style.margin = 'auto';
    modalEl.style.position = 'absolute';
    modalEl.style.padding = '24px';
    modalEl.style.left = '-16px';
    modalEl.style.bottom = '58px';
    modalEl.style.right = '0';
    modalEl.style.backgroundColor = '#323232';
    modalEl.style.color = '#fff';
    modalEl.style.webkitOverflowScrolling = 'touch';
    modalEl.style.verticalAlign = 'middle';
    modalEl.innerHTML = $('#modal_maintenance').html();

    // show modal
    mui.overlay('on', options, modalEl);

    // disable scrolling and bounce effect on Safari iOS
    document.ontouchmove = function(e) {
        e.preventDefault();
        e.stopPropagation();
    }

}

// dismiss modal
function modalClose(modalDiv) {
    modalEl = document.getElementById(modalDiv);
    mui.overlay('off', modalEl);
    // enable scrolling and bounce effect on Safari iOS
    document.ontouchmove = function(e) {
        return true;
    }
}
