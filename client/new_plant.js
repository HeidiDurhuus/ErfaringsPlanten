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

Template.new_plant.helpers({
  rendered: function(){
    AutoCompletion.init("input#searchbox");
    AutoCompletion.enableLogging = true;
  },
});

Template.new_plant.events({
  "keyup input#searchbox": function(event){
    var value = event.currentTarget.value;
    if(value.length > 2){
      Meteor.subscribe("plants", value);
      AutoCompletion.autocomplete({
        element: 'input#searchbox',
        collection: Plants,
        field: 'da_lat',
        limit: 8,
        sort: {da: 1}
      });
    }
  },
  "click .js-select-plant": function(event){
    event.preventDefault();
    var plant_name = document.getElementById("searchbox").value
    var get_plant = Plants.findOne({da_lat:plant_name});
    if(get_plant){
      var plant_id = get_plant._id;
      Meteor.call("insertNewPlantLog", plant_id, plant_name, function(error, result){
        if(error){
          console.log("error", error);
        }
        if(result){   //insert plantname
          var query = {};
          query["plantname_da"] = get_plant.da;
          query["plantname_lat"] = get_plant.lat;
          var plantlog_id = result;
          Meteor.call("updatePlantlog", plantlog_id, query);
        }
      });
    }
    document.getElementById("searchbox").value = "";
  },
});
