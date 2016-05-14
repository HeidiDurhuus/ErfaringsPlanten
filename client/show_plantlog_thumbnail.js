/*
Template.show_plant.onCreated(function(){
  console.log("show_plant onCreated");
  this.openInsertLogEntry = new ReactiveVar(false);

});
*/
var clicked_id = null;

Template.show_plantlog_thumbnail.helpers({
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
  }
});

Template.show_plantlog_thumbnail.events({
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
