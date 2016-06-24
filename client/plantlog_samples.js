Template.plantlog_samples.onCreated(function () {
/*
  // 1. Initialization

  var instance = this;
  var plantlog = PlantLog.findOne({_id: instance.data.plantlog_id});

console.log("onCreated");
console.log(instance);
console.log(plantlog.plant_id);
  // initialize the reactive variables
//  instance.loaded = new ReactiveVar(0);
//  instance.limit = new ReactiveVar(2);

  // 2. Autorun

  // will re-run when the "limit" reactive variables changes
  instance.autorun(function () {

    // get the limit
//    var limit = instance.limit.get();

//    console.log("Asking for "+limit+" samples…")

    // subscribe to the posts publication
//    var subscription = instance.subscribe('plant-samples', limit);
    var subscription = instance.subscribe('plant-samples', plantlog.plant_id);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
//      console.log("> Received "+limit+" posts. \n\n")
//      instance.loaded.set(limit);
        console.log("> Received "+2+" posts. \n\n")
        instance.loaded.set(2);
    } else {
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 3. Cursor

  instance.plant_samples = function() {
    return Plantlog.find({plant_id: plantlog.plant_id}, {limit: instance.loaded.get()});
    //return Plantlog.find(); //, {limit: instance.loaded.get()});
  }
*/
});


Template.plantlog_samples.helpers({
  plantlog: function(){
    return PlantLog.findOne({_id: this.plantlog_id});
  },
  plant_samples: function(){
    var plantlog = PlantLog.findOne({_id: this.plantlog_id});
    console.log("plantlog");
    console.log(plantlog);
    Meteor.subscribe("plant-samples", plantlog.plant_id);

    return PlantLog.find({plant_id: plantlog.plant_id, user_id: {$ne: Meteor.userId()}});

//subscribe
//  return Template.instance().plant_samples;
    //return //Plantlog.find({plant_id: plantlog.plant_id});
  },
});

Template.plantlog_samples.events({
  "click #btnClose": function(event, template){
    template.data.openIndex.set(null);
  }
});
