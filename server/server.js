
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
/*  beginPlantlogEntry: function(plantlog_id, timestamp){
    var entry = {date: "14/5/2016"};
    var upd = PlantLog.update({_id:plantlog_id}, {$push: {entries: entry}});
    console.log("beginPlantlogEntry");
    console.log(upd);
  },
  */
  insertPlantlogEntry: function(plantlog_id, entry){
    var ins = PlantLog.update({_id: plantlog_id}, {$push: {entries: entry}});
/*
    var upd = PlantLog.insert({
      _id: "26R5saB8YuHem6dJr",
      "entries.date": ISODate("2016-05-13T17:24:45.193Z")
      },
      {$set: {"entries.text": "blah"}}
    );
*/
/*
var upd = PlantLog.findOne({
  _id: "26R5saB8YuHem6dJr",
  entries: {$elemMatch: {date: "14/5/2016"}}
}, {image:false});
*/
/*
    var upd = PlantLog.update({
      _id: "26R5saB8YuHem6dJr",
      "entries.date": "2016-05-13T17:24:45.193Z"
      },
      {$set: {
        "entries.text": "blah"}},
    );
*/
/*
var upd = PlantLog.update({
  _id: "26R5saB8YuHem6dJr",
  "entries.date": "2016-05-13T17:24:45.193Z"
  },
  {$addToSet: {"entries": "text"}},
);
*/
//console.log(timestamp);
console.log("updatePlantlogEntry");
console.log(ins);
/*    var upd = PlantLog.update(
      {_id:plantlog_id},
      {$elemMatch:
        {date: timestamp}
      },
      {$set: query}
    );
*/
  }

});
