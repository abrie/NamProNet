$(document).on('pageinit', function(){
    console.log("running post");
    var jqxhr = $.post(
            "http://192.168.178.244:3000/users/sign_in",
            {user:{email:"a@a.a", password:"123456789"}},
        function(result) {
            $.mobile.changePage("profile.html");
        })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        alert( "error" );
    })
});
