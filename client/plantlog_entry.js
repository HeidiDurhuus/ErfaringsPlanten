
Template.plantlog_entries.helpers({
  plantlog: function(){
    return PlantLog.findOne({_id: Session.get("plantlog_id")});
  },
  getPlant:function(plantid){
    return Plants.findOne({_id:plantid})
  },
});

Template.plantlog_entries.events({
  "click #foo": function(event, template){

  }
});


/*The image should be saved only when all the other entries are saved*/
var dataUrl = null;
/*this date/timestamp is used to check if there is an entry begun */
var today = null;

Template.new_plantlog_entry.helpers({
  isEdited: function(){
    //if session....session logical or
    //console.log(" clickedText " + Session.get("clickedText") +" clickedScore "+ Session.get("clickedScore") + " clickedSoilMoist " + Session.get("clickedSoilMoist") + " hasImage " + Session.get("hasImage"));
    if(Session.get("clickedText") || Session.get("clickedScore") || Session.get("clickedSoilMoist") || Session.get("clickedImage")){
      return true;
    }
    return false;
  },
  clickedText: function(){
    if(Session.get("clickedText")){
      return true;
    }
    return false;
  },
  clickedScore: function(){
    if(Session.get("clickedScore")){
      return true;
    }
    return false;
  },
  clickedSoilMoist: function(){
    if(Session.get("clickedSoilMoist")){
      return true;
    }
    return false;
  },
  clickedImage: function(){
    if(Session.get("clickedImage")){
      return true;
    }
    return false;
  },
  today: function(){
    if(!today){
      today = new Date();
    }
    return today.getDate() + "/" + (today.getMonth() + 1) +"/"+ today.getFullYear();//today.parse("YYYY-MM-DD");
  },
  hasImage: function(){
    if(Session.get("gotImage")){
      return true;
    }
    return false;
  },
  image: function(){
//    console.log("image");
    return Session.get("imageUrl");
  }
});

Template.new_plantlog_entry.events({
/*
  "keyup #plantUpdate": function(event, template){
    Session.set("plantUpdate", true);
    console.log(event.currentTarget.value);
    document.getElementById("inputPlantUpdate").value = event.currentTarget.value
  }
*/
  "click #btnText": function(){
    event.preventDefault();
    Session.set("clickedText", true);
  },
  "click #btnScore": function(){
    event.preventDefault();
    Session.set("clickedScore", true);
  },
  "click #btnSoilmoist": function(){
    event.preventDefault();
    Session.set("clickedSoilMoist", true);
  },
  "click #btnImage": function(event){
    event.preventDefault();
    Session.set("clickedImage", true);
  },
  "change #selectImage": function(){
    file = event.target.files[0];
    if(!file){return;}

    var fileReader = new FileReader();
    fileReader.onload = function(event){
      dataUrl = event.target.result;
    }
    fileReader.readAsDataURL(file);
    Session.set("gotImage", true);
    Session.set("imageUrl", window.URL.createObjectURL(file));
  },
  "submit #saveEntry": function(event, template){
    event.preventDefault();

    var entry = {
      date: null,
      text: null,
      image: null,
      score: null,
      soilmoist: null
    };

    entry.date = today;
    entry.image = dataUrl;
    if(Session.get("clickedText")){
      entry.text = event.currentTarget.plantUpdate.value;
    }
    if(Session.get("clickedScore")){
      entry.score = getCheckedText(event.currentTarget.plantCondition);
    }
    if(Session.get("clickedSoilMoist")){
      entry.soilmoist = getCheckedText(event.currentTarget.soilMoist);
    }
    plantlog_id = this.id

    Meteor.call("insertPlantlogEntry", plantlog_id, entry, function(error, result){
      if(error){
        console.log(error);
      }
      if(result){
        console.log(result);
      }
    });
    Session.set("clickedText", false);
    Session.set("clickedImage", false);
    Session.set("clickedScore", false);
    Session.set("clickedSoilMoist", false);
  }
});

function getCheckedText(radios){
  for(var i = 0; i < radios.length; i++){
    if(radios[i].checked){
      return radios[i].nextSibling.data;
    }
  }
  return "no selection";
}


Template.plantlog_entry.helpers({
  getDate: function(date){
    if(date){
      return date.getDate() + "/" + (date.getMonth() + 1) +"/"+ date.getFullYear();
    }
    return "";
  },
});

Template.plantlog_entry.events({
  "click #foo": function(event, template){

  }
});
