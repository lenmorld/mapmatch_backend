function submitSignUp(){
  var userPassword = $("#password").val();
  var userEmail = $("#email").val();
  var userGender = "";
  if($('#male').is(':checked')) {
    userGender = "M";
  }
  else {
    userGender = "F";
  }
  var userName = $("#username").val();
  var userFirstName = $("#first_name").val();
  var userLastName = $("#last_name").val();
  var requestData = {"firstname": userFirstName,
  "lastname": userLastName,
  "email": userEmail,
  "password": userPassword,
  "username": userName,
  "gender": userGender};
  console.log(requestData);
  $.ajax({
    url: 'http://34.239.117.6:9000/users/signup',
    type:'POST',
    dataType: 'json',
    data: JSON.stringify(requestData),
    success: function(data) {
      console.log(data);
      alert("Sign up successful!")
      window.location.replace("/login.html");
    }
  });
}

function submitLogIn(){
  var userName = $("#email").val();
  var password = $("#password").val();
  var requestData = {"email": userName,
  "password": password};
  $.ajax({
    url: 'http://34.239.117.6:9000/users/login',
    type:'POST',
    dataType: 'json',
    data: requestData,
    success: function(data) {
      console.log(data.auth);
      if(data.auth == false){
        alert("Username or password incorrect!");
      }
      else {
        $("#login-form").fadeOut(1000);
        $("#nav-bar").fadeOut(1000);
        $("#map").fadeIn(1000);
        $("#options").fadeIn(1000);
        showMap();
      }
    }
  });
}

function showMap(){
  function shareButton(lat, long){
      var btn = $('<button class="btn waves-effect waves-light" type="submit" name="action">Share Location</button>');
      btn.bind('click', function(){
          $.ajax({
              url: "http://34.239.117.6:9000/users/update",
              type: 'POST',
              crossDomain: true,
              dataType: 'json',
              data: {
                  email: "joeblow@gmail.com",
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


  var map;
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
  								if(map.controls[google.maps.ControlPosition.TOP_CENTER].length != 0){
  									map.controls[google.maps.ControlPosition.TOP_CENTER].pop();
  								}
                  map.controls[google.maps.ControlPosition.TOP_CENTER].push(shareButton(position.coords.longitude, position.coords.latitude));
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


      var pos;
  	map = new google.maps.Map(document.getElementById('map'), {
  		zoom: 17,
  		center: canada
      });
  	var myMarker = new google.maps.Marker({
  		map: map,
  		animation: google.maps.Animation.DROP,
          position: canada
      });
      addYourLocationButton(map, myMarker);




}
