//declaring Global Variables
var selectedTeam, selectedState, selectedCity, queryTeam,timesTeamQuery, selectedTimesTeam;


//Hiding page faetures

$("#resultsSectionId").hide();
$("#clearResults").hide();
$('#logosHere').hide();
$('#stat-table').hide();
$('#statHeader').hide();
$('#newsHeader').hide();

//Fireabse Initalization
var config = {
   apiKey: "AIzaSyB5CwFc0sgIaz5PNkMCPVvp9LWO6GClfNg",
   authDomain: "rcbgroup1.firebaseapp.com",
   databaseURL: "https://rcbgroup1.firebaseio.com",
   storageBucket: "rcbgroup1.appspot.com",
   messagingSenderId: "444807120694"
 };

 firebase.initializeApp(config);

// var database = firebase.database();
// database.ref("Team A").on("value", function(snapshot){
// database.ref(snapshot.key).on("child_added", function(sp){
//   console.log(sp);
// }


//  Set the button alert's timeout to run three seconds after the function's called.
setTimeout(function() {
    $('#countDown').fadeOut( 700, function(){
          $('#logosHere').fadeIn( 700 );
          var newDiv= $("<div id='instructions'>");
          newDiv.text("Click a team logo to get ticket info and more!");
          $("#logosHere").prepend(newDiv);
          var newDiv2= $("<div id='instruct'>");
          newDiv2.text("Click a game to get detailed info for that event!");
          $("#resultsSectionId").prepend(newDiv2)
          timeKeeper();
          function timeKeeper() {
          $("#preCopyRight").text(p1[0].outerText);
          $("#postCopyRight").text(p1[1].outerText + " " + p[0].outerText);
          }
        
          setInterval(timeKeeper, 1000);
    })
  }, 3000);


///////////////////////////////////////////////////////////////////////////////////////////
// Countdown to Opening day Calculations
var daysToOD ,hoursToOD , minsToOD ,secsToOD, epochDelta, epochTimeNow ;
var p1 = $("<p class='countD col-lg-11' id='lineOne'>Countdown To Opening Day - April 2, 2017</p><p class='countD col-lg-11' id='lineTwo'>First game starts in: </p>");
var p = $("<h1 class='countD col-lg-11' id='clock'>");
  
  p.text(daysToOD + " days " + hoursToOD + " hours " + minsToOD + " minutes " + secsToOD + " seconds");
  $('#openingDay').append(p1);

function countDown(){
  var dateNow = new Date();
  var epochMilliSecs = dateNow.getTime();
  epochTimeNow = Math.floor(epochMilliSecs/1000);
  localStorage.setItem("VisitTime", epochTimeNow);
  var openingDayEpoch = 1491183000;

  epochDelta = openingDayEpoch - epochTimeNow;

   daysToOD = Math.floor(epochDelta / 86400) ;
   hoursToOD = Math.floor((epochDelta % 86400)/ 3600);
   minsToOD = Math.floor(((epochDelta % 86400) % 3600)/60);
   secsToOD = Math.floor((((epochDelta % 86400) % 3600) % 60));
 
  p = $("<h1 class='countD col-lg-11' id='clock'>");
  p.text(daysToOD + " days " + hoursToOD + " hours " + minsToOD + " minutes " + secsToOD + " seconds");
  $('#openingDay').html(p1).append(p)
}

countDown();
setInterval(countDown, 1000);

