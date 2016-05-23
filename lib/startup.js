Meteor.startup(function(){
  //fall back language
  return i18n.setDefaultLanguage("en");
});


if(Meteor.isClient){
  Meteor.startup(function() {
  /*  var localeFromBrowser = window.navigator.userLanguage || window.navigator.language;
    var locale = 'en';
    if (localeFromBrowser.match(/da/)) {
      locale = 'da';
    }*/
    var localeFromBrowser = window.navigator.languages;
    var locale = "en";
    if(localeFromBrowser.indexOf("da") > -1){
      locale = "da";
    }
    i18n.setLanguage(locale);
    Meteor.call("setUserLanguage", locale);
  });
}
