if(Meteor.isClient){


// set up the main template the the router will use to build pages
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

///////////////
/// ROUTING
///////////////

// specify the top level route, the page users see when they arrive at the site
Router.route('/', function () {
  this.render("navbar", {to:"header"});
  this.render("home", {to:"main"});
});

Router.route('/new_plant_log', function () {
  this.render("navbar", {to:"header"});
  this.render("new_plant_log", {to:"main"});
});
}
