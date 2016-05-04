if (Meteor.isClient) {

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



Template.show_insert_log_entry.helpers({
  create: function(){
    console.log("show_insert_log_entry create");
  },
  rendered: function(){
    console.log("show_insert_log_entry rendered");
  },
  destroyed: function(){
    console.log("show_insert_log_entry destroyed");
  },
  getPlantId: function(){
    console.log(this._id);
     console.log("plant id " + this._id);
  }
});

Template.show_insert_log_entry.events({
  "submit .js-new-entry-plantlog": function(event){
    event.preventDefault();
    var date = getCheckedText(event.target.plantLogDate);
    if(date == " I dag"){
      date = new Date();
    }
    else{
      date = new Date((Number(date.substring(6))+2000), (date.substring(3,5)-1), date.substring(0,2));
    }
     var plant_update = event.target.plantUpdate.value;
     var plant_condition = getCheckedText(event.target.plantCondition);
     var plantid = this._id;

     console.log("date:" + date );
     console.log("plant_update: " + plant_update);
     console.log("plant_condition: " + plant_condition);
     console.log("plantid: " + plantid);
     //var entry = []
     /*her skal lægges ind i databasen et nyt object sidst i tabellen ($push)*/
     PlantLog.update({_id:plantid}, {$push: { entries: {date: date, plant_update: plant_update, plant_condition: plant_condition}}});
  }
});

}
