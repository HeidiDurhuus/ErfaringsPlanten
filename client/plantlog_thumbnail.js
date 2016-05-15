/*
Template.show_plant.onCreated(function(){
  console.log("show_plant onCreated");
  this.openInsertLogEntry = new ReactiveVar(false);

});
*/
var clicked_id = null;

Template.plantlog_thumbnail.helpers({
  getPlant:function(plantid){
    return Plants.findOne({_id:plantid})
  },
  isEmpty: function(plantid){
    if(!plantid){
      return true;
    }
    return false;
  },
  hasImage:function(){
    if(!this.image){
      return false;
    }
    return true;
  },
  getDate: function(entries){
    var lastEntry = entries[entries.length-1];
    var date = lastEntry.date;
    if(date){
      return date.getDate() + "/" + (date.getMonth() + 1) +"/"+ date.getFullYear();
    }
    return "";
  },
  getText: function(entries){
    var lastEntry = entries[entries.length-1];
    return lastEntry.text;
  },
  getSoilmoist: function(entries){
    var lastEntry = entries[entries.length-1];
    return lastEntry.soilmoist;
  },
  getScore: function(entries){
    var lastEntry = entries[entries.length-1];
    return lastEntry.score;
  },
});

Template.plantlog_thumbnail.events({
  "change .js-upload-image": function(event, template){
    event.preventDefault();
    var id = clicked_id;
    console.log(id);
    var file = event.target.files[0];
    if(!file){return;}

    var fileReader = new FileReader();
    var dataUrl;
    fileReader.onload = function(event){
      dataUrl = event.target.result;
      Meteor.call("saveFile", dataUrl, id);
    }
    fileReader.readAsDataURL(file);
    clicked_id = null;
  },
  "click .js-register-click": function(event, template){
    if(!clicked_id){
      clicked_id = event.currentTarget.id;
    }
  }
});
