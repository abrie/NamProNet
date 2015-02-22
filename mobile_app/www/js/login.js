$("#page-login").on('pagecreate', function(){
    console.log("login page created.");

    window.localStorage["email"] = "a@a.a";
    window.localStorage["password"] = "123456789";

    if( isAuthorized() ) {
        $.mobile.changePage("profile.html");
    }
    else {
        $("#btn-submit").click( doLogin );
    }
});
