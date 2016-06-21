
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
  this.newPlant = new ReactiveVar(false); //show/hide new_plant
  this.gapId = new ReactiveVar(null);     //the plantlog_id of the thumbnail of which details or entries will be shown for
  this.gapView = new ReactiveVar(null);   //which button the user pressed: btnDetails, btnEntries...
  this.openIndex = new ReactiveVar(null); //which template instance should be shown (positioned on the row below the selected thumbnail - taken into account how many columns there are, depending on web, mobile etc)
  this.itemsCount = new ReactiveVar(null);//number of records in plantlog (=number of thumbnails)
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
    var plantlog_cursor = PlantLog.find({user_id:Meteor.userId()});
    Template.instance().itemsCount.set(plantlog_cursor.count());
    return plantlog_cursor; //PlantLog.find({user_id:Meteor.userId()});
  },
  newPlant: function(){
    return Template.instance().newPlant.get();
  },
  itemsCount: function(){
    return Template.instance().itemsCount;
  },
  gapId: function(){
    return Template.instance().gapId;
  },
  gapView: function(){
    return Template.instance().gapView;
  },
  openIndex: function(){
    //console.log(Template.instance().openIndex);
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
  },
  showDetails: function(){
    if(this.gapView.get() == "btnDetails"){
      return true;
    }
    else {
      return false;
    }
  },
  showEntries: function(){
    if(this.gapView.get() == "btnEntries"){
      return true;
    }else {
      return false;
    }

  },
  showSamples: function(){

  },
  gapId: function(){
    console.log(this.gapId.get());
    return this.gapId.get();
  }

});

Template.gap.events({
  "click #foo": function(event, template){

  }
});
