$(document).ready(function () {

    $(".fa-bars").click(function () {
        $(".icon").hide();
        $("#menu").show();
    });

    $(".fa-times").click(function () {
        $("#menu").hide();
        $(".icon").show();
    });

});
