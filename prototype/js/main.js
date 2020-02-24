$(document).ready(function () {

    $(".fa-bars").click(function () {
        $("header .icon").hide();
        $("#menu").show();
    });

    $(".fa-times").click(function () {
        $("#menu").hide();
        $("header .icon").show();
    });

});
