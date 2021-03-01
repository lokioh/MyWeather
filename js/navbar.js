
window.onscroll = function () {


    if($(this).scrollTop() > 100){
        $('.nav').addClass('sticky');
        $('#logoNav').css('visibility', 'visible');
    } else{
        $('.nav').removeClass('sticky');
        $('#logoNav').css('visibility', 'hidden');
    }
};