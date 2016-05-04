Template.navbar.helpers({
  isClicked: function(num){
      if(Session.get("btn"+num) == 1){
        return true;
      }else {
        return false;
      }
  },
  signedIn: function(){
    if(Meteor.userId()){
      Session.set("userid", Meteor.userId());
      return true;
    }else{
      return false;
    }
  }
});

Template.navbar.events({
  "click .js-home-nav": function(event, template){
     Session.set("btn1", 1);
     Session.set("btn2", 0);
  },
  "click .js-new-plant-nav": function(event, template){
     Session.set("btn1", 0);
     Session.set("btn2", 1);

     //don't know if its the best place to solve this logic
     Session.set("isSubmitted", false);
  }
  /*,
  "click .js-about": function(event, template){
    Session.set("btn1", 0);
    Session.set("btn2", 1);
    Session.set("btn3", 0);
  },
  "click .js-credit": function(event, template){
    Session.set("btn1", 0);
    Session.set("btn2", 0);
    Session.set("btn3", 1);

  }*/
});

//////////////
/// configuration
//////////////

Accounts.ui.config({
  requestPermissions: {},
  extraSignupFields: [
  {
    fieldName: 'username',
    fieldLabel: 'Brugernavn (bliver vist på skærm)',
    inputType: 'text',
    visible: true,
    validate: function(value, errorFunction) {
      if (!value) {
        errorFunction("Please write your first name");
        return false;
      } else {
        return true;
      }
    }
  }
  ]
});
