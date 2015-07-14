var map; 
var icon; 
var foursquareIcon = "<img src='images/foursquare.png'>";//acknowledgment required by Foursquare
var tips = [];

//Information on parks and gardens in Richmond, VA
var markers = [
  {
  name: 'Maymont Park',
  lat: 37.5348,//info from google.com
  longitude: -77.4784,
  streetAddress: '1700 Hampton St',//info from foursquare.com
  url: 'https://foursquare.com/v/maymont/4ad4f29af964a520d9ff20e3',
  venueId: '4ad4f29af964a520d9ff20e3',
  category: 'parks',//allows to search by category in search box
  visible: ko.observable(true),
  boolTest: true,
  id: "nav0"//appears in list
  },

  {
  name: 'Byrd Park',
  lat: 37.5408,
  longitude: -77.4839,
  streetAddress: '600 S Boulevard Idlewood Ave',
  url: 'https://foursquare.com/v/byrd-park/4af883bff964a520f60d22e3',
  venueId: '4af883bff964a520f60d22e3',
  category: 'parks',
  visible: ko.observable(true),
  boolTest: true,
  id: "nav1"
  },

  {
  name: 'Lewis Ginter Botanical Garden',
  lat: 37.6212,
  longitude: -77.4711,
  streetAddress: '1800 Lakeside Ave at Hillard Rd',
  url: 'https://foursquare.com/v/lewis-ginter-botanical-garden/4ad4f29af964a520dcff20e3',
  venueId: '4ad4f29af964a520dcff20e3',
  category: 'gardens',
  visible: ko.observable(true),
  boolTest: true,
  id: "nav2"
  },

  {
  name: 'Joseph Bryan Park',
  lat: 37.5935,
  longitude: -77.4737,
  streetAddress: '4308 Hermitage Rd',
  url: 'https://foursquare.com/v/joseph-bryan-park/4af5972cf964a5200afa21e3',
  venueId: '4af5972cf964a5200afa21e3',
  category: 'parks',
  visible: ko.observable(true),
  boolTest: true,
  id: "nav3"
  },

  {
  name: 'Monroe Park',
  lat: 37.5465,
  longitude: -77.4503,
  streetAddress: '520 W Franklin St',
  url: 'https://foursquare.com/v/monroe-park/4b0307daf964a5201a4c22e3',
  venueId: '4b0307daf964a5201a4c22e3',
  category: 'parks',
  visible: ko.observable(true),
  boolTest: true,
  id: "nav4"
  },
];

//gets user tips and reviews from Foursquare and provides an error message if tip is unavailable
function getTips() {
  for (i=0; i < markers.length; i++) {
    var foursquareUrl = 'https://api.foursquare.com/v2/venues/' + markers[i].venueId + '?client_id=YU001YIMFNXZGOX3W3VDKCXA3ZLUXDODR3BISZQQ4QUQCUYX&client_secret=QF0DY534VR4MD2HUYM4CIP204L0W3BAJGOOIDUON5HSQXXBF&v=20150504';
    $.getJSON(foursquareUrl)
      .done(function(response){
        var tipText,
          tipId,
          tips;
        tipId = response.response.venue.id;
        if( response.response.venue.tips.count > 0) {
          tipText = response.response.venue.tips.groups[0].items[0].text;
        } else {
          tipText = "No tips at this time...";
        }
        tips = tipId + '%' + tipText;
        getTipsCallback(tips);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        alert('Error connecting to Foursquare: ' + textStatus);
      });
    }
  }

function getTipsCallback(tip) {
  var tipSplit = tip.split('%');
  for (i=0; i<markers.length; i++) {
    if (markers[i].venueId === tipSplit[0]) {
      markers[i].tips = tipSplit[1];
      return;
    }
  }

}


// loads Google map
function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=false&callback=initialize';
    document.body.appendChild(script);
}

window.onload = loadScript;
//creates the map on screen
function initialize() {
  var mapOptions = {
    zoom: 10,
    center: new google.maps.LatLng(37.5333, -77.4667),
    disableDefaultUI: true,
    mapTypeControl: true,
  };
 

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);//applies map details
  getTips();
  setMarkers(markers);
  setAllMap();

  function resetMap() {
    var windowWidth = $(window).width();
    if (windowWidth <= 600) {
      map.setZoom(10);
      map.setCenter(mapOptions.center);
    }
    else {
      map.setZoom(13);
      map.setCenter(mapOptions.center);
    }
  }
 
  $(window).resize(function() {
    resetMap();
  });
}

