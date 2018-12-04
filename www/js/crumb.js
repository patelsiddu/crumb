function toRadians(degrees) {
  return degrees * Math.PI / 180;
};
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
  var d = R * c;



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
	var description = "";
    var len = localStorage.length;
	var indices = [];
	
	 
	if(lat==0||lon ==0){
		return;
	}else{
		if(len >0)
		{
			for ( var i = 0; i < len; i++ ) {
				indices.push(i);
			    var a = localStorage.getItem(localStorage.key(i));
				combined.push(a);
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
			closestIndex = indices[0];
			closestDist = list_of_dist[closestIndex];
			var splited = combined[closestIndex];
			
			closetLat = parseFloat(splited[0]);
			closetLon = parseFloat(splited[1]);
			closesDescription = splited[2];
			UpdateNextDestination(0);
			$("#NextText").text(closesDescription +"at"+closestDist+"m");
		}
	}
}



function UpdateNextDestination(index)
{
	if(index<=localStorage.length)
	{
		if(list_of_dist[index]>minDist){
			nextDist = closestDist;
			nextHeading = bearing([currentLat,currentLon],[closestLat,closestLon]);
		}
		return;
	}else{
		UpdateNextDestination(index+1)
	}
}
function saveLocation(coord){	
	var len = localStorage.length;
	if (closestDist>minDist)
	{
		localStorage.setItem(""+len,lat+"/"+lon+"/" + description);
	}else
	{
		localStorage.setItem(""+closestIndex,currentLat+"/"+currentLon+"/" + closesDescription);
	}
}

function getPosition() {
   var options = {
      enableHighAccuracy: true,
      maximumAge: 3600000
   }
   var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

   function onSuccess(position) {
      currentLat = position.coords.latitude;
	  currentLon = position.coords.longitude;
	   
    }
      
  

   function onError(error) {
      alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
   }
}

function watchPosition() {
   var options = {
      maximumAge: 3600000,
      timeout: 3000,
      enableHighAccuracy: true,
   }
   var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);

   function onSuccess(position) {
      currentLat = position.coords.latitude;
	  currentLon = position.coords.longitude;
	  UpdateMinAndCurrentLocation()
	  
	  
   };

   function onError(error) {
      alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
   }
}
function imgMouseDown()
{

	document.getElementById('arrow').width = ""+ (w*0.95);
	document.getElementById('arrow').height = "" +(h*0.95);
}
function imgMouseUp()
{

	document.getElementById('arrow').width = ""+ (w);
	document.getElementById('arrow').height = "" +(h);
}
function imgMouseOut()
{
	document.getElementById('arrow').width = ""+ (w);
	document.getElementById('arrow').height = "" +(h);
}
	
var currentLat = 0;
var currentLon = 0;
var minDist = 20;
var closestLon = 0;
var closestLat = 0 ;
var closestDist = 0;
var closestIndex = 0;
var closesDescription = "";
var nextDist=0;
var nextHeading = 0;
var list_of_dist = [];
var w;
var h;
$(document).ready(function(){
w = parseInt(document.getElementById('arrow').width);
h = parseInt(document.getElementById('arrow').height); 
document.getElementById('arrow').addEventListener('touchstart',imgMouseDown,false);	
document.getElementById('arrow').addEventListener('touchend',imgMouseUp,false);	
document.getElementById('arrow').addEventListener('touchcancel',imgMouseOut,false);	
 document.body.addEventListener('touchmove', function(e) {
                    e.preventDefault();
                }, false);

	watchPosition();
	
function processEvent(event) {
	var currentAngle = Math.round(event.alpha)-180;
	
	var Degree = (currentAngle-90+nextHeading)+"deg";
	$("#arrow").css("transform","rotate("+Degree+")");
	  
};
window.addEventListener("deviceorientation",processEvent, true);



	
});


