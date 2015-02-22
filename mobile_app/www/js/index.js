var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();

function servicePath(path) {
    return "http://192.168.178.244:3000/" + path;
}

function isAuthorized() {
    var email = window.localStorage["email"];
    var password = window.localStorage["password"];
    return email !== undefined && password !== undefined;
}

function storeAuthorization(email, password) {
    window.localStorage["email"] = email;
    window.localStorage["password"] = password;
}

function removeAuthorization() {
    window.localStorage["email"] = undefined;
    window.localStorage["password"] = undefined;
}

function doLogin() {
    var email = $("#txt-email").val();
    var password = $("#txt-password").val();
    var credentials = {user:{email:email, password:password}};

    var jqxhr = $.post(
        servicePath("users/sign_in"),
        credentials,
        function(result) {
            storeAuthorization(email, password);
            $.mobile.changePage("profile.html");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            removeAuthorization();
            console.log(textStatus, errorThrown);
            alert( "error" );
        });
}

function populateProfile(email, profile) {
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
        servicePath("profile"),
        {email:email},
        function(data) {
            callback(email, data.profile);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown, jqXHR);
            alert( "network request failed" );
        });
}
