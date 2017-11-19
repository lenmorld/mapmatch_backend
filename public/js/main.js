var map;
var userEmailGlobal = "";
function shareButton(lat, long){
	var btn = $('<button class="btn waves-effect waves-light" type="submit" name="action">Share Location</button>');
	btn.bind('click', function(){
		$.ajax({
			url: "http://34.239.117.6:9000/users/update",
			type: 'POST',
			crossDomain: true,
			dataType: 'json',
			data: {
				email: userEmailGlobal,
				lat: lat,
				long: long
			},
			success: function (response) {
				console.log(response);
				// handle the response
			},
			error: function (xhr, status) {
				// handle errors
				console.log(status);
			}
		});
	});
	return btn[0];
}

function convertTextToArray(text){
	var array = text.split(',');
	return array;
}

function getButton(){
	var btn = $('<button class="btn waves-effect waves-light" type="submit" name="action">Find People</button>');

	btn.bind('click', function(){
		var userGender = "";
		if($('#male').is(':checked')) {
			userGender = "M";
		}
		else {
			userGender = "F";
		}
		var arrayOfInterests = convertTextToArray($('#interests').val());
		var arrayOfMusic = convertTextToArray($('#music').val());
		var arrayOfMovies = convertTextToArray($('#movie').val());
		var userData = {
			"email": userEmailGlobal,
			"gender": userGender,
			"interests": arrayOfInterests,
			"music": arrayOfMusic,
			"movies": arrayOfMovies
		};

		$.ajax({
			url: "http://34.239.117.6:9000/users/",
			type: 'POST',
			crossDomain: true,
			data: userData,
			dataType: 'json',
			success: function (response) {
				console.log(response);
				console.log(response.users[0]);
				for (var i = 0; i < response.users.length; i++) {
					var latitude = response.users[i].lat;
					var longitude = response.users[i].long;
					var titleuser = response.users[i].firstname;
					console.log(latitude + " " + longitude);
					latLng = new google.maps.LatLng(longitude,latitude);
					var marker = new google.maps.Marker({
						position: latLng,
						map: map,
						title: 'Hello!'
					});
					console.log("Finished Marker");
					marker.addListener('click', function() {
						$('#popup').modal('open');
					});
				}

			},
			error: function (xhr, status) {
				// handle errors
				console.log(status);
			}
		});
	});
	return btn[0];
}



var canada = {lat:43.009953, lng: -81.273613};

function addYourLocationButton(map, marker)
{
	var controlDiv = document.createElement('div');

	var firstChild = document.createElement('button');
	firstChild.style.backgroundColor = '#fff';
	firstChild.style.border = 'none';
	firstChild.style.outline = 'none';
	firstChild.style.width = '28px';
	firstChild.style.height = '28px';
	firstChild.style.borderRadius = '2px';
	firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
	firstChild.style.cursor = 'pointer';
	firstChild.style.marginRight = '10px';
	firstChild.style.padding = '0px';
	firstChild.title = 'Your Location';
	controlDiv.appendChild(firstChild);

	var secondChild = document.createElement('div');
	secondChild.style.margin = '5px';
	secondChild.style.width = '18px';
	secondChild.style.height = '18px';
	secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
	secondChild.style.backgroundSize = '180px 18px';
	secondChild.style.backgroundPosition = '0px 0px';
	secondChild.style.backgroundRepeat = 'no-repeat';
	secondChild.id = 'you_location_img';
	firstChild.appendChild(secondChild);

	google.maps.event.addListener(map, 'dragend', function() {
		$('#you_location_img').css('background-position', '0px 0px');
	});

	firstChild.addEventListener('click', function() {
		var imgX = '0';
		var animationInterval = setInterval(function(){
			if(imgX == '-18') imgX = '0';
			else imgX = '-18';
			$('#you_location_img').css('background-position', imgX+'px 0px');
		}, 300);
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				marker.setPosition(latlng);
				map.setCenter(latlng);
				clearInterval(animationInterval);
				$('#you_location_img').css('background-position', '-144px 0px');
				if(map.controls[google.maps.ControlPosition.TOP_CENTER].length || map.controls[google.maps.ControlPosition.BOTTOM_CENTER].length!= 0){
					map.controls[google.maps.ControlPosition.TOP_CENTER].pop();
					map.controls[google.maps.ControlPosition.BOTTOM_CENTER].pop();
				}
				map.controls[google.maps.ControlPosition.TOP_CENTER].push(shareButton(position.coords.longitude, position.coords.latitude));
				map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(getButton());
				console.log(position.coords.longitude + " " + position.coords.latitude);
			});
		}
		else{
			clearInterval(animationInterval);
			$('#you_location_img').css('background-position', '0px 0px');
		}
	});

	controlDiv.index = 1;
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}

function initMap(USEREMAIL) {
	userEmailGlobal = USEREMAIL;
	var pos;
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 17,
		center: canada,
	});
	var myMarker = new google.maps.Marker({
		map: map,
		animation: google.maps.Animation.DROP,
		position: canada
	});
	addYourLocationButton(map, myMarker);
}

$(document).ready(function(e) {
	$('.modal').modal();
});