if (epochDelta < 0){
  $('#openingDay').remove();
}
///////////////////////////////////////////////////////////////////////////////////////////
//start of button click function for favorite team
$(document).on("click", ".team" , function(){
  // $("tr").empty();
  $("#resultsTarget").empty(); // Clear previous search result
  $('#articles').hide();
  $("#resultsSectionId").show();
  $("#clearResults").show();
  $('#stat-table').show()
  $('#statHeader').show();
  $('#newsHeader').show();

  $('#event-table > tbody').empty();
  $('#statsData').html("");
 
  selectedTeam = $(this).data("team")
  selectedState= $(this).data("state")
  selectedCity= $(this).data("city")
  selectedTimesTeam = $(this).data("teamtimes")
  timesTeamQuery = selectedTimesTeam.toLowerCase()
  queryTeam = selectedTeam;
  
  $('#h1team').text(selectedTeam);
  
  var database = firebase.database();
///////////////childObject
    database.ref(selectedTeam).on("value", function(snapshot){
  // console.log("Snapshot", snapshot.key) // returns the childObject

///////////// Team Stats
    database.ref(snapshot.key).on("child_added", function(sp){
     //console.log(sp.key + ': ' +sp.val());
     var teamArrayPosition = [sp.key];
    // console.log(philliesArrayPosition);
     var teamArrayStat = [sp.val()];
    // console.log('value' + sp.val())
    for (var c= 0 ; c < teamArrayPosition.length; c++) {
    $("#statsData").append("<td>" + teamArrayStat[c] + "</td>");
    }
  });
});


database.ref("Team A").on("value", function(snapshot){
database.ref(snapshot.key).on("child_added", function(sp){
  // var teamAObj = sp.exportVal();
   // console.log(sp.exportVal());
   
   var teamAObj = sp.exportVal();
    var arrayofPlayers = [];
    //console.log(sp.orderByChild("LINEUP"));
    for (var r = 0 ; r < 2; r++) {
      
    arrayofPlayers.push(Object.keys(teamAObj));
    }
     var battingOrder = arrayofPlayers[0];
     var pitchingOrder = arrayofPlayers[1];
     //console.log(battingOrder, pitchingOrder);
});

});





  var stateId, startDate, endDate; //  initialize variables for search
  // 1) get content from the form
  
  startDate = $("#startDate").val();
  endDate = $("#endDate").val();
  startDate += "T00:00:00Z"
  endDate += "T00:00:00Z"
  
  // 2) build search query
  var API_key_value = "&apikey=OtZP0uNORyGGudirFRnAFeu6VJ6ix8Kq";
  
  var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?"

  var ticketKey = "&keyword=" + selectedTeam + API_key_value;
  
  queryURL +=  ticketKey + "&classification=Baseball" ;
  // if (startDate == "" && endDate == ""){}
  
  // 3) Make Ajax call
  $.ajax({
    url: queryURL,
    method: "GET",
  })
  .done(function(response) {
    
    var eventsArray = response._embedded.events; // gets an array of articles
    
    // 1) create a target div to append each event to!
    var resultsContainer = $("<div>");
    // 2) loop through the array of articles & get key data
    for (var count1 = 0; count1 < eventsArray.length; count1++) {
      var name, eventUrl, venueID;
      var gameEvent = "GE" ;
      var gameDay = "GD";
      var gameTime= "GT";
      var event = eventsArray[count1];
      name = event.name;
      eventUrl = event.url; 
      startTime = event.dates.start.localTime ;
      localStartDate = event.dates.start.localDate;
      localStartDate = moment(localStartDate).format("MM/DD/YYYY");
      gameEvent += count1;
      gameDay += count1;
      gameTime += count1;

      $("#event-table > tbody").append("<tr data-toggle='modal' data-target='#Modal1' data-url=" + eventUrl + " class='gameRow'><td id=" + gameEvent + ">" + name + "</td><td id=" + gameDay +">" + localStartDate +"</td><td id=" + gameTime +">" +startTime + "</td></tr>");
    }
    $("#clearButton").show();
  });
  

//////////////////////////////////////////////////////////////////////////////////////////
///Clear Results Button
  $("#clearResults").on('click', function() {
    $("tbody").empty();
    $("#resultsTarget").empty();
    $("#resultsSectionId").hide();
    $("#clearResults").hide();
    $('#articles').hide();
    $('#h1team').hide();
    $('#stat-table').hide();
    $('#statHeader').hide();
  });


///////////////////////////////////////////////////////////////////////////////////////////
// NY Times Search
var qTerm =selectedCity + " " + selectedTeam;
var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
url += '?' + $.param({
  'api-key': "bd02f499a8474a05bd68ce25460bbc9f",
  'q': qTerm,
  'fq': 'section_name:("Sports")',
  'sort': "newest"
});
  $.ajax({
    url: url,
    method: 'GET',
  })
  .done(function(object){
    var articlesArray = object.response.docs; // gets an array of articles
    // 1) create a target div to append each article to!
    

    if (articlesArray.length > 5){
      var numToPop = articlesArray.length - 5;
      for (var i = 0; i < numToPop; i++) {
       articlesArray.pop();
      }
    }
    
    var resultsContainer = $("<div id=articles>");
    
    // 2) loop through the array of articles & get key data
    articlesArray.forEach(function(article){
      // initialize variables
      var title, snippetText, date, articleURL, multimediaArray, thumbnailURL, dateFormat;
      // set variables
      title = article.headline.main;
      // snippetText = article.lead_paragraph;
      snippetText = article.snippet;
      date = article.pub_date;
      articleURL = article.web_url;
      multimediaArray = article.multimedia;
      thumbnailURL = undefined; // assume its not there first
      dateFormat = moment(date).format("MM/DD/YYYY h:m:s A");
      
      var articleWrapper = $("<div>").addClass("media");
      // 3b) check to see if article has a thumbnail image to addClass
      // and make the DOM if it exists
      if (multimediaArray.length !== 0){
        // assume now there is content here
        // loop through the array
        multimediaArray.forEach(function(media){
          if (media.subtype != ""){
            thumbnailURL = "https://static01.nyt.com/" + media.url;
          }
        }) // exits forEach loop
      }
      // 3b) cont. check to see if there is a thumbnailURL
      if (thumbnailURL){
        var mediaObject = $("<div>").addClass("media-left")
        .append( $("<img>")
        .addClass("media-object")
        .attr("src",thumbnailURL)
        );
        // .append( $("<a>").attr("href", articleURL) )
        articleWrapper.append(mediaObject);
      }

      // 3c) Get the main contents of the article
      
      var mediaBody = $("<div>").addClass("media-body")
      
      .append( $("<h4>").addClass("media-heading").text(title) )
      .append( $("<p>").text(snippetText) )
      .append( $("<p>").text(dateFormat) )
      .append( $("<a>").attr("href", articleURL)
      .attr("target", "_blank")
      .html("<p>Read More</p>") );
      articleWrapper.append(mediaBody);
      
      // 4) append to the resultsContainer
      resultsContainer.append(articleWrapper);
      
    }); // closes forEach
    
    //5) update the DOM with the results Container;
    $('#espnTicker').prepend(resultsContainer);
    
  }) //closes .done() promise
  .fail(function(error){
    // console.log(error);
    $("#espnTicker").prepend( $("<h4>").text("Sorry, could not load data.") );
  })

});
///////////////////News Ticker/////////////

 $(function () {
        $('#js-news').ticker({
            htmlFeed: false,
            ajaxFeed: true,
            feedUrl: 'https://www.espn.com/espn/rss/mlb/news',
            feedType: 'xml'
        });
    });

