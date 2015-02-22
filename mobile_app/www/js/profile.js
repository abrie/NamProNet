$("#page-profile").on('pagecreate', function(){
    console.log("profile page created");

    requestProfile( window.localStorage["email"], populate );

    function populate(email, profile) {
        $("#txt-email").val(email);
        $("#select-region option").each( function() {
            if($(this).text() == profile.region) {
                $(this).attr('selected','selected');
            }
        });

        $("#select-town option").each( function() {
            if($(this).text() == profile.town) {
                $(this).attr('selected','selected');
            }
        });
    }

    function requestProfile(email, callback) {
        var jqxhr = $.get(
                "http://192.168.178.244:3000/profile",
                {email:email},
                function(data) {
                    callback(email, data.profile);
            })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert( "error" );
        });
    }
});
