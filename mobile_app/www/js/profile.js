$("#page-profile").on('pagecreate', function(){
    console.log("profile page created");
    requestProfile( window.localStorage["email"], populateProfile );
});
