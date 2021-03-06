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
        pageInit.inits["page-config"] = configInit;
        pageInit.inits["page-front"] = frontInit;
        pageInit.inits["page-profile-show"] = profileShowInit;
        $("body").pagecontainer({
              change: function( e, data ) {
                  var pageId = data.toPage[0].id;
                  pageInit.run(pageId, data.options.extra);
              }
        });

        var initialPageId = $('body').pagecontainer( 'getActivePage' ).attr( 'id' );
        pageInit.run(initialPageId);

    },
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

function frontInit(extras) {
    var btn = $("#home-search-submit-btn");
    btn.off('click');
    btn.click(doProfileSearch);
}

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

function getConfigSettings() {
    return {
        protocol: "http",
        server: window.localStorage.getItem("server"),
        port: window.localStorage.getItem("port")
    };
}

function servicePath(path, format) {
    config = getConfigSettings();
    var result = config.protocol+"://"+config.server+":"+config.port+"/" + path;
    if( format !== undefined ) {
        result = result + "." + format;
    }

    console.log("servicePath:", result);
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

function doConfig() {
    var protocol = $("#config-protocol").val();
    var server = $("#config-server").val();
    var port = $("#config-port").val();
    window.localStorage.setItem("protocol", protocol);
    window.localStorage.setItem("server", server);
    window.localStorage.setItem("port", port);
    $("body").pagecontainer("change", "index.html");
}

function doLogout() {
    var jqxhr = $.ajax({
        type: "DELETE",
        url: servicePath("users/sign_out")})
        .done(function( result ) {
            console.log("sucessfully logged out.");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown, jqXHR);
        })
        .always(function(){
            removeAuthorization();
            $("body").pagecontainer("change", "index.html");
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

function configInit(extras) {
    var currentConfig = getConfigSettings();
    $("#config-protocol").val(currentConfig.protocol);
    $("#config-server").val(currentConfig.server);
    $("#config-port").val(currentConfig.port);
    $("#config-submit-btn").click( doConfig );
}

function jobCreateInit(extras) {
    $("#job-create-submit-btn").off('click');
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
        $("#register-submit-btn").off('click');
        $("#register-submit-btn").click( doRegistration );
    }
}

function logoutInit(extras) {
    if( isAuthorized() ) {
        $("#logout-btn").off('click');
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
        $("#login-submit-btn").off('click');
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
                alert("network:", textStatus);
                $("body").pagecontainer("change", "profile.html");
            }
        });
}

function profileShowInit(extras) {
    var profile = extras.profile;
    $("#profile-firstname").html(profile.first_name);
    $("#profile-lastname").html(profile.last_name);
    $("#profile-skills").html(profile.skills);
    $("#profile-show-town").html(profile.town);
    $("#profile-show-region").html(profile.region);
    $("#profile-show-specialty").html(profile.specialty);
}

function profileInit(extras) {
    console.log("profile page change");
    var credentials = getAuthorizedCredentials();
    requestProfile( credentials.email, populateProfile );

    $("#profile-update-btn").off('click');
    $("#profile-update-btn").click( function() {
        updateProfile(); 
    });
}

function profileSearchInit(extras) {
    console.log("profile search change");

    $("#profile-search-submit-btn").off('click');
    $("#profile-search-submit-btn").click( function() {
        doProfileSearch(); 
    });
}

function getFakeProfileSearchResults() {
    var results = [];
    function fakeResult(first_name, last_name, specialty, region, town, certified) {
        return {
            first_name:first_name,
            last_name:last_name,
            specialty:specialty,
            region:region,
            town:town,
            certified:certified
        };
    }
    results.push(fakeResult("a","b","c","d","e", false));
    results.push(fakeResult("a1","b2","c2","dd","ed", true));
    results.push(fakeResult("a3","bd","c2","dd","ed", false));
    return {results:results};
}

function profileListInit(extra) {
    console.log("profile list change");
    results = extra.results;
    $("#profile-table-body").empty();
    function getEventHandlerFunction(p) {
        return function() {
            $("body").pagecontainer("change", "profile-show.html", {extra:{profile:p}});
        };
    }
    for( var index = 0; index < results.length; index++ ) {
        var profile = results[index];
        var tr = $("<tr>");
        $("<td>").html(profile.first_name).appendTo(tr); 
        $("<td>").html(profile.last_name).appendTo(tr); 
        $("<td>").html(profile.specialty).appendTo(tr); 
        $("<td>").html(profile.region).appendTo(tr); 
        $("<td>").html(profile.town).appendTo(tr); 
        if( profile.certified ) {
            tr.css({'background':'#82FA58'});
        }


        tr.bind('click', getEventHandlerFunction(profile) );
        $("#profile-table-body").append(tr);
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
            alert( "network error while requesting search" );
            $("body").pagecontainer("change", "profile-list.html", {extra:getFakeProfileSearchResults()});
        });
}

function populateProfile(email, profile) {
    $("#profile-firstname").val(profile.first_name);
    $("#profile-lastname").val(profile.last_name);
    $("#profile-email").val(email);
    $("#profile-dob").val(profile.dob);
    $("#profile-skills").val(profile.skills);
    $("#profile-town").val(profile.town).change();
    $("#profile-region").val(profile.region).change();
    $("#profile-specialty").val(profile.specialty).change();
}

function updateProfile() {
    var email = $("#profile-email").val();
    var profile = {
        first_name: $("#profile-firstname").val(),
        last_name: $("#profile-lastname").val(),
        town : $("#profile-town").val(),
        region : $("#profile-region").val(),
        dob : $("#profile-dob").val(),
        specialty : $("#profile-specialty").val(),
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
