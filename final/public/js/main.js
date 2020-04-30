//Project: Aurora
//Group: DM Web Dev Team
//TMs: Maya Bonazarovaarova, Louise Findlay, Miriam Wojcik, Brandon Reid
//Date: 2/3/2020
//Main JS


/* DOM Manipulation */

// Function called on page load to manage the nav bar
$(document).ready(function () {

    // Hide div with image that stores uploaded photo variable
    $("#ejs-variable").hide();

    // Show/Hide different navs and icons for hamburger menu
    $(".fa-bars").click(function () {
        $("#menu").show();
    });

    $(".fa-times").click(function () {
        $("#menu").hide();
    });

    // Table Styling
    $('table tr').each(function () {
        $(this).find('th').first().addClass('first');
        $(this).find('th').last().addClass('last');
        $(this).find('td').first().addClass('first');
        $(this).find('td').last().addClass('last');
    });

    $(".leaflet-popup-content img").attr('id', 'uploadedphoto');

    // Change input file text to name of file
    $('#upload-aurora').change(function() {
         $("#upload-aurora-label").text(this.files[0].name);
});
    $('#upload-profile').change(function() {
         $("#upload-profile-label").text(this.files[0].name);
});

});



//function to load aurora status
function loadAurora(){

    //link to aurora watch status
    var mobile_content = '<iframe id ="status-frame" scrolling="no" allowtransparency="true" src="https://aurorawatch.lancs.ac.uk/external/status_text"></iframe>';
    //link to aurora watch status and solar activity plots
    var other_devices = '<div class = "frame-cont"><iframe id="plot-frame" scrolling="no" allowtransparency="true" width="550" height="480" src="https://aurorawatch.lancs.ac.uk/external/rolling_status_text"></iframe></div>';

    //function to load an appriopriate content
    function loadStatus() {
        //on mobile devices display only the aurora watch uk alert status
        if (window.innerWidth < 1280) {
            document.getElementById('aurora_status').innerHTML = mobile_content;
        }
        //on bigger screens display the plots provided by aurora watch uk
        else {
            document.getElementById('aurora_status').innerHTML = other_devices;
        }
    }
    loadStatus();
    //detect change of the screen size and reload the appropriate element
    window.addEventListener('resize', loadStatus);
}


//hash the password on client-side
$(document).ready(function(){
$('#myForm').on('submit', function(){
 var pass = $('#rpassword').val();
var pass_conf = $('#rpassConf').val();
$('#rpassword').val(CryptoJS.MD5(pass).toString());
$('#rpassConf').val(CryptoJS.MD5(pass_conf).toString());
});
    $('#passChange').on('submit', function(){
 var pass = $('#newPwd').val();
var pass_conf = $('#newPwdConf').val();
$('#newPwd').val(CryptoJS.MD5(pass).toString());
$('#newPwdConf').val(CryptoJS.MD5(pass_conf).toString());
});
    
      $('#login-form').on('submit', function(){
 var pass = $('#lpassword').val();
$('#lpassword').val(CryptoJS.MD5(pass).toString());
});
                });


