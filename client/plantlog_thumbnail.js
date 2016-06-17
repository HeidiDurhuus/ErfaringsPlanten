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
  this.plantlog_details = new ReactiveVar( false );
});

Template.plantlog_thumbnail.helpers({
  openDetails: function(){
    return Template.instance().plantlog_details.get();
  },
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
/*
    console.log(isBreakpoint("xs"));
    console.log(isBreakpoint("sm"));
    console.log(isBreakpoint("md"));
    console.log(isBreakpoint("lg"));

    console.log("breakpoint");
*/
/*
    console.log("click");
    console.log(this);
    console.log(this.gapIndex);
*//*
    console.log(this.gapState.get());
    console.log(template.data.gapState.get());
    if(!this.gapState.get()){
      this.gapState.set(true);
    }else {
      this.gapState.set(false);
    }
    */
    this.openIndex.set(this.gapIndex);
//    console.log(this.openIndex.get());
    /*
    if(!template.data.gapState.get()){
      template.data.gapId.set(this.plant._id);
      template.data.gapView.set(event.currentTarget.id);
      template.data.gapState.set(true);
    }
    else {
      if(template.data.gapId.get() == this.plant._id){
        //same plant
        if(template.data.gapView.get() == event.currentTarget.id){
          //and same button - close gap
          template.data.gapState.set(false);
        }else{
          //not same button - change button
          template.data.gapView.set(event.currentTarget.id);
        }
      }else{
        //different plant
        template.data.gapId.set(this.plant._id);
        if(!template.data.gapView.get()){
          //different button
          template.data.gapView.set(event.currentTarget.id);
        }
        //how to reach sibling button to change its color?
      }
    }
    */
    /*
    if(!template.plantlog_details.get()){
      template.plantlog_details.set(true);

    }else{
      template.plantlog_details.set(false);
    }
    console.log(template.plantlog_details.get());*/
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
