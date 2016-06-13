Template.plantsamples.helpers({
  plantlog: function(){
    return this;
  },
/*
  getPlantname: function(){
    //how to get the plantname passed...
    //return this.

    var name = this.next().plantname_da;
console.log(name);
    return name;
  }*/
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

Template.plantsamples.events({
  "click #foo": function(event, template){

  }
});
