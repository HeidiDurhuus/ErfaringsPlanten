
Meteor.publish("plantlog", function(){
  return PlantLog.find({user_id: this.userId});
});

Meteor.publish("plants", function(){
  return Plants.find({});
});

Meteor.methods({
  insertNewPlantLog:function(newPlant){
    var ins = PlantLog.insert({
      user_id: newPlant.user_id,
      plant_id: newPlant.plant_id,
      planting: newPlant.planting,
      planting_date: newPlant.planting_date,
      planting_place: newPlant.planting_place,
      planting_address: newPlant.planting_address,
      planting_location: newPlant.planting_location,
      entries: newPlant.entries
    });
    return ins;
  }
});
