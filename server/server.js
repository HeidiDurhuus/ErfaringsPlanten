Slingshot.GoogleCloud.directiveDefault.GoogleSecretKey = process.env.GOOGLE_SECRET_KEY;
Slingshot.GoogleCloud.directiveDefault.GoogleAccessId = process.env.GOOGLE_ACCESS_ID;

Slingshot.fileRestrictions("myFileUpload", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
});

Slingshot.createDirective("myFileUpload",
  Slingshot.GoogleCloud, {
    bucket: "erfaringsplanten",
    acl: "public-read",
    authorize: function(){
      if(!this.userId){
        var message="please login before uploading images";
        throw new Meteor.Error("Login Required", message);
      }
      return true;
    },
    key: function(file){
      return this.userId + "/" + file.name;
    }
  }
);
Meteor.publish("plantlog", function(){
  console.log("server returned plantlog for " + this.userId);
  return PlantLog.find({user_id: this.userId});
});

Meteor.publish("one-plantlog", function(plantlog_id){
  return PlantLog.find({_id: plantlog_id, user_id: this.userId});
});

Meteor.publish("plants", function(string){
  return Plants.find({da_lat: {$regex: string, $options: "i"}}); //i: case-insensitive
});

Meteor.publish("plant-samples", function(plant_id){
  return PlantLog.find({plant_id: plant_id, user_id: {$ne: this.userId}});
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
