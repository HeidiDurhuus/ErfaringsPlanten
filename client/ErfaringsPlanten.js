
//////////////////
/// SUBSCRIPTION
/////////////////

Meteor.subscribe("plantlog");
Meteor.subscribe("plants");

/////////////////
/// GLOBAL VARIABLES
////////////////
var map = null;

//et objekt der holder styr på hvilken visning der skal vises
//detaljer, entry osv, samt hvilken _id planten har
open_close = {};
//////////////////
/// TEMPLATES
/////////////////

Template.home.onCreated(function(){
  this.newPlant = new ReactiveVar(false);
/*
  this.gapState = new ReactiveVar(false);
  this.gapId = new ReactiveVar(null);
  this.gapView = new ReactiveVar(null);*/
  this.openIndex = new ReactiveVar(null);

});

Template.home.helpers({
  signedIn: function(){
    if(Meteor.userId()){
      Session.set("userid", Meteor.userId());
      return true;
    }else{
      return false;
    }
  },
  plants: function(){
    return PlantLog.find({user_id:Meteor.userId()});
  },
  newPlant: function(){
    return Template.instance().newPlant.get();
  },/*
  openDetails: function(){
    //return Template.instance().plantlog_details.get();
    return false;
  },
  gapState: function(){
    return Template.instance().gapState;
  },
  gapId: function(){
    return Template.instance().gapId;
  },
  gapView: function(){
    return Template.instance().gapView;
  },*/
  openIndex: function(){
    console.log(Template.instance().openIndex);
    return Template.instance().openIndex;
  }
});

Template.home.events({
  "click #btnNewPlant": function(event, template){
/*
    console.log("clicked");
    console.log(template);*/
    if(!template.newPlant.get()){
      template.newPlant.set(true);
    }else{
      template.newPlant.set(false);
    }
  }
});

Template.gap.helpers({
  openGap: function(){
    if(this.gapIndex == this.openIndex.get()){
      return true;
    }
    return false;
  }});

Template.gap.events({
  "click #foo": function(event, template){

  }
});
