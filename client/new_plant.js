
Template.new_plant.helpers({
  plants:function(){
    return Plants.find();
  },
  isSelected: function(){
    return Session.get("isSelected");
  },
  hasImage: function(){
    return false;
  },
  hasEntry: function(){
    return false;
  },
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },
});

Template.new_plant.events({
  "change .js-plant-selected": function(event, template){
    Session.set("isSelected", true);
  }
});
