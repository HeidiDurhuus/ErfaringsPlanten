Plants = new Mongo.Collection("plants");
PlantLog = new Mongo.Collection("plantlog");

if (Meteor.isClient) {
  //////////////
  /// configuration
  //////////////

  Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [
    {
      fieldName: 'username',
      fieldLabel: 'Brugernavn (bliver vist på skærm)',
      inputType: 'text',
      visible: true,
      validate: function(value, errorFunction) {
        if (!value) {
          errorFunction("Please write your first name");
          return false;
        } else {
          return true;
        }
      }
    }
    ]
  });

  // set up the main template the the router will use to build pages
  Router.configure({
    layoutTemplate: 'ApplicationLayout'
  });

  ///////////////
  /// ROUTING
  ///////////////

  // specify the top level route, the page users see when they arrive at the site
  Router.route('/', function () {
    this.render("navbar", {to:"header"});
    this.render("plant_log", {to:"main"});
  });

  Router.route('/new_plant_log', function () {
    this.render("navbar", {to:"header"});
    this.render("new_plant_log", {to:"main"});
  });

//////////////////
/// HELPERS
//////////////////


Template.plant_log.helpers({
  signedIn: function(){
    if(Meteor.userId()){
      Session.set("userid", Meteor.userId());
      return true;
    }else{
      return false;
    }
  }
});

Template.new_plant_log.helpers({
  plants:function(){
    return Plants.find();
  },
  plant:function(){
    return PlantLog.findOne({_id:Session.get("isSubmitted"), userid:Meteor.userId()});
  },
  getPlant: function(){
    return PlantLog.findOne({_id:Session.get("isSubmitted")});
  },
  isSubmitted:function(){
    if(Session.get("isSubmitted")){
      return true;
    }
    return false;
  }
});

Template.show_plant.helpers({
  getDate: function(date){
    if(date){
      console.log(date);
      var month = date.getMonth(); // giver en exception når bruger ikke har valgt dato. Det skal gøres obligatorisk at vælge dato.
      month = month + 1;
      return date.getDate() + "/" + month + "/" + date.getFullYear();
    }
    return undefined;
  },
  updatePlantlog: function(){
    console.log("helper returning: " + Session.get("updatePlantlog"));
    return Session.get("updatePlantlog");
  },
  getPlant:function(plantid){
    return Plants.findOne({_id:plantid})
  }
});


Template.update_plantlog.helpers({
  getPlantId: function(){
    console.log(this._id);
     console.log("plant id " + this._id);
  }
});




Template.show_plant_list.helpers({
  plants: function(){
    return PlantLog.find({user_id:Meteor.userId()});
  }
});


/////////////////
/// EVENTS
////////////////


Template.show_plant.events({
  "click .js-update-plantlog": function(event, template){
    event.preventDefault();
    if(Session.get("updatePlantlog")){

      Session.set("updatePlantlog", false);
      console.log("this:" + this._id);
      console.log("event: " + event.target);
      console.log("template: " + template);
      console.log("was true, now " + Session.get("updatePlantlog"));
      /*
      Nu bliver session sat uanset hvilken log-knap man trykker på.
      Derfor må også _id til planelog med. Session tager kun EJSON objekter,
      så jeg må lære at lave det.
      Desuden skal Session..updatePlantlog nulstilles, når man går ud eller ind på plantlog siden
      nb: session variabler nulstilles når man reloader siden. 
      */

    }else{
      Session.set("updatePlantlog", true);
      console.log("was false, now " + Session.get("updatePlantlog"));
    }
  }
});


Template.update_plantlog.events({
  "submit .js-new-entry-plantlog": function(event){
    event.preventDefault();
    var date = getCheckedText(event.target.plantLogDate);
    if(date == " I dag"){
      date = new Date();
    }
    else{
      date = new Date((Number(date.substring(6))+2000), (date.substring(3,5)-1), date.substring(0,2));
    }
     var plant_update = event.target.plantUpdate.value;
     var plant_condition = getCheckedText(event.target.plantCondition);
     var plantid = this._id;

     console.log("date:" + date );
     console.log("plant_update: " + plant_update);
     console.log("plant_condition: " + plant_condition);
     console.log("plantid: " + plantid);
     //var entry = []
     /*her skal lægges ind i databasen et nyt object sidst i tabellen ($push)*/
     PlantLog.update({_id:plantid}, {$push: { entries: {date: date, plant_update: plant_update, plant_condition: plant_condition}}});
  }
});