//////////////////////////////////////////////////////////////////////////////////////////
///Weather API
function runWeather(Date, Time) {

      var weatherDate = Date + " " + Time + " "
    var weatherQueryEpoch = Math.floor((moment(weatherDate).valueOf())/1000);
    var weatherTimeDelta = weatherQueryEpoch-epochTimeNow;

      if (weatherTimeDelta <= 864000) {
          var weatherURL = "https://api.wunderground.com/api/517830656e79f22a/hourly10day/q/"
          $.ajax({
               url: weatherURL + selectedState + "/" + selectedCity + ".json",
               method: "GET",
                })
                 .done(function(weatherData) {
                    var weatherHour = Math.floor(weatherTimeDelta / 3600);
                    var tenDayForecast = weatherData;
                        tenDayForecast = tenDayForecast.hourly_forecast[weatherHour];
                          var temp = tenDayForecast.temp.english;
                          var feelsLike =tenDayForecast.feelslike.english;
                          var condition = tenDayForecast.wx;
                          var icon = tenDayForecast.icon_url;
                          var wind = tenDayForecast.wspd.english
                          $('#weatherReturn').text("Forecast at first pitch: temp: " +temp + "F feels like: " + feelsLike + "F condition: " + condition + " wind speed: " + wind);
                         
                  })
          }
      else {
        var maxTemp , minTemp;
        var weatherURL = "https://api.wunderground.com/api/517830656e79f22a/history_"
        var lastYearDate = "20160115";
            weatherURL = weatherURL + lastYearDate + "/q/" + selectedState + "/" + selectedCity + ".json",
          $.ajax({
               url: weatherURL + lastYearDate + "/q/" + selectedState + "/" + selectedCity + ".json",
               method: "GET",
                })
                 .done(function(historicalWeather) {
                    var lastYearWeather = historicalWeather.history.dailysummary[0];
                    maxTemp = lastYearWeather.maxtempi ;
                    minTemp = lastYearWeather.mintempi ;
                    $('#weatherReturn').text("The expected temperatures are: HI: " +maxTemp + " LOW: " + minTemp);
                })
      }
}
//////////////////////////////////////////////////////////////////////////////////////////
///Modal Section
$(document).on("click", ".gameRow" , function(){
  $('#lineupDataA').empty();
  $('#lineupDataB').empty();
  $('#pitchingDataA').empty();
  $('#pitchingDataB').empty();

    for (var key in projectedLineupA){
            var tr = $('<tr>');
            for (var info in projectedLineupA[key]){
            // console.log(info , projectedLineupA[key][info]);
             tr.append("<td>" + projectedLineupA[key][info] + "</td>");
            };//closese second for var key
            $('#lineupDataA').append(tr);
        };//closes first var key

     for (var key in projectedLineupB){
            var tr = $('<tr>');
            for (var info in projectedLineupB[key]){
             //console.log(info , projectedLineupB[key][info]);
             tr.append("<td>" + projectedLineupB[key][info] + "</td>");
            };//closese second for var key
            $('#lineupDataB').append(tr);
        };//closes first var key   

        for (var key in projectedRotationA){
            var tr = $('<tr>');
            for (var info in projectedRotationA[key]){
            // console.log(info , projectedRotationA[key][info]);
             tr.append("<td class ='pitcherData'>" + projectedRotationA[key][info] + "</td>");
            };//closese second for var key
            $('#pitchingDataA').append(tr);
        };//closes first var key    

        for (var key in projectedRotationB){
            var tr = $('<tr>');
            for (var info in projectedRotationB[key]){
            // console.log(info , projectedRotationB[key][info]);
             tr.append("<td class ='pitcherData'>" + projectedRotationB[key][info] + "</td>");
            };//closese second for var key
            $('#pitchingDataB').append(tr);
        };//closes first var key   


 var printGame = this.childNodes[0].innerText;
 var printDate = this.childNodes[1].innerText;
 var printTime = this.childNodes[2].innerText;
 var printUrl = $(this).data("url");
 var printVenue = $(this).data("venue");
 

 $('#modalh2').text(printGame);
 $('#modalDate').text(printDate);
 $('#modalTime').text(printTime);
 $('#TicketsReturn').attr("href", printUrl)
 $('#venueReturn').text(printVenue);

 runWeather(printDate, printTime);
 
});

