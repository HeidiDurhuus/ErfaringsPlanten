
var map = null;
var marker_db = null;
var max_zoom = 18;

Template.plantlog_details.helpers({
/*
  getPlant: function(id){
    return Plants.findOne({_id:id});
  },*/
  plantlog: function(){
//    return PlantLog.findOne({_id:Session.get("plantlog_id")});
    console.log(this);
    return PlantLog.findOne({_id:this.plantlog_id});
  },
});

Template.plantlog_details.events({
  "click #btnClose": function(event, template){
    console.log("btnClose");
    console.log(this);
    console.log(event);
    console.log(template);
  }
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

function setMarker(plantlog_id){
  var plantlog = PlantLog.findOne({_id:plantlog_id});
  if(plantlog){
    console.log("setMarker");
    console.log(plantlog);
    if(plantlog.planting_location){
      if(plantlog.planting_location.latlng){
        var latlng2 = {
          lat: plantlog.planting_location.latlng.lat,
          lng: plantlog.planting_location.latlng.lng
        }
        map.setView(latlng2, max_zoom);
        if(!marker_db){                         //global variable, to get the last marker
          marker_db = L.marker(latlng2).addTo(map);
        }else{
          map.removeLayer(marker_db);
          marker_db = L.marker(latlng2).addTo(map);
        }
      }
    }else{
      console.log("has not planting location");
    }
  }
}

Template.planting_location.rendered = function(){
  var plantlog_id = this.data.id;

  L.Icon.Default.imagePath = '/images';   //  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
  $("#map").height($("#map").width());
  map = L.map('map', {                    //map is a global variable
    center: [56.00, 10.00],
    zoom: 5
  });

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: max_zoom                        //max_zoom is a global variable
  }).addTo(map);

  setMarker(plantlog_id);

  //register eventlistener to map
  map.on('click', function(e) {
    var latlng = e.latlng;
    var zoom = map.getZoom();

    //user is zooming in to set a pin
    if(zoom < max_zoom){
      map.panTo(latlng);
      map.setZoom(map.getZoom()+4);
    }

    //user has zoomed in max and can set pin
    if(zoom == max_zoom){
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
         Meteor.call("updatePlantlog", plantlog_id, query, function(err, result){
           if(err){
             console.log("error updating " + err);
           }
           if(result){
             setMarker(plantlog_id);
           }
         });
       }
       });
    }
  });
};

Template.planting_location.helpers({
  location: function(){
    return PlantLog.findOne({_id:this.id}).planting_location;
  },
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

       // nominatim returned 1 address
       if (result_arr.length == 1) {
         result = result_arr[0];
         var latlng = {
           lat: result.lat,
           lng: result.lon
         };
         map.setView(latlng, max_zoom - 2);

         var address = {
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
           if(result){
             setMarker(plantlog_id);
           }
         });
        }
        // nominatim returned multiple results
        else if (result_arr.length > 1) {
/*         if(marker){
           map.removeLayer(marker);
         }
*/         var latlng_arr = new Array();
         var markers = new Array();
         var addresses = {};
         for(var i = 0; i < result_arr.length; i++){
           var latlng = {
             lat: result_arr[i].lat,
             lng: result_arr[i].lon
           };
           latlng_arr.push(latlng);

           //address lookup
           var street = null, no = null, postcode = null, city = null, country = null, country_code = null;
           if(result_arr[i].address.road){
             street = result_arr[i].address.road;
           }
           if(result_arr[i].address.house_number){
             no = result_arr[i].address.house_number;
           }
           if(result_arr[i].address.postcode){
             postcode = result_arr[i].address.postcode;
           }
           if(result_arr[i].address.city){
             city = result_arr[i].address.city;
           }
           if(result_arr[i].address.country){
             country = result_arr[i].address.country;
           }
           if(result_arr[i].address.country_code){
             country_code = result_arr[i].address.country_code;
           }
           addresses[latlng.lat + "," + latlng.lng] = {
             street: street,
             no: no,
             postcode: postcode,
             city: city,
             country: country,
             country_code: country_code
           }
           //*** click event for marker ***
           var marker = L.marker(latlng).on("click", function(){
             map.removeLayer(markers);        //remove the markers
             L.layerGroup().clearLayers();

            //save location from clicked pin
             var field = "planting_location";
             var plantlog_id = template.data.id;
             var query = {};
             query[field] = {
               latlng: this._latlng,
               address: addresses[this._latlng.lat + "," + this._latlng.lng]
             };
             Meteor.call("updatePlantlog", plantlog_id, query, function(err, result){
               if(err){
                 console.log(err);
               }
               if(result){
                 setMarker(plantlog_id);
               }
             });
           });
           markers.push(marker);
         }
//         if(!marker){
           markers = L.layerGroup(markers).addTo(map); //a global variable
/*         }else{
           map.removeLayer(marker);
           markers = L.layerGroup(markers).addTo(map); //a global variable
         }
*/
         var bounds = L.latLngBounds(latlng_arr);
         map.fitBounds(bounds);

       }else {
         console.log("fandt ingen adr");
       }
      }
   });
  }
});
