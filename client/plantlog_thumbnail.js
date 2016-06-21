
//var clicked_id = null;

Template.plantlog_thumbnail.onCreated(function(){
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
  },
  "click #btnDetails": function(event, template){
    event.preventDefault();

    console.log(event);
    console.log(template.data.itemsCount);
    console.log(this);

    var gap_index = 0;
    if(isBreakpoint("xs")){
      gap_index = template.data.gapIndex;
    }
    if(isBreakpoint("sm")){
      gap_index = getBreakpointIndex(template.data.gapIndex, 2, template.data.itemsCount.get());
    }
    if(isBreakpoint("md")){
      gap_index = getBreakpointIndex(template.data.gapIndex, 3, template.data.itemsCount.get());
    }
    if(isBreakpoint("lg")){
      gap_index = getBreakpointIndex(template.data.gapIndex, 4, template.data.itemsCount.get());
    }
    template.data.openIndex.set(gap_index);
    template.data.gapView.set(event.currentTarget.id);
    template.data.gapId.set(template.data.plant._id);
    //Router.go("/plantlog_details/:"+this.plant.id);
  },
  "click #btnEntries": function(event, template){
    event.preventDefault();
/*
    console.log(event);
    console.log(template.data.gapIndex);
*/
    var gap_index = 0;
    if(isBreakpoint("xs")){
      gap_index = template.data.gapIndex;
    }
    if(isBreakpoint("sm")){
      gap_index = getBreakpointIndex(template.data.gapIndex, 2, template.data.itemsCount.get());
    }
    if(isBreakpoint("md")){
      gap_index = getBreakpointIndex(template.data.gapIndex, 3, template.data.itemsCount.get());
    }
    if(isBreakpoint("lg")){
      gap_index = getBreakpointIndex(template.data.gapIndex, 4, template.data.itemsCount.get());
    }
    template.data.openIndex.set(gap_index);
    template.data.gapView.set(event.currentTarget.id);
    template.data.gapId.set(template.data.plant._id);
/*
    console.log(event);

    console.log(template.data.openIndex);
    console.log(template.data.gapView);
    console.log(template.data.gapId);
*/  },
  "click .js-register-click": function(event, template){
    if(!clicked_id){
      clicked_id = event.currentTarget.id;
    }
  }
});
function isBreakpoint( alias ) {
    return $('.device-' + alias).is(':visible');
}
function getBreakpointIndex(gap_index, num_columns, total_items){
  // + 1 to get the modulus right, because index begins with 0
  gap_index = parseInt(gap_index) + 1;
  num_columns = parseInt(num_columns); 
  total_items = parseInt(total_items);

  var add = 0;
/*
  console.log("getBreakpointIndex");
  console.log("gap_index: " + gap_index);
  console.log("num_columns: " + num_columns);
*/
  //not item from first row
  if(gap_index > num_columns){
    //is item in last row - which may not be filled (hence not available gap)
    var items_in_last_row = total_items % num_columns;

    //gap_index is in the last row - do nothing
    if(gap_index >= total_items - items_in_last_row){
//      console.log("gap_index LAST ROW");

    } //gap_index is not within the last row
    else{
      add = gap_index % num_columns;
/*
      console.log("add = gap_index % " + num_columns);
      console.log(add);
*/
      if(add != 0){
        gap_index = gap_index - add;
/*
        console.log("gap_index = gap_index - add;");
        console.log(gap_index);
*/
        add = num_columns;
/*
        console.log("add = num_columns");
        console.log(add);
*/
      }

    }
  } //items from first row
  else{
  gap_index = num_columns;
  }
//  console.log("gap_index + add - 1");
//  console.log(gap_index + add - 1);
  return gap_index + add - 1;
}