//PlayerLineup variable
var projectedLineupA = {
  one: {
    Order: '1',
    Player:'Brett Gardner',
    POS:'OF',
    R: '79',
    HR: '11',
    RBI: '48',
    SB: '17',
    AVG: '0.261'
  },
  two: {
    Order: '2',
    Player: 'Jacoby Ellsbury',
    POS: 'OF',
    R: '68',
    HR: '9',
    RBI: '50',
    SB: '23',
    AVG: '0.262'
  },
  three: {
    Order: '3',
    Player: 'Gary Sanchez',
    POS: 'C',
    R: '71',
    HR: '24',
    RBI: '72',
    SB: '5',
    AVG: '0.271'
  },
  four: {
    Order: '4',
    Player: 'Matt Holliday',
    POS: 'DH',
    R: '51',
    HR: '16',
    RBI: '64',
    SB: '1',
    AVG: '0.259'
  },
  five: {
    Order: '5',
    Player: 'Starlin Castro',
    POS: '2B',
    R: '58',
    HR: '16',
    RBI: '69',
    SB: '4',
    AVG: '0.271'
  },
  six: {
    Order: '6',
    Player: 'Didi Gregorius ',
    POS: 'SS',
    R: '66',
    HR: '16',
    RBI: '65',
    SB: '6',
    AVG: '0.270'
  },
  seven: {
    Order: '7',
    Player: 'Chase Headley',
    POS: '3B',
    R: '58',
    HR: '12',
    RBI: '50',
    SB: '5',
    AVG: '0.252'
  },
  eight: {
    Order: '8',
    Player: 'Greg Bird',
    POS: '1B',
    R: '72',
    HR: '27',
    RBI: '77',
    SB: '0',
    AVG: '0.255'
  },
  nine: {
    Order: '9',
    Player: 'Aaron Hicks',
    POS: 'OF',
    R: '42',
    HR: '9',
    RBI: '35',
    SB: '8',
    AVG: '0.230'
  }
}

