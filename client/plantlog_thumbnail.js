/*
Template.show_plant.onCreated(function(){
  console.log("show_plant onCreated");
  this.openInsertLogEntry = new ReactiveVar(false);

});
*/
var clicked_id = null;

Template.plantlog_thumbnail.onCreated(function(){
  // Here, this equals the current template instance. We can assign
  // our ReactiveVar to it, making it accessible throughout the
  // current template instance.
//  this.plantlog_details = new ReactiveVar( false );
});

Template.plantlog_thumbnail.helpers({
  getPlant:function(plantid){
    return Plants.findOne({_id:plantid})
  },
  isEmpty: function(plantid){
    if(!plantid){
      return true;
    }
    return false;
  },
  hasImage:function(){
    if(!this.image){
      return false;
    }
    return true;
  },
  getDate: function(entries){
    var lastEntry = entries[entries.length-1];
    var date = lastEntry.date;
    if(date){
      return date.getDate() + "/" + (date.getMonth() + 1) +"/"+ date.getFullYear();
    }
    return "";
  },
  getText: function(entries){
    var lastEntry = entries[entries.length-1];
    return lastEntry.text;
  },
  getSoilmoist: function(entries){
    var lastEntry = entries[entries.length-1];
    return lastEntry.soilmoist;
  },
  getScore: function(entries){
    var lastEntry = entries[entries.length-1];
    return lastEntry.score;
  },
  getIndex: function(){
    //for testing
    return this.gapIndex;//Template.instance().gapIndex.get();
  }
});

Template.plantlog_thumbnail.events({
  "change .js-upload-image": function(event, template){
    event.preventDefault();
    var id = clicked_id;
    console.log(id);
    var file = event.target.files[0];
    if(!file){return;}

    var fileReader = new FileReader();
    var dataUrl;
    fileReader.onload = function(event){
      dataUrl = event.target.result;
      Meteor.call("saveFile", dataUrl, id);
    }
    fileReader.readAsDataURL(file);
    clicked_id = null;
  },/*
  "click .js-open-details": function(event, template){
    if(!template.plantlog_details.get()){
      template.plantlog_details.set(true);
    }else{
      template.plantlog_details.set(false);
    }
    console.log(template.plantlog_details.get());
  },*/
  "click #btnDetails": function(event, template){
    event.preventDefault();

    var gap_index = 0;
    if(isBreakpoint("xs")){
    }
    if(isBreakpoint("sm")){
      gap_index = getBreakpointIndex(this.gapIndex, 2);
    }
    if(isBreakpoint("md")){
      gap_index = getBreakpointIndex(this.gapIndex, 3);
    }
    if(isBreakpoint("lg")){
      gap_index = getBreakpointIndex(this.gapIndex, 4);
    }
    this.openIndex.set(gap_index);

  },
  "click .js-register-click": function(event, template){
    if(!clicked_id){
      clicked_id = event.currentTarget.id;
    }
  }
});
function isBreakpoint( alias ) {
    return $('.device-' + alias).is(':visible');
}
function getBreakpointIndex(gap_index, num_columns){
  // + 1 to get the modulus right, because index begins with 0
  gap_index = parseInt(gap_index) + 1;
  num_columns = parseInt(num_columns);
  var add = 0;

  console.log("getBreakpointIndex");
  console.log("gap_index: " + gap_index);
  console.log("num_columns: " + num_columns);

  if(gap_index > num_columns){
    add = gap_index % num_columns;
    console.log("add = gap_index % " + num_columns);
    console.log(add);
    if(add != 0){
      gap_index = gap_index - add;
      console.log("gap_index = gap_index - add;");
      console.log(gap_index);
      add = num_columns;
      console.log("add = num_columns");
      console.log(add);
    }
  }
  else{
  gap_index = num_columns;
  }
  console.log("gap_index + add - 1");
  console.log(gap_index + add - 1);
  return gap_index + add - 1;
}
