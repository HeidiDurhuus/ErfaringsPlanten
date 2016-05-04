Meteor.startup(function () {
  if (!Meteor.users.findOne()){
    for (var i=1;i<9;i++){
      var email = "user"+i+"@test.com";
      var username = "user"+i;
      console.log("creating a user with password 'test123' and username/ email: "+email);
      Meteor.users.insert({profile:{username:username}, emails:[{address:email}],services:{ password:{"bcrypt" : "$2a$10$I3erQ084OiyILTv8ybtQ4ON6wusgPbMZ6.P33zzSDei.BbDL.Q4EO"}}});
    }
  }
  if(!Plants.findOne()){
    console.log("inserting plants ");
    Plants.insert({
      name_da: "Sankthansurt",
      order: "Saxifragales",
      family: "Crassulaceae",
      genus: "Hylotelephium",
      species: "Hylotelephium telephium",
      variant: "",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Sedum_telephium_subsp_maximum_200807.jpg/618px-Sedum_telephium_subsp_maximum_200807.jpg"
    });
    Plants.insert({
      name_da: "Have-Timian",
      order: "Magnoliopsida",
      family: "Lamiaceae",
      genus: "Thymus",
      species: "Thymus vulgaris",
      variant: "",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Flickr_-_cyclonebill_-_Timian.jpg/640px-Flickr_-_cyclonebill_-_Timian.jpg"
    });
    Plants.insert({
      name_da: "Æblemynte (rundbladet mynte)",
      order: "Lamiales",
      family: "Lamiaceae",
      genus: "Mentha",
      species: "Mentha suaveolens",
      variant: "",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Apple_mint_plant.jpg/448px-Apple_mint_plant.jpg"
    });
    Plants.insert({
      name_da: "Gul Daglilje",
      order: "Aspasagales",
      family: "Hemerocallidaceae",
      genus: "Hemerocallis",
      species: "Hemerocallis citrina",
      variant: "",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hemerocallis_thunbergii_034.jpg/640px-Hemerocallis_thunbergii_034.jpg"
    });
  }
});
