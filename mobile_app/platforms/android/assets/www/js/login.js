$("#page-login").on('pagecreate', function(){
    $("#btn-submit").click( doLogin );

    function doLogin() {
        var email = $("#txt-email").val();
        var password = $("#txt-password").val();
        var jqxhr = $.post(
                "http://192.168.178.244:3000/users/sign_in",
                {user:{email:email, password:password}},
            function(result) {
                window.localStorage["email"] = email;
                $.mobile.changePage("profile.html");
            })
        .fail(function(jqXHR, textStatus, errorThrown) {
            window.localStorage["email"] = undefined;
            console.log(textStatus, errorThrown);
            alert( "error" );
        });
    }
});
