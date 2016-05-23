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
  },
  currentLanguage: function(){
    return i18n.getLanguage();
  },
  languages: function(){
    //for now its hardcoded - In the future I would like to extend the i18n package to list languages
    var lang = new Array();
    if(i18n.getLanguage() == "da"){
      lang.push({language: "en"});
    }else{
      lang.push({language: "da"});
    }
    return lang;
  }
});

Template.navbar.events({
  "click .js-home-nav": function(event, template){
     Session.set("btn1", 1);
     Session.set("btn2", 0);
  },
  "click .js-faq": function(event, template){
     Session.set("btn1", 0);
     Session.set("btn2", 1);
     Session.set("btn3", 0);
  },
  "click .js-about-nav": function(event, template){
     Session.set("btn1", 0);
     Session.set("btn2", 0);
     Session.set("btn3", 1);
  },
  "click .js-select-language": function(event){
    i18n.setLanguage(event.currentTarget.id);
    Meteor.call("setUserLanguage", event.currentTarget.id);
  }
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
