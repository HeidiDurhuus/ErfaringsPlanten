
var map = null;
var marker = null;

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
//  var marker = null;
  var plantlog_id = this.data.id;

//  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
  L.Icon.Default.imagePath = '/images';
  $("#map").height($("#map").width());
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
    if(plantlog.planting_location.latlng){
      latlng = {
        lat: plantlog.planting_location.latlng.lat,
        lng: plantlog.planting_location.latlng.lng
      }
      //Session.set("LatLng", latlng);
      map.setView(latlng, 16);
      if(!marker){
        marker = L.marker(latlng).addTo(map);
      }else{
        map.removeLayer(marker);
        marker = L.marker(latlng).addTo(map);
      }
      //Session.set("locationAddress", plantlog.planting_location.address);
    }
  }


  //register eventlistener to map
  map.on('click', function(e) {

    latlng = e.latlng;
    var zoom = map.getZoom();

    //if zoom is equal or less than 18
    if(zoom < maxZoom){
      map.panTo(latlng);
      map.setZoom(map.getZoom()+4);
    }
    if(zoom == maxZoom){
      if(!marker){
        marker = L.marker(latlng).addTo(map);
      }else{
        map.removeLayer(marker);
        marker = L.marker(latlng).addTo(map);
      }

    var parameters = {
      lat: latlng.lat,
      lon: latlng.lng,
      zoom: zoom,
      format: "json",
      addressdetails: 1
    }
    var url = 'http://nominatim.openstreetmap.org/reverse' + L.Util.getParamString(parameters);
    var referrer = document.referrer;
     Meteor.call("getGeosearch", url, referrer, function(err, result){
       if(err){
         console.log("error " + err);
       }
       if (result) {
         result = JSON.parse(result);

         var address = {
           street: result.address.road,
           no: result.address.house_number,
           postcode: result.address.postcode,
           city: result.address.city,
           country: result.address.country,
           country_code: result.address.country_code
         }
         var field = "planting_location";
         var query = {};
         query[field] = {
           latlng: latlng,
           address: address
         };
         Meteor.call("updatePlantlog", plantlog_id, query);

       }
     });

    }
  });
};

Template.planting_location.helpers({
  location: function(){
    return PlantLog.findOne({_id:this.id}).planting_location;
  }
});

Template.planting_location.events({
  "click #btnGeosearch": function(event, template){
    var query = document.getElementById("searchLocationAddress").value;
    var parameters = {
      q: query,
      format: "json",
      addressdetails: 1
    }
    var url = 'http://nominatim.openstreetmap.org/search' + L.Util.getParamString(parameters);

    Meteor.call("getGeosearch", url, function(err, result){
     if(err){
       console.log("error " + err);
     }
     if (result) {
       var result_arr = JSON.parse(result);
       if (result_arr.length == 1) {
         result = result_arr[0];
         var latlng = {
           lat: result.lat,
           lng: result.lon
         };
         map.setView(latlng, 16);
         setMarker(marker);
/*
         if(!marker){
           marker = L.marker(latlng).addTo(map);
         }else{
           map.removeLayer(marker);
           marker = L.marker(latlng).addTo(map);
         }
*/       var address = {
           street: result.address.road,
           no: result.address.house_number,
           postcode: result.address.postcode,
           city: result.address.city,
           country: result.address.country,
           country_code: result.address.country_code
         }

         var field = "planting_location";
         var plantlog_id = template.data.id;
         var query = {};
         query[field] = {
           latlng: latlng,
           address: address
         };
         Meteor.call("updatePlantlog", plantlog_id, query, function(err, result){
           if(err){
             console.log(err);
           }
         });

       }
       else if (result_arr.length > 1) {
         //need to implement a dropdown so user can select address
         for(var i = 0; i < result_arr.length; i++){
           console.log(result_arr[i]);
         }
       }else {
         console.log("fandt ingen adr");
       }
      }
   });
  }
});

function setMarker(marker){
  if(!marker){
    marker = L.marker(latlng).addTo(map);
  }else{
    map.removeLayer(marker);
    marker = L.marker(latlng).addTo(map);
  }
}
