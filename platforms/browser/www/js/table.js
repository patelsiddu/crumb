var currentLat = 0;
var currentLon = 0;
var list_of_dist = [];
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
function cellClick(index)
{
	var a =localStorage.getItem("location"+(index+1)).split('/');
	sessionStorage.setItem('nextLat', a[0] );
	sessionStorage.setItem('nextLon', a[1] );
	sessionStorage.setItem('nextDes', a[2] );
	
	window.location = "index.html";
	
}
function addCell(table,index,location,description,distance){
var clicFunctionCall = "<button type=\"button\" class=\"block\" onclick=cellClick("+index+")> Location"+(index+1) +"</button>";
var cell1 = '<td>'+clicFunctionCall+'</td>';
	
var cell2 = '<td>'+description+'</td>';	
var cell3 = '<td>'+distance+'</td>';	
table.insertAdjacentHTML('beforeend', '<tr>' +cell1 +cell2 +cell3+'</tr>');
	
}
function populateIndices(){
	var lat = currentLat;
	var lon = currentLon;
	var len = getStorageLength();
	var indices = [];
	list_of_dist = [];
	var combined = [];
	for (var cell =0;cell<len;cell++)
	{
		indices.push(cell);
		var a = localStorage.getItem("location"+(cell+1));
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
	return indices;
	
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
function drawTable(){
	var len = getStorageLength();
	var element = document.getElementById("table");
	var indices = populateIndices();
	for (var i =0;i<len;i++)
	{
		var combined = localStorage.getItem("location"+(indices[i]+1));
		var splited = combined.split("/");;
		 
		addCell(element,indices[i],"Location"+(i+1),splited[2],list_of_dist[indices[i]]);
	}
	
}

$(document).ready(function(){
	sessionStorage.clear();
	getPosition(drawTable);
	
});

