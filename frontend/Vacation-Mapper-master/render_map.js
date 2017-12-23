// TODO: add a legend for each color of category
var map;
var gmarkers = [];
var image = [];
var infowindow;
var maxCountByCategory = {};  // for scaling size of circle. keeps track of maxCount for each category

function initMap() {
  // set checkbox default property
  $('.category').prop('checked', false);
  $('.subcategory').prop('checked', false);


  // create the map
  var mapOptions = {
    zoom: 4,
    center: {lat: 38.5000, lng: -98.0000},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // get JSON data and add each place to the gmarkers list
  $.when(
    // chrome settings don't allow loading local files, so i had to upload the following files to a public location
    $.getJSON("https://raw.githubusercontent.com/adinger/AlgorithmicMap/master/data/city_coordinates.json"),  
    $.getJSON("https://raw.githubusercontent.com/adinger/AlgorithmicMap/master/data/cities_by_category.json")
  ).done(function (citiesData, categoriesData) {
    var cityCoordinates = JSON.parse(citiesData[2].responseText);
    var citiesByCategory = JSON.parse(categoriesData[2].responseText);

    for (var category in citiesByCategory) {
      cities = citiesByCategory[category];  
      for (var c = 0; c < cities.length; c++) {
        count = cities[c].count;

        // update the maximum count for this category
        if ( !(category in maxCountByCategory) || (count > maxCountByCategory[category]) ) {
          maxCountByCategory[category] = count;
        }
      }

      // add all the cities for this category to the map
      for (var c = 0; c < cities.length; c++) {
        cityObj = cities[c];
        cityName = cityObj.city;
        lat = cityCoordinates[cityName]["lat"];
        lon = cityCoordinates[cityName]["lon"];
        addLocation(cityObj, lat, lon, category);
      }
    }
  });

  // adds the place to the gmarkers list
  function addLocation(cityObj, lat, lon, category) {
    //alert(maxCountByCategory[category]);
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lon),
      map: map,
      title: cityObj.city,
      icon: getCircle(cityObj.score, category, cityObj.count, maxCountByCategory[category])
    });
    marker.mycategory = category;
    var infowindow = new google.maps.InfoWindow({
      content: ''
    });
    var cityName = cityObj.city.replace('_', ' ');
    var cat = category.charAt(0).toUpperCase() + category.slice(1);  // capitalize first letter
    bindInfoWindow(marker, map, infowindow, '<h4>'+cat+' in '+cityName+
      '</h4><p>Average rating: '+cityObj.score+'</p><p>Count: '+cityObj.count+'</p>')
    marker.setVisible(false);
    gmarkers.push(marker);
    return 0;
  }

  function bindInfoWindow(marker, map, infowindow, html) {
    google.maps.event.addListener(marker, 'mouseover', function() { 
      infowindow.setContent(html); 
      infowindow.open(map, marker); 
    }); 
    google.maps.event.addListener(marker, 'mouseout', function() { 
      infowindow.close(); 
    }); 
  }

  // shows the marker if it should be shown (helper for boxclick())
  function show(category) {
    for (var i = 0; i < gmarkers.length; i++) {
      if (gmarkers[i].mycategory == category) 
        gmarkers[i].setVisible(true);
    }
    document.getElementById(category).checked = true;
    $('#'+category).prop('checked', true);
  }

  // hides the marker if it should be hidden (helper for boxclick())
  function hide(category) {
    for (var i = 0; i < gmarkers.length; i++) {
      if (gmarkers[i].mycategory == category) 
        gmarkers[i].setVisible(false);
    }
    document.getElementById(category).checked = false;
    $('#'+category).prop('checked', false);
  }

  // shows the markers if their category is checked, hides them if unchecked
  function boxclick(box,category) {
    if (box.checked || $(box).prop('checked')) {
      show(category);
    } else {
      hide(category);
    }
  }

  $('.subcategory').click(function (event) {
    $(this).prop('checked', this.checked);
    boxclick(this, event.target.id);  // the id of the clicked checkbox contains the category name
  });


  //// click handlers for the super categories
  cuisines = ["asianfusion","latin","southern","italian","greek","mediterranean"];
  activities = ["scuba", "rafting", "surfing","skydiving","hiking","beaches"];

  $('#allcuisines').click(function (event) {
    for (var c in cuisines) {      
      cuisine = cuisines[c];
      $('#'+cuisine).prop('checked', this.checked);
      boxclick($('#'+cuisine), cuisine);
    }
  });

  $('#allactivities').click(function (event) {
    for (var c in activities) {      
      activity = activities[c];
      $('#'+activity).prop('checked', this.checked);
      boxclick($('#'+activity), activity);
    }
  });
} 

jQuery(document).ready(function(){
  initMap();
});

var colors = {  // CSS colors for each category
  "asianfusion":"deepskyblue",
  "latin":"purple",
  "southern":"orchid",
  "italian":"orangered",
  "greek":"lightseagreen",
  "mediterranean":"green",
  "scuba":"deeppink",
  "rafting":"royalblue",
  "surfing":"turquoise",
  "skydiving":"mediumvioletred",
  "hiking":"violet",
  "beaches":"darksalmon"
}

// creates the circle using the magnitude to determine size
function getCircle(score, category, count, maxCount) {
  if (activities.indexOf(category) > -1) count *= 10;
  var circle = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: colors[category],
    fillOpacity: score/7,
    scale: .1*count, //Math.pow(2, score) / 2,
    strokeColor: 'white',
    strokeWeight: .5
  };
  return circle;
}
