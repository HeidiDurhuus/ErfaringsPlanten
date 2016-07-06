Meteor.startup(function () {
  var foo = process.env.TEST;
  console.log(foo);

  if (!Meteor.users.findOne()){
    for (var i=1;i<9;i++){
      var email = "user"+i+"@test.com";
      var username = "user"+i;
      console.log("creating a user with password 'test123' and username/ email: "+email);
      Meteor.users.insert({profile:{username:username}, emails:[{address:email}],services:{ password:{"bcrypt" : "$2a$10$I3erQ084OiyILTv8ybtQ4ON6wusgPbMZ6.P33zzSDei.BbDL.Q4EO"}}});
    }
  }
  if(!Plants.findOne()){

    var textfile = Assets.getText('danske_plantenavne.txt');
    var lines = textfile.split("\n");
    //hvis har ...
    //tag det som er før ... og det som er efter ... trim

    var lat, da, da_lat;

    for(var i = 0; i < lines.length; i++){  //Change to this when autocomplete works!!

      var line = lines[i];
      //hvis indeholder ..
      if(line.indexOf("..") > -1){
        da = line.substring(0, line.indexOf(".."));
        lat = line.substring((line.lastIndexOf("..")+2), line.length).trim();
        //check er dette en ny plante eller resten af den ovenfor
        var nextline = lines[i+1];
        if(nextline.indexOf("..") == -1){
          lat += " " + nextline.trim()
        }
        da = replaces(da);  //replace char 166 with space
        da_lat = da + " - " + lat;
        Plants.insert({
          lat: lat,
          da: da,
          da_lat: da_lat,
        });
      }
    }
    console.log("inserted " + lines.length + " plantnames");
  }
});

function replaces(str){
  var splittet = str.split(String.fromCharCode(166));
  str = "";
  for(var i = 0; i < splittet.length; i ++){
    str += splittet[i] + " ";
  }
  return str;
}
