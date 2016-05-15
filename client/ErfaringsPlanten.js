
//////////////////
/// SUBSCRIPTION
/////////////////

Meteor.subscribe("plantlog");
Meteor.subscribe("plants");

/////////////////
/// GLOBAL VARIABLES
////////////////
var map = null;

//////////////////
/// TEMPLATES
/////////////////


Template.home.helpers({
  create: function(){
    console.log("home created");
  },
  rendered: function(){
    console.log("home rendered");
  },
  destroyed: function(){
    console.log("home destroyed");
  },
  signedIn: function(){
    if(Meteor.userId()){
      Session.set("userid", Meteor.userId());
      return true;
    }else{
      return false;
    }
  }
});



Template.show_logs.helpers({
  plants: function(){
    return PlantLog.find({user_id:Meteor.userId()});
  }
});
