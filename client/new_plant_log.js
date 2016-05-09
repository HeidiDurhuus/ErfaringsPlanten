
Template.new_plant_log.helpers({
  plants:function(){
    return Plants.find();
  },
  plant:function(){
    return PlantLog.findOne({_id:Session.get("isSubmitted")});
  },
  getPlant: function(){
    return PlantLog.findOne({_id:Session.get("isSubmitted")});
  },
  isSubmitted:function(){
    if(Session.get("isSubmitted")){
      return true;
    }
    return false;
  },
  isClickedAdress:function(){
      return Session.get("addressOpen");
  },
  isClickedLatLng: function(){
    return Session.get("latlngOpen");
  },
  isClickedMap:function(){
      return Session.get("mapOpen");
  }

});
Template.show_map2.rendered = function(){
  var maxZoom = 18;
  var marker = null;
  var latlng = null;
  var marker = null;

  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
  map = L.map('map', {    //map is a global variable
    center: [56.00, 10.00],
    zoom: 5
  });

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: 18
  }).addTo(map);

  //register eventlistener to map
  map.on('click', function(e) {

    Session.set("LatLng", e.latlng);
    console.log("LatLng " + Session.get("LatLng").lat + " " + Session.get("LatLng").lng);
    var zoom = map.getZoom();

    //if zoom is equal or less than 18
    if(zoom < maxZoom){
      map.panTo(Session.get("LatLng"));
      map.setZoom(map.getZoom()+2);
    }
    if(zoom == maxZoom){
      if(!marker){
        marker = L.marker(Session.get("LatLng")).addTo(map);
      }else{
        map.removeLayer(marker);
        marker = L.marker(Session.get("LatLng")).addTo(map);
        console.log("marker " + marker.getLatLng());
      }
    }
  });
};

Template.new_plant_log.events({
  "click .js-insert-adress": function(event, template){
    if(Session.get("addressOpen")){
      Session.set("addressOpen", false);
    }else{
      Session.set("addressOpen", true);
    }
  },
  "click .js-insert-latlng": function(event, template){
    if(Session.get("latlngOpen")){
      Session.set("latlngOpen", false);
    }else{
      Session.set("latlngOpen", true);
    }
  },
  "click .js-insert-from-map": function(event, template){
    if(Session.get("mapOpen")){
      Session.set("mapOpen", false);
    }else{
      Session.set("mapOpen", true);
    }
  },
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

      var planting_address = {};
      if(Session.get("addressOpen")){
        planting_address = {
          street: event.target.locationAdressStreet.value,
          number: event.target.locationAdressNo.value,
          postcode: event.target.locationAdressPostcode.value
        };
      }
      var lat = "";
      var lng = "";
      var planting_location = {};

      if(Session.get("latlngOpen")){
        lat = event.target.locationLat.value;
        lng = event.target.locationLng.value;
      }
      var planting_location;
      if(!lat || ! lng){
        planting_location = Session.get("LatLng");
      }else{
        planting_location = {
          lat: lat,
          lng: lng
        }
      }
      console.log(user);
      console.log(plant);
      console.log(planting);
      console.log(planting_date);
      console.log(planting_place);
      console.log(planting_address);
      console.log(planting_location);
      /*
       Put in plantid
      */
     var ins = {
       user_id: user,
       plant_id: plant,
       planting: planting,
       planting_date: planting_date,
       planting_place: planting_place,
       planting_address: planting_address,
       planting_location,
       entries: []
     };
     Meteor.call("insertNewPlantLog", ins, function(error, result){
       if(error){
         console.log("error", error);
       }
       if(result){
         console.log("result: " + result);
         Session.set("isSubmitted", result);
       }
     });
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
