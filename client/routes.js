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

Router.route('/faq', function () {
  this.render("navbar", {to:"header"});
  this.render("faq", {to:"main"});
});
Router.route('/about', function () {
  this.render("navbar", {to:"header"});
  this.render("about", {to:"main"});
});

/*
Router.route('/new_plant_log', function () {
  this.render("navbar", {to:"header"});
  this.render("new_plant_log", {to:"main"});
});
*/
Router.route('/plantlog_details/:_id', function(){
  Session.set("plantlog_id", this.params._id);
  this.render("navbar", {to:"header"});
  this.render("plantlog_details", {to:"main"});
});
Router.route('/plantlog_entries/:_id', function(){
  Session.set("plantlog_id", this.params._id);
  this.render("navbar", {to:"header"});
  this.render("plantlog_entries", {to:"main"});
});
