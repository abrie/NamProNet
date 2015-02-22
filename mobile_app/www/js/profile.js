$(document).on('pageinit', function(){
    console.log("running profile get");
    var jqxhr = $.get(
            "http://192.168.178.244:3000/profile",
            {user:window.localStorage["email"]},
            function(data) {
                console.log(data);
        })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        alert( "error" );
    });
});
