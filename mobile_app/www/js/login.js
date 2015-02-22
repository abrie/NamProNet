$("#page-login").on('pagecreate', function(){
    console.log("login page created.");

    mockAuthorization();

    if( isAuthorized() ) {
        $.mobile.changePage("profile.html");
    }
    else {
        $("#login-submit-btn").click( doLogin );
    }
});
