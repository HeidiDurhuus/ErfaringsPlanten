/*
 The logic:
 always one 'extra' plant where name not chosen

 Solution template db-driven
 there is somehow always one new_plant at the end...
 when this one has a plantid, somehow create a new new_plant
 how to register that a new should be created?
 When a plant is chosen, a plantlog.insert({plantid: plantid, userId: userId}) is made.
 This causes the helper to rerun, therefor now that plant comes from the database.
 Is it possible and plausible to merge show_plant and new_plant?
 Must somehow pass a variable to the template to fire a "has no plant selected" - check if cursor is empty??
*/
Template.new_plant.rendered = function(){
  AutoCompletion.init("input#searchbox");
}

Template.new_plant.helpers({
  plants:function(){
    return Plants.find();
  },
  isSelected: function(){
    return Session.get("isSelected");
  },
  hasImage: function(){
    return false;
  },
  hasEntry: function(){
    return false;
  },
});

Template.new_plant.events({
  "keyup input#searchbox": function(){
    AutoCompletion.autocomplete({
      element: 'input#searchbox',
      collection: Plants,
      field: 'da',
      limit: 8,
      sort: {da: 1}
    });
  },
  "click .js-select-plant": function(event){
    event.preventDefault();
    var string = document.getElementById("searchbox").value
    var get_plant_id = Plants.findOne({da:string});
    if(get_plant_id){
      var plant_id = get_plant_id._id;
      Meteor.call("insertNewPlantLog", plant_id, function(error){
        if(error){
          console.log("error", error);
        }
      });
    }
    document.getElementById("searchbox").value = "";
  },
});
