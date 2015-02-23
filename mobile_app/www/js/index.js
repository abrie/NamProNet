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
    return "http://192.168.178.116:3000/" + path;
}

function isAuthorized() {
    var hasEmail = window.localStorage.email !== "undefined";
    var hasPassword = window.localStorage.password !== "undefined";
    return hasEmail && hasPassword;
}

function storeAuthorization(email, password) {
    window.localStorage["email"] = email;
    window.localStorage["password"] = password;
}

function removeAuthorization() {
    window.localStorage["email"] = undefined;
    window.localStorage["password"] = undefined;
}

function mockAuthorization() {
    window.localStorage["email"] = "a@a.a";
    window.localStorage["password"] = "123456789";
}

function doLogout() {
    console.log("logout requested...");
}

function doRegistration() {
    var email = $("#register-email").val();
    var password = $("#register-password").val();
    var confirm_password = $("#register-confirm-password").val();
    var credentials = {
        user:{
            email:email,
            password:password,
            confirmation_password:confirmation_password
        }
    };
    console.log(credentials);
}

function doLogin() {
    var email = $("#login-email").val();
    var password = $("#login-password").val();
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
    console.log(profile);
    $("#profile-email").val(email);
    $("#select-town").val(profile.town).change();
    $("#select-region").val(profile.region).change();
    $("#select-specialty").val(profile.specialty).change();
}

function updateProfile() {
    var email = $("#profile-email").val();
    var profile = {
        town : $("#select-town").val(),
        region : $("#select-region").val(),
        dob : $("#profile-dob").val(),
        specialty : $("#select-specialty").val(),
        skills : $("#profile-skills").val(),
    };

    var jqxhr = $.ajax({
        type: "PUT",
        url: servicePath("profile"),
        data: {email:email, profile:profile}, 
        })
        .done(function( result ) {
            populateProfile(result.email, result.profile);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown, jqXHR);
            alert( "network error while updating profile" );
        });
}

function requestProfile(email, callback) {
    console.log("requesting profile.");
    var jqxhr = $.get(
        servicePath("profile"),
        {email:email},
        function(data) {
            console.log("profile received.");
            callback(email, data.profile);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown, jqXHR);
            alert( "network error while requesting profile" );
        });
}
