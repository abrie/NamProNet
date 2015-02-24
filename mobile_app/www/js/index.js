var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        pageInit.inits["page-profile"] = profileInit;
        pageInit.inits["page-profile-search"] = profileSearchInit;
        pageInit.inits["page-profile-list"] = profileListInit;
        pageInit.inits["page-login"] = loginInit;
        pageInit.inits["page-logout"] = logoutInit;
        pageInit.inits["page-register"] = registerInit;
        pageInit.inits["page-job-list"] = jobListInit;
        pageInit.inits["page-job-create"] = jobCreateInit;
        $("body").pagecontainer({
              change: function( e, data ) {
                  var pageId = data.toPage[0].id;
                  pageInit.run(pageId, data.options.extra);
              }
        });
    },
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

var pageInit = {
    inits: {},
    targetFunction: function() { console.log("default"); },
    run: function(id, extra) { 
        var func = this.inits[id];
        if( func !== undefined ) {
            this.inits[id](extra); 
        }
        else {
            console.log("no pageChange event for:", id);
        }
    },
};

app.initialize();

function servicePath(path, format) {
    var result = "http://192.168.178.116:3000/" + path;
    if( format !== undefined ) {
        result = result + "." + format;
    }

    return result;
}

function getAuthorizedCredentials() {
    return {
        email: window.localStorage.getItem("email"),
        password: window.localStorage.getItem("password")
    };
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
    var password_confirmation = $("#register-confirm-password").val();

    var data = {
        user:{
            email:email,
            password:password,
            password_confirmation:password_confirmation,
        }
    };

    var jqxhr = $.ajax({
        type: "POST",
        url: servicePath("users","json"),
        data: data
        })
        .done(function( result ) {
            storeAuthorization(email, password);
            $("body").pagecontainer("change", "profile.html");
        })
        .fail(function(xhr, textStatus, errorThrown) {
            if( xhr.responseJSON ) {
                var errors = xhr.responseJSON.errors;
                for(var error in errors) {
                    for(var index = 0; index < errors[error].length; index++) {
                        var li = $("<li>").html(error + " " + errors[error][index]); 
                        $("#message-registration-failed").append(li);
                    }
                }
                $("#dlg-invalid-registration").popup("open");
            }
            else {
                alert("request failed:", textStatus);
            }
        });
}

function doJobCreate() {
    var credentials = getAuthorizedCredentials();

    var job = {
        summary: $("#job-summary").val(),
        town : $("#select-town").val(),
        region : $("#select-region").val(),
        specialty : $("#select-specialty").val(),
    };

    var jqxhr = $.ajax({
        type: "POST",
        url: servicePath("job","json"),
        data: {email:credentials.email, job:job} 
        })
        .done(function( result ) {
            console.log(result);
        })
        .fail(function(xhr, textStatus, errorThrown) {
            console.log(xhr, textStatus, errorThrown);
        });
}

function jobCreateInit(extras) {
        $("#job-create-submit-btn").click( doJobCreate );
}

function jobListInit(extras) {
    var credentials = getAuthorizedCredentials();
    var jqxhr = $.ajax({
        type: "GET",
        url: servicePath("jobs","json"),
        data: {email:credentials.email} 
        })
        .done(function( result ) {
            var jobs = result.jobs;
            console.log(jobs);
            var ul = $("#jobs-list");
            for(var index = 0; index < jobs.length; index++) {
                var job = jobs[index];
                $("<li>").html(job.creator + ":" + job.summary).appendTo(ul);
            }
        })
        .fail(function(xhr, textStatus, errorThrown) {
            console.log(xhr, textStatus, errorThrown);
        });
}

function registerInit(extras) {
    if( isAuthorized() ) {
        $.mobile.changePage("logout.html");
    }
    else {
        $("#register-submit-btn").click( doRegistration );
    }
}

function logoutInit(extras) {
    if( isAuthorized() ) {
        $("#logout-btn").click( doLogout );
    }
}

function loginInit(extras) {
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

    $.post(
        servicePath("users/sign_in", "json"),
        credentials,
        function(result) {
            storeAuthorization(email, password);
            $("body").pagecontainer("change", "profile.html");
        })
        .fail(function(xhr, textStatus, errorThrown) {
            removeAuthorization();
            if( xhr.responseJSON ) {
                var message = xhr.responseJSON.error;
                $("#message-login-failed").html(message);
                $("#dlg-invalid-credentials").popup("open");
            }
            else {
                alert("request failed:", textStatus);
            }
        });
}

function profileInit(extras) {
    console.log("profile page change");
    var credentials = getAuthorizedCredentials();
    requestProfile( credentials.email, populateProfile );

    $("#profile-update-btn").click( function() {
        updateProfile(); 
    });
}

function profileSearchInit(extras) {
    console.log("profile search change");

    $("#profile-search-submit-btn").click( function() {
        doProfileSearch(); 
    });
}

function profileListInit(extra) {
    console.log("profile list change");
    results = extra.results;
    ul = $("#profile-list");
    for( var index = 0; index < results.length; index++ ) {
        var profile = results[index];
        $("<li>").html(profile.last_name + ", " + profile.first_name).appendTo(ul);
    } 
}

function doProfileSearch() {
    var criteria = {
        town : $("#select-town").val(),
        region : $("#select-region").val(),
        specialty : $("#select-specialty").val(),
    };

    var jqxhr = $.ajax({
        type: "GET",
        url: servicePath("profile/search"),
        data: {criteria:criteria}, 
        })
        .done(function( result ) {
            console.log(result);
            $("body").pagecontainer("change", "profile-list.html", {extra:result});
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown, jqXHR);
            alert( "network error while updating profile" );
        });
}

function populateProfile(email, profile) {
    $("#profile-firstname").val(profile.first_name);
    $("#profile-lastname").val(profile.last_name);
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
        first_name: $("#profile-firstname").val(),
        last_name: $("#profile-lastname").val(),
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
