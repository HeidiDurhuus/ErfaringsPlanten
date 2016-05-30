
Meteor.publish("plantlog", function(){
  return PlantLog.find({user_id: this.userId});
});

Meteor.publish("plants", function(){
  return Plants.find({});
});

Meteor.methods({
  insertNewPlantLog:function(plant_id){
    var ins = PlantLog.insert({
      user_id: this.userId, //newPlant.user_id,
      plant_id: plant_id
    });
    return ins;
  },
  saveFile: function(buffer, plantlog_id){
    PlantLog.update({_id: plantlog_id}, {$set: {image: buffer}});
  },
  updatePlantlog: function(plantlog_id, query){
    var upd = PlantLog.update({_id: plantlog_id}, {$set: query});
    return upd;
  },
  insertPlantlogEntry: function(plantlog_id, entry){
    //inserts an object to the beginning of the array (unshift)
    var ins = PlantLog.update({
      _id: plantlog_id
    }, {
      $push: {
        entries: {
          $each: [entry],
          $position: 0
        }
      }
    });
  },
  setUserLanguage: function(lang){
    Meteor.users.update(this.userId, {$set: {language: lang}});
  },
  getGeosearch:function(url, referrer){
    try{
        var result = HTTP.call('GET', url, {
          headers: {
            "User-Agent": "Meteor/1.0",
            "Referrer": referrer
          }
        });
        if(result.statusCode == 200){
          return result.content;
        }
    }catch(err){
      console.log("catch: " + err);
    }
  }


});
