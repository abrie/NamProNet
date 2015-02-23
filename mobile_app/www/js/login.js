$("#page-login").on('pagecreate', function(){
    console.log("login page created.");

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
