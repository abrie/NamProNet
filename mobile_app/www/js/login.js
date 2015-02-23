$("#page-login").on('pageinit', function(){
    console.log("login page here.");
    /* these calls are for development purposes */
    //removeAuthorization();
    //mockAuthorization();
    /********************************************/

    if( isAuthorized() ) {
        console.log("previously authorized, skipping to profile.");
        $.mobile.changePage("profile.html");
    }
    else {
        $("#login-submit-btn").click( doLogin );
    }
});
