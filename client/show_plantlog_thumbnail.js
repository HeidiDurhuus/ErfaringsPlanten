/*
Template.show_plant.onCreated(function(){
  console.log("show_plant onCreated");
  this.openInsertLogEntry = new ReactiveVar(false);

});
*/

Template.show_plantlog_thumbnail.helpers({
  getPlant:function(plantid){
    return Plants.findOne({_id:plantid})
  },
  isEmpty: function(plantid){
    if(!plantid){
      return true;
    }
    return false;
  }
  /*,
  plants:function(){
    return Plants.find();
  }*/,
  hasImage:function(){
    //console.log(this);

    if(!this.image){
      return false;
    }
    return true;
  }
});

Template.show_plantlog_thumbnail.events({
  "change .js-upload-image": function(event, template){
    //console.log("upload");
    //console.log(event.currentTarget.id);
    var id = event.currentTarget.id;
    var file = event.target.files[0];
    //console.log(file);
    if(!file){return;}

    var fileReader = new FileReader();
    var dataUrl;
    fileReader.onload = function(event){
      dataUrl = event.target.result;
      Meteor.call("saveFile", dataUrl, id);
    }
    fileReader.readAsDataURL(file);
  }
});

/*
Template.show_plant.helpers({
  getDate: function(date){
    if(date){
    //  console.log(date);
      var month = date.getMonth(); // giver en exception når bruger ikke har valgt dato. Det skal gøres obligatorisk at vælge dato.
      month = month + 1;
      return date.getDate() + "/" + month + "/" + date.getFullYear();
    }
    return undefined;
  },
  updatePlantlog: function(){
    console.log("updatePlantlog function");
    return Template.instance().openInsertLogEntry.get();
  },
  getPlant:function(plantid){
    return Plants.findOne({_id:plantid})
  }
});

Template.show_plant.events({
  "click .js-update-plantlog": function(event, template){
    event.preventDefault();
    console.log("show_plant");
    if(Template.instance().openInsertLogEntry.get()){
      Template.instance().openInsertLogEntry.set(false);
      console.log("was true, now " + Template.instance().openInsertLogEntry.get());
    }else{
      Template.instance().openInsertLogEntry.set(true);
      console.log("was false, now " + Template.instance().openInsertLogEntry.get());
    }
  },
  "change .js-upload-image": function(event, template){
    console.log("upload");
  },
  "change input[type=file]": function(event, template){
    event.preventDefault();
    console.log("test " + event.currentTarget);
  },
  "change .js-test": function(event){
    //event.preventDefault();
    console.log("js-test");
  },
  "click .js-open-eye": function(){
    console.log("eye");
  }
});
*/
