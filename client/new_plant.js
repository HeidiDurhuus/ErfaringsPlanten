/*
 The logic:
 always one 'extra' plant where name not chosen
 can show_plant and new_plant be the same? - when entering a new plant, insert a new plantlog _id with no plant.
 So the new plant is acutally an update of the last new plantlog insert with no plant.
 Solution db-driven
 1) when user signs in first time, create plantlog.insert({... userId: userId ...all else empty})
 2) when plantid is updated from null, do create plantlog.insert( like above)
 3) in template: if plantid == null helper returns false (is this possible?) -> means checking every plantlog row

 Solution template db-driven
 there is somehow always one new_plant at the end...
 when this one has a plantid, somehow create a new new_plant
 how to register that a new should be created?
 When a plant is chosen, a plantlog.insert({plantid: plantid, userId: userId}) is made.
 This causes the helper to rerun, therefor now that plant comes from the database.
 Is it possible and plausible to merge show_plant and new_plant?
 Must somehow pass a variable to the template to fire a "has no plant selected" - check if cursor is empty??
*/
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
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },
});

Template.new_plant.events({
  "change .js-plant-selected": function(event, template){

    var plant_id = event.currentTarget.options[event.currentTarget.selectedIndex].value;

    console.log(plant_id);

    Meteor.call("insertNewPlantLog", plant_id, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){
        console.log("result: " + result);
      }
    });

    Session.set("isSelected", true);
  },
  "change .js-upload-image": function(event, template){
    console.log("clicked");
  }
});
