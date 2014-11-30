var APP_KEY = '22951439b596a4f6e848fe61afacbb94';
var APP_ID = '6ba4073d';
var myID = "_app_id=" + APP_ID + "&_app_key=" + APP_KEY;

//var xmlhttp = new XMLHttpRequest();

// var searchURL = "http://api.yummly.com/v1/api/recipes?_app_id=" + APP_ID + "&_app_key=" + APP_KEY + "&maxResult=100&start=0" + "&requirePictures=true&" 
var searchURL = "http://api.yummly.com/v1/api/recipes?" + myID + "&maxResult=100&start=0" + "&requirePictures=true&" 
var dinner = "q=dinner"
var chicken = "q=chicken"
var URL = "http://api.yummly.com/v1/api/recipe/recipe-id?" + myID;

var recipeURL = "http://api.yummly.com/v1/api/recipe/recipe-id?_app_id=" + APP_ID + " &_app_key=" + APP_KEY + ""



// each object in the array contains the name of the recipe, image url of the recipe, and link to the recipe
var recipesArray = [];
var counter = 0;





SavedRecipes = new Mongo.Collection("SavedRecipes");


if (Meteor.isClient) {


    Meteor.subscribe("SavedRecipes", function () { console.log(SavedRecipes.find().count()) } );
    Meteor.call("getRecipes", function(error, results) {

// Menu Animations
        $('.icon-menu').click( function() {
            $('.menu').animate({
                left: '0px'
            }, 200);
            
            $('.body').animate({
                left: '285px'
            }, 200);
            console.log('clicked');
        });
        
        $('.icon-close').click( function() {
            $('.menu').animate({
                left: '-285px'
            }, 200);
            
            $('.body').animate({
                left: '0px'
            }, 200);
            });

// Get recipes
        var obj = JSON.parse(results.content);
        for (var i = 0; i < obj.matches.length; i ++) {
            var name = obj.matches[i].recipeName;
            //console.log(obj.matches[i].recipeName);
            recipesArray[i] = {};
            recipesArray[i].name = name;

            var imgURL = obj.matches[i].smallImageUrls[0];
            imgURL = imgURL.substring(0, imgURL.length - 4);
            recipesArray[i].pic = imgURL;

            var id = obj.matches[i].id;
            recipesArray[i].url = "http://www.yummly.com/recipe/" + id;

            console.log(recipesArray[i]);

        };
        console.log('here');

        // Puts on first recipe
        var recipePic = new Image();
        recipePic.src = recipesArray[counter].pic;
        console.log("in");
        console.log(recipePic.src);

        recipePic.onload = function() {
            //imgTagContents = "<img id='theImg' " + "src=' " + recipePic.src + "'/>";
            var currentImage = document.getElementById("myImg");
            currentImage.src = recipePic.src;
            console.log("onload");
            //$('.box').prepend(recipePic);
        };
        $("#pic-link").attr("href", recipesArray[counter].url);
        $("#rec-link").attr("href", recipesArray[counter].url);
        $("#rec-link").text(recipesArray[counter].name);

        counter += 1;
            });

    Template.nextRecipe.events = {
        'click input.button': function () {
//        var new_player_name = document.getElementById("new_player_name").value;
//        Players.insert({name: new_player_name, score: 0});

            var recipePic = new Image();
            recipePic.src = recipesArray[counter].pic;
            console.log(recipePic.src);
            console.log("click");

            recipePic.onload = function() {
                //imgTagContents = "<img id='theImg' " + "src=' " + recipePic.src + "'/>";
                var currentImage = document.getElementById("myImg");
                currentImage.src = recipePic.src;
                console.log("onload");

                $("#rec-link").attr("href", recipesArray[counter].url);
                $("#rec-link").text(recipesArray[counter].name);


                counter += 1;
                console.log("next");
            };
        }
    };

    Template.saveRecipe.events({
    'click .buttonSave': function () {

        console.log("saved!");

        var recipePicURL = recipesArray[counter-1].pic;
        var recipeURL = recipesArray[counter-1].url;
        var recipeName = recipesArray[counter-1].name;
        console.log(recipePicURL);
        console.log(recipeURL);
        console.log(recipeName);

        if (SavedRecipes.findOne( {name: recipeName} ) ) {
            alert("This recipe has already been saved.")
        } else {
            SavedRecipes.insert({
            name: recipeName, 
            pic: recipePicURL, 
            url: recipeURL,
            createdAt: new Date()});
            //console.log(SavedRecipes.findOne( {name: "Stout-Braised Short Ribs with Soy and Honey"}));


            $(".savedRecipes").hide();  
            var date = new Date();
            var day = date.getDate();
            var month = getCalendarMonth(date.getMonth());
            var year = date.getFullYear();


            var imageHTML = "<a href='" + recipeURL + "' target='_blank'><img class='roundedSaved' src='" + recipePicURL +"' /></a>";
            var recHTML = "<div class='saved-recipe-link'><a id='rec-link' href='" + recipeURL + "' target='_blank'>" + recipeName + "</a></div>";
            var dateHTML = "<p>Saved on " + day + " " + month + " " + year + " </p>";
            $('.savedRecipes').prepend(imageHTML + recHTML + dateHTML);
        }
    }
  });

    var getCalendarMonth = function (num) {
        var months = new Array(13);
        months[0] = "January";
        months[1] = "February";
        months[2] = "March";
        months[3] = "April";
        months[4] = "May";
        months[5] = "June";
        months[6] = "July";
        months[7] = "August";
        months[8] = "September";
        months[9] = "October";
        months[10] = "November";
        months[11] = "December";
        return months[num];
    }



    Template.showSaved.events({
    'click .buttonShowSaved': function () {

        if (SavedRecipes.find().fetch().length < 1) {
            alert("There are no saved recipes! :o(");
        } else {
            $('.savedRecipes').toggle();
        }
        $('html, body').animate({
        scrollTop: $("#savedRecipes").offset().top
        }, 1000);
        console.log("show!");
    }
  });

}

if (Meteor.isServer) {
    SavedRecipes.remove({});
    console.log(SavedRecipes.find().fetch());
    Meteor.methods({
        getRecipes: function () {
            this.unblock();
            return Meteor.http.call("GET", searchURL + dinner);
        }
    });
    Meteor.publish("SavedRecipes", function () {
    return SavedRecipes.find();
  });

}