var projectedRotationA ={
  one: {
    Order: '1',
    Player:'Masahiro Tanaka',
    POS: 'SP',
    IP: '180',
    W: '11',
    L: '9',
    ERA: '3.60',
    Fastball: '90.6 mph' 
  },
  two: {
    Order: '2',
    Player:'Michael Pineda',
    POS: 'SP',
    IP: '168',
    W: '10',
    L: '9',
    ERA: '3.43',
    Fastball: '94.1 mph' 
  },
  three: {
    Order: '3',
    Player:'CC Sabathia',
    POS: 'SP',
    IP: '172',
    W: '9',
    L: '11',
    ERA: '4.13',
    Fastball: '90 mph'  
  },
  four: {
    Order: '4',
    Player:'Chad Green',
    POS: 'SP',
    IP: '110',
    W: '6',
    L: '7',
    ERA: '4.09',
    Fastball: '94.3 mph' 
  }
}

var projectedLineupB = {
  one: {
    Order: '1',
    Player:'Curtis Granderson',
    POS:'OF',
    R: '85',
    HR: '26',
    RBI: '61',
    SB: '7',
    AVG: '0.241'
  },
  two: {
    Order: '2',
    Player: 'David Wright',
    POS: '3B',
    R: '36',
    HR: '9',
    RBI: '32',
    SB: '5',
    AVG: '0.261'
  },
  three: {
    Order: '3',
    Player: 'Yoenis Cespedes',
    POS: 'OF',
    R: '85',
    HR: '31',
    RBI: '72',
    SB: '5',
    AVG: '0.283'
  },
  four: {
    Order: '4',
    Player: 'Jay Bruce',
    POS: 'OF',
    R: '74',
    HR: '28',
    RBI: '90',
    SB: '7',
    AVG: '0.236'
  },
  five: {
    Order: '5',
    Player: 'Neil Walker',
    POS: '2B',
    R: '70',
    HR: '23',
    RBI: '70',
    SB: '3',
    AVG: '0.275'
  },
  six: {
    Order: '6',
    Player: 'Asdrubal Cabrera',
    POS: 'SS',
    R: '65',
    HR: '18',
    RBI: '59',
    SB: '6',
    AVG: '0.269'
  },
  seven: {
    Order: '7',
    Player: 'Lucas Duda',
    POS: '1B',
    R: '56',
    HR: '22',
    RBI: '64',
    SB: '1',
    AVG: '0.255'
  },
  eight: {
    Order: '8',
    Player: 'Travis dArnaud',
    POS: 'C',
    R: '39',
    HR: '10',
    RBI: '34',
    SB: '0',
    AVG: '0.253'
  },
  nine: {
    Order: '9',
    Player: 'Jacob deGrom',
    POS: 'P',
    R: '6',
    HR: '6',
    RBI: '2',
    SB: '0',
    AVG: '0.143'
  }
}

var projectedRotationB ={
  one: {
    Order: '1',
    Player:'Noah Syndergaard',
    POS: 'SP',
    IP: '197',
    W: '16',
    L: '6',
    ERA: '2.56',
    Fastball: '98 mph' 
  },
  two: {
    Order: '2',
    Player:'Jacob deGrom',
    POS: 'SP',
    IP: '177',
    W: '12',
    L: '8',
    ERA: '2.95',
    Fastball: '93.4 mph' 
  },
  three: {
    Order: '3',
    Player:'Steven Matz',
    POS: 'SP',
    IP: '149',
    W: '9',
    L: '8',
    ERA: '3.32',
    Fastball: '93.6 mph'  
  },
  four: {
    Order: '4',
    Player:'Matt Harvey',
    POS: 'SP',
    IP: '125',
    W: '8',
    L: '6',
    ERA: '3.38',
    Fastball: '94.5 mph' 
  }
}

