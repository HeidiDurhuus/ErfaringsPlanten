
Template.plantlog_details.helpers({
  getPlant: function(id){
    return Plants.findOne({_id:id});
  },
  plantlog: function(){
    return PlantLog.findOne({_id:Session.get("details_id")});
  },
  create: function(){
  },
  rendered: function(){

  },
  destroyed: function(){

  },
});

Template.plantlog_details.events({
  "click #foo": function(event, template){

  }
});


Template.planting_type.helpers({
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },
});

Template.planting_type.events({
  "change .js-insert-plantingtype": function(event, template){
    var field = "planting_type";
    var value = event.currentTarget.options[event.currentTarget.selectedIndex].value;
    var plantlog_id = this.id;
    console.log(this);
    if(value != ""){
      var query = {};
      query[field] = value;
      console.log(plantlog_id);
      console.log(value);
      Meteor.call("updatePlantlog", plantlog_id, query);
    }
  }
});


Template.planting_date.helpers({
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },
});

Template.planting_date.events({
  "change ": function(event, template){

  }
});


Template.planting_place.helpers({
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },
});

Template.planting_place.events({
  "click #foo": function(event, template){

  }
});


Template.planting_location.helpers({
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

Template.planting_location.events({
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
});

Template.show_map.rendered = function(){
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
