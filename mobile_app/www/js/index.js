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
        pageInit.inits["page-profile"] = profileInit;
        pageInit.inits["page-login"] = loginInit;
        pageInit.inits["page-logout"] = logoutInit;
        $("body").pagecontainer({
              change: function( event, ui ) {
                  var pageId = ui.toPage[0].id;
                  pageInit.run(pageId);
              }
        });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

var pageInit = {
    inits: {},
    targetFunction: function() { console.log("default"); },
    run: function(id) { 
        var func = this.inits[id];
        if( func !== undefined ) {
            this.inits[id](); 
        }
        else {
            console.log("no pageChange event for:", id);
        }
    },
};

app.initialize();

function servicePath(path) {
    return "http://192.168.178.116:3000/" + path;
}

function isAuthorized() {
    var email = window.localStorage.getItem("email");
    var password = window.localStorage.getItem("password");
    return email !== null && password !== null;
}

function storeAuthorization(email, password) {
    window.localStorage.setItem("email", email);
    window.localStorage.setItem("password", password);
}

function removeAuthorization() {
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("password");
}

function mockAuthorization() {
    storeAuthorization("a@a.a", "123456789");
}

function doLogout() {
    var jqxhr = $.ajax({
        type: "DELETE",
        url: servicePath("users/sign_out")})
        .done(function( result ) {
            removeAuthorization();
            $("body").pagecontainer("change", "index.html");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown, jqXHR);
            alert( "error while logging out" );
        });
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

function logoutInit() {
    if( isAuthorized() ) {
        $("#logout-btn").click( doLogout );
    }
}

function loginInit() {
    console.log("login page changed.");
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
            $("body").pagecontainer("change", "profile.html");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            removeAuthorization();
            console.log(textStatus, errorThrown);
            alert( "error" );
        });
}

function profileInit() {
    console.log("profile page change");
    requestProfile( window.localStorage["email"], populateProfile );

    $("#profile-update-btn").click( function() {
        updateProfile(); 
    });
}

function populateProfile(email, profile) {
    $("#profile-email").val(email);
    $("#profile-dob").val(profile.dob);
    $("#profile-skills").val(profile.skills);
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
