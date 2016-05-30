
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
  signedIn: function(){
    if(Meteor.userId()){
      Session.set("userid", Meteor.userId());
      return true;
    }else{
      return false;
    }
  }
});
Template.home.events({
  "click #btnNewPlant": function(event, template){
    if(!Session.get("newPlant")){
      Session.set("newPlant", true);
    }else{
      Session.set("newPlant", false);            
    }
  }
});


Template.show_logs.helpers({
  plants: function(){
    return PlantLog.find({user_id:Meteor.userId()});
  },
  newPlant: function(){
    return Session.get("newPlant");
  }
});
