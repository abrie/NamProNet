$("#page-login").on('pagecreate', function(){
    console.log("logout page created.");

    if( isAuthorized() ) {
        $("#logout-btn").click( doLogout );
    }
});
