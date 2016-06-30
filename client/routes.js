// set up the main template the the router will use to build pages
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

///////////////
/// ROUTING
///////////////

// specify the top level route, the page users see when they arrive at the site

Router.route('/', function () {
  this.render('home');
  }
);
Router.route('/faq', function () {
  this.render('faq');
  }
);
Router.route('/about', function () {
  this.render('about');
  }
);
