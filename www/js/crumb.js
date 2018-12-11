var currentLat = 0;
var currentLon = 0;
var minDist = 20;

var nextDist=0;
var nextHeading = 0;
var list_of_dist = [];

var indices = [];


function toRadians(degrees) {
  return degrees * Math.PI / 180;
};
function getStorageLength(){
	if("len" in localStorage){
		return parseInt(localStorage.getItem("len"));
	} else {
		
		return 0
	}
}
function setStorageLength(length){
	
		localStorage.setItem("len",""+length);
	
}
// Converts from radians to degrees.
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}
function dist(coords1, coords2) {
  

  var lon1 = coords1[0];
  var lat1 = coords1[1];

  var lon2 = coords2[0];
  var lat2 = coords2[1];

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRadians(x1);
  var x2 = lon2 - lon1;
  var dLon = toRadians(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = 1000*R * c;



  return d;
}

function bearing(coords1, coords2){
  
  
  var startLat = toRadians(coords1[0]);
  var startLng = toRadians(coords1[1]);
  var destLat = toRadians(coords2[0]);
  var destLng = toRadians(coords2[1]);

  y = Math.sin(destLng - startLng) * Math.cos(destLat);
  x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  return (brng + 360) % 360;
}
function UpdateMinAndCurrentLocation(){
	var lat = currentLat;
	var lon = currentLon;
	var combined = [];
	list_of_dist = [];
	
    var len = getStorageLength();
	
	indices = [];

	if(lat==0||lon ==0){
		return;
	}else{
		if(len >0)
		{
			
			for ( var i = 0; i < len; i++ ) {
				indices.push(i);
			    var a = localStorage.getItem("location"+(i+1));
				
				var splitedA = a.split("/");
				var temp_latA = parseFloat(splitedA[0]);
				var temp_lonA = parseFloat(splitedA[1]);
				var disA = dist([lat,lon],[temp_latA,temp_lonA]);
				
				list_of_dist.push(disA);
				
			}
			
			indices.sort(function(a,b)
			{
				return list_of_dist[a] - list_of_dist[b] 
			});
				
			
			
			
			
			UpdateNextDestination(0);
			
		}
	}
	
}

function UpdateNextDestination(index){
	var temp_lat = 0;
	var temp_lon = 0;
	var temp_dist = 0;
	if("nextLat" in sessionStorage){
		temp_lat = parseFloat(SessionStorage.getItem("nextLat"));
		temp_lat = parseFloat(SessionStorage.getItem("nextLon"));
		nextHeading = bearing([currentLat,currentLon],[temp_Lat,temp_Lon]);
		temp_dist =  dist([currentLat,currentLon],[temp_Lat,temp_Lon]);
		if (temp_dist<minDist){
			$("#NextText").text("you have reached your destination");
			sessionStorage.clear();
		}else {
			nextDist = temp_dist;
		}
	}else if(index<getStorageLength())
	{	var a = localStorage.getItem("location"+(indices[index]+1));
		var splitedA = a.split("/");
		if(list_of_dist[indices[index]]>minDist){
			
			var closestLat =  parseFloat(splitedA[0]);
			var closestLon =  parseFloat(splitedA[1]);
			nextHeading = bearing([currentLat,currentLon],[closestLat,closestLon]);
			
			$("#NextText").html(splitedA[2] +" at "+list_of_dist[index]+"m");
		}else{
			
			$("#curLocText").text("You are at:" + splitedA[2]);
			UpdateNextDestination(index+1)
		}
	 
	}
	
	
}

function saveLocation(){	
	
	
	var len = getStorageLength();
	
	var lat = currentLat;
	var lon = currentLon;
	if (list_of_dist[indices[0]]>minDist || len==0)
	{
		localStorage.setItem("location"+(len+1),lat+"/"+lon+"/" + description);
		setStorageLength(len+1);
	}else
	{
				
		localStorage.setItem("location"+(indices[0]+1),currentLat+"/"+currentLon+"/" + closesDescription);
	}
    
}

function getPosition(callback) {
   var options = {
      enableHighAccuracy: true,
      maximumAge: 3600000
   }
   var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

   function onSuccess(position) {
      currentLat = position.coords.latitude;
	  currentLon = position.coords.longitude;
	  
	  callback();
    }
      
  

   function onError(error) {
      alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
   }
}

function watchPosition(callback) {
   var options = {
      maximumAge: 3600000,
      timeout: 3000,
      enableHighAccuracy: true,
   }
   var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);

   function onSuccess(position) {
      //currentLat = position.coords.latitude;
	  //currentLon = position.coords.longitude;
	  currentLat = 43.642613;
	  currentLon = -79.387059;
	
	  
	  
	  callback();
	  
   };

   function onError(error) {
      alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
   }
}


$(document).ready(function(){

localStorage.clear();
$("#arrow").click(function(){
	
    localStorage.setItem("location1",43.642613+"/"+(-79.387059)+"/" + "CN tower");
	setStorageLength(1);
	
	
	
	
	localStorage.setItem("location2",43.743407+"/"+(-79.582001)+"/" + "kipling");
	setStorageLength(2);
	
	v = $("#desBox").val();
	alert(v);
	//alert("storage was cleared and the length is" + localStorage.length);
	//getPosition(saveLocation);
	
});
$(function() {
  $("#main").swipe( {
    //Generic swipe handler for all directions
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
     if(direction=="up"){
		window.location = "table.html"
	 }
	 
    }
  });
});


watchPosition(UpdateMinAndCurrentLocation);
	
function processEvent(event) {
	var currentAngle = Math.round(event.alpha)-180;
	
	var Degree = (currentAngle-90+nextHeading)+"deg";
	$("#arrow").css("transform","rotate("+Degree+")");
	  
};
window.addEventListener("deviceorientation",processEvent, true);



	
});


