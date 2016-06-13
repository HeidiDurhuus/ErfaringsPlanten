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
  }, {
    data: function(){
      console.log("Router returns plantlog for " + Meteor.userId());
      return PlantLog.find({user_id:Meteor.userId()});
    },
    subscriptions: function(){
      Meteor.subscribe("plantlog");
      //Meteor.subscribe("plants");
    }
});
Router.route('/faq', function () {
  this.render('faq');
  }
);
Router.route('/about', function () {
  this.render('about');
  }
);
Router.route('/plantlog_details/:_id', function () {
  this.render('plantlog_details');
  }, {
    data: function(){
      var plantlog_id = this.params._id;
      return PlantLog.findOne({_id: plantlog_id });
    },
    subscriptions: function(){
      Meteor.subscribe("one-plantlog", this.params._id);
    }
});
Router.route('/plantlog_entries/:_id', function () {
  this.render('plantlog_entries');
  }, {
    data: function(){
      return PlantLog.findOne({_id: this.params._id});
    },
    subscriptions: function(){
      Meteor.subscribe("one-plantlog", this.params._id);
    }
});
Router.route('/plantsamples/:plant_id', function () {
  this.render('plantsamples');
  }, {
    data: function(){
      var sample_list = this.params.plant_id;
      return PlantLog.find({plant_id: sample_list}).fetch();
    },
    subscriptions: function(){
      return Meteor.subscribe("plant-samples", this.params.plant_id);
    },
});