Template.new_plant_log.events({
  "submit .js-new-plant": function(event, template){
    event.preventDefault();
     var user = Meteor.userId();
     //var name_da = event.target.plantNameDk.value;
     var plant = getSelectedValue(event.target.plantName);
     var planting  = getCheckedText(event.target.plantingType);
     var planting_date = getCheckedText(event.target.plantingDate);
      if(planting_date == " I dag"){
        planting_date = new Date();
      }
      else{
        planting_date = new Date((Number(planting_date.substring(6))+2000), (planting_date.substring(3,5)-1), planting_date.substring(0,2));
      }

      //photo
      console.log("photo " + event.target.plantPhoto);

      var planting_place = getCheckedText(event.target.plantingPlace);

      console.log(user);
      console.log(plant);
      console.log(planting);
      console.log(planting_date);
      console.log(planting_place);

      /*
       Put in plantid
      */
     var ins = PlantLog.insert({
       user_id: user,
       plant_id: plant,
       planting: planting,
       planting_date: planting_date,
       planting_place: planting_place,
       entries: []
     });
//     console.log("ins: " + ins);
     Session.set("isSubmitted", ins);
  }
});
function getSelectedValue(options){
  for(var i = 0; i < options.length; i++){
    if(options[i].selected){
      return options[i].value;
    }

  }
}
function getCheckedText(radios){
  for(var i = 0; i < radios.length; i++){
    if(radios[i].checked){
      if(radios[i].nextElementSibling){ // "other" is checked (then there is a text input field)
        return radios[i].nextElementSibling.value; //the input text
      }else{
        return radios[i].nextSibling.data;
      }
    }
  }
  return "no selection";
}

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (!Meteor.users.findOne()){
      for (var i=1;i<9;i++){
        var email = "user"+i+"@test.com";
        var username = "user"+i;
        console.log("creating a user with password 'test123' and username/ email: "+email);
        Meteor.users.insert({profile:{username:username}, emails:[{address:email}],services:{ password:{"bcrypt" : "$2a$10$I3erQ084OiyILTv8ybtQ4ON6wusgPbMZ6.P33zzSDei.BbDL.Q4EO"}}});
      }
    }
    if(!Plants.findOne()){
      console.log("inserting plants ");
      Plants.insert({
        name_da: "Sankthansurt",
        order: "Saxifragales",
        family: "Crassulaceae",
        genus: "Hylotelephium",
        species: "Hylotelephium telephium",
        variant: "",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Sedum_telephium_subsp_maximum_200807.jpg/618px-Sedum_telephium_subsp_maximum_200807.jpg"
      });
      Plants.insert({
        name_da: "Have-Timian",
        order: "Magnoliopsida",
        family: "Lamiaceae",
        genus: "Thymus",
        species: "Thymus vulgaris",
        variant: "",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Flickr_-_cyclonebill_-_Timian.jpg/640px-Flickr_-_cyclonebill_-_Timian.jpg"
      });
      Plants.insert({
        name_da: "Æblemynte (rundbladet mynte)",
        order: "Lamiales",
        family: "Lamiaceae",
        genus: "Mentha",
        species: "Mentha suaveolens",
        variant: "",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Apple_mint_plant.jpg/448px-Apple_mint_plant.jpg"
      });
      Plants.insert({
        name_da: "Gul Daglilje",
        order: "Aspasagales",
        family: "Hemerocallidaceae",
        genus: "Hemerocallis",
        species: "Hemerocallis citrina",
        variant: "",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hemerocallis_thunbergii_034.jpg/640px-Hemerocallis_thunbergii_034.jpg"
      });
    }
  });
}
