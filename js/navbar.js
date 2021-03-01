
window.onscroll = function () {
    if($(this).scrollTop() > 100){
        $('.nav').addClass('sticky')
        $('nav').addClass('logo')
    } else{
        $('.nav').removeClass('sticky')
        $('nav').removeClass('logo')
    }
};