function setAllMap() {
  for (var i=0; i < markers.length; i++) {
    if (markers[i].boolTest === true) {
      markers[i].holdMarker.setMap(map);
    }
    else {
      markers[i].holdMarker.setMap(null);
    }
  }
}

function setMarkers(location) {
  for (i=0; i<location.length; i++){

  
    location[i].holdMarker = new google.maps.Marker({
      position: new google.maps.LatLng(location[i].lat, location[i].longitude),
      map: map,
      title: location[i].name,
      icon: icon,
    });

    var infowindow = new google.maps.InfoWindow({
      maxWidth: 200});

//allows the window to move when markers are clicked
      function offsetCenter(latlng,offsetx,offsety) {
        var scale = Math.pow(10, map.getZoom());
        var nw = new google.maps.LatLng(
          map.getBounds().getNorthEast().lat(),
          map.getBounds().getSouthWest().lng()
        );

        var pixelCenter = map.getProjection().fromLatLngToPoint(latlng);
        var pixelOffset = new google.maps.Point((offsetx/scale) ||0, (offsety/scale) ||0);

        var newPixelCenter = new google.maps.Point(
          pixelCenter.x - pixelOffset.x,
          pixelCenter.y + pixelOffset.y
        );

        var newCenter = map.getProjection().fromPointToLatLng(newPixelCenter);
        return newCenter;
      }
  //functionality for clicking the marker
    google.maps.event.addListener(location[i].holdMarker, 'click', (function(marker, i) {
      return function () {
        infowindow.setContent(location[i].name + '<br>' + location[i].streetAddress + '<br>' + '<a href = ' + location[i].url + ' id="fslink">Click here to read more</a>' + '<p>Local Reviews: ' + location[i].tips + '<br>' + foursquareIcon);
        infowindow.open(map,this);
        var windowWidth = $(window).width();
        if(windowWidth <= 1080) {
          map.setZoom(14);
        }
        else {
          map.setZoom(16);
        }
        map.setCenter(offsetCenter(marker.getPosition(), 10, -200));
      };
    })(location[i].holdMarker, i));

//functionality for clicking item in list
    var searchNav = $('#nav' + i);
    searchNav.click((function(marker, i) {
      return function() {
        infowindow.setContent(location[i].name + '<br>' + location[i].streetAddress + '<br>' + '<a href = ' + location[i].url + ' id="fslink">Click here to read more</a>' + '<p>Local Reviews: ' + location[i].tips + '<br>' + foursquareIcon);
        infowindow.open(map,marker);
        map.setZoom(16);
        map.setCenter(offsetCenter(marker.getPosition(), 10, -200));

      };
    })(location[i].holdMarker, i));
  }
}

//Connects search bar and lists for search functionality
var viewModel = {
  query: ko.observable(''),
};

viewModel.markers = ko.dependentObservable(function() {
  var self = this;
  var search = self.query().toLowerCase();
  return ko.utils.arrayFilter(markers, function(marker) {
    if (marker.name.toLowerCase().indexOf(search) >=0 || marker.category.toLowerCase().indexOf(search) >=0) {
      marker.boolTest = true;
      return marker.visible(true);
    }
    else {
      marker.boolTest = false;
      setAllMap();
      return marker.visible(false);
    }
  });
}, viewModel);

ko.applyBindings(viewModel);

$("#input").keyup(function() {
  setAllMap();
});

//allos the list to scroll up and down
function yesNav() {
  $("#search-nav").show();
  var scrollerHeight = $("#scroller").height() + 55;
  if ($(window).height() < 600) {
    $("#search-nav").animate({
      height: scrollerHeight - 100,
    }, 500, function() {
      $(this).css('height', 'auto').css("max-height", 100);
    });
  }
  else {
    $("#search-nav").animate({
      height: scrollerHeight,
    }, 500, function() {
      $(this).css('height', 'auto').css("max-height", 300);
    });
  }
}


