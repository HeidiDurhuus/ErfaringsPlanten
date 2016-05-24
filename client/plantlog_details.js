
var map = null;

Template.plantlog_details.helpers({
  getPlant: function(id){
    return Plants.findOne({_id:id});
  },
  plantlog: function(){
    return PlantLog.findOne({_id:Session.get("plantlog_id")});
  },
});

Template.plantlog_details.events({
});


Template.planting_type.helpers({
  options: function(id){
    var opt = [{
      attributes: {
        value: 1
        },
      text: i18n("planting_type.clone")
      },{
      attributes: {
        value: 2
        },
      text: i18n("planting_type.seed")},
      {
      attributes:{
        value: 3
      },
      text: i18n("planting_type.seed")
      }
    ];

    var pt = PlantLog.findOne({_id:id});
    if(pt.planting_type){
      for(var i = 0; i < opt.length; i++){
        if(pt.planting_type.value == opt[i].attributes.value){
          opt[i].attributes.selected = true;
        }
      }
    }
    return opt;
  }
});

Template.planting_type.events({
  "change .js-insert-plantingtype": function(event, template){
    var field = "planting_type";
//    var value = event.currentTarget.options[event.currentTarget.selectedIndex].value;
    var value = {
      value: event.currentTarget.options[event.currentTarget.selectedIndex].value,
      text: event.currentTarget.options[event.currentTarget.selectedIndex].label
    };
    var plantlog_id = this.id;
    if(value != ""){
      var query = {};
      query[field] = value;
      Meteor.call("updatePlantlog", plantlog_id, query);
    }
  }
});

Template.planting_date.rendered = function(){
  $("#datepicker").datepicker();
}
Template.planting_date.helpers({
  hasDate: function(id){
    var pl = PlantLog.findOne({_id:id});
    if(pl.planting_date){
      return pl.planting_date;
    }
    return null;
  }
});

Template.planting_date.events({
  "change #datepicker": function(event, template){
    var field = "planting_date";
    var value = document.getElementById("datepicker").value
    var plantlog_id = this.id;
    if(value != ""){
      var query = {};
      query[field] = value;
      Meteor.call("updatePlantlog", plantlog_id, query);
    }
  }
});


Template.planting_place.helpers({
  options: function(id){

    var opt = [{
      attributes: {
        value: 1
        },
      text: i18n("planting_place.windowsill")
      },{
      attributes: {
        value: 2
        },
      text: i18n("planting_place.balcony")
      },{
      attributes:{
        value: 3
      },
      text: i18n("planting_place.greenhouse")
      },{
      attributes:{
        value: 4
      },
      text: i18n("planting_place.garden")
      },{
      attributes:{
        value: 5
      },
      text: i18n("planting_place.land")
    }
    ];

    var pp = PlantLog.findOne({_id:id});
    if(pp.planting_place){
      for(var i = 0; i < opt.length; i++){
        if(pp.planting_place.value == opt[i].attributes.value){
          opt[i].attributes.selected = true;
        }
      }
    }
    return opt;
  }
});

Template.planting_place.events({
  "change .js-insert-plantingplace": function(event, template){
    var field = "planting_place";
//    var value = event.currentTarget.options[event.currentTarget.selectedIndex].value;
//    var text = event.currentTarget.options[event.currentTarget.selectedIndex].label;

    var value = {
      value: event.currentTarget.options[event.currentTarget.selectedIndex].value,
      text: event.currentTarget.options[event.currentTarget.selectedIndex].label
    };
    var plantlog_id = this.id;
    if(value != ""){
      var query = {};
      query[field] = value;
      Meteor.call("updatePlantlog", plantlog_id, query);
    }
  }
});

Template.planting_location.rendered = function(){
  var maxZoom = 18;
  var latlng = null;
  var marker = null;
  var plantlog_id = this.data.id;

//  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
  L.Icon.Default.imagePath = '/images';

  map = L.map('map', {    //map is a global variable
    center: [56.00, 10.00],
    zoom: 5
  });

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: 18
  }).addTo(map);

  // check if marker is already set in db
  var plantlog = PlantLog.findOne({_id:plantlog_id});
  if(plantlog){
    if(plantlog.planting_location){
      latlng = {
        lat: plantlog.planting_location.lat,
        lng: plantlog.planting_location.lng
      }
      Session.set("LatLng", latlng);
      map.setView(latlng, 16);
      marker = L.marker(latlng).addTo(map);
    }
  }


  //register eventlistener to map
  map.on('click', function(e) {

    latlng = e.latlng;
    var zoom = map.getZoom();

    //if zoom is equal or less than 18
    if(zoom < maxZoom){
      map.panTo(latlng);
      map.setZoom(map.getZoom()+2);
    }
    if(zoom == maxZoom){
      if(!marker){
        marker = L.marker(latlng).addTo(map);
      }else{
        map.removeLayer(marker);
        marker = L.marker(latlng).addTo(map);
      }
      var field = "planting_location";
      var query = {};
      query[field] = latlng;
      Meteor.call("updatePlantlog", plantlog_id, query);
      Session.set("LatLng", latlng);
    }
  });
};

Template.planting_location.helpers({
  latitude:function(){
    if(Session.get("LatLng")){
      return Session.get("LatLng").lat;
    }
    return false;
  },
  longitude: function(){
    if(Session.get("LatLng")){
    return Session.get("LatLng").lng;
    }
    return false;
  },
});


/*
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
*/
/*
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
*/


/*
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
  //  console.log("LatLng " + Session.get("LatLng").lat + " " + Session.get("LatLng").lng);
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
      }
    }
  });
};
*/
