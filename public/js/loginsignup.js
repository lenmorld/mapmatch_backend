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
        initMap();
      }
    }
  });
}
