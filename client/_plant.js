Template.show_plant.onCreated(function(){
  console.log("show_plant onCreated");
  this.openInsertLogEntry = new ReactiveVar(false);

});


Template.show_plant2.helpers({
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },
});

Template.show_plant2.events({
  "click #foo": function(event, template){

  }
});

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
  }
});
