
var USEREMAIL = "";
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
  "gender": userGender,
  "lat": 0,
  "long": 0};
  console.log(requestData);
  $.ajax({
    url: 'http://34.239.117.6:9000/users/signup',
    type:'POST',
    dataType: 'json',
    data: requestData,
    success: function(data) {
      console.log(data);
      alert("Sign up successful!")
      window.location.replace("../public/login.html");
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
        var userInterests = data.user.interests;
        var userMusic = data.user.music;
        var userMovies = data.user.movies;
        console.log(data);
        USEREMAIL = data.user.email;
        $("#login-form").fadeOut(1000);
        $("#nav-bar").fadeOut(1000);
        $("#map").fadeIn(1000);
        $("#options").fadeIn(1000);
        for(var i = 0; i < userInterests.length;i++){
          $("#interests").text($("#interests").val()+userInterests[i]+",");
        }
        for(var i = 0; i < userMusic.length;i++){
          $("#music").text($("#music").val()+userMusic[i]+",");
        }
        for(var i = 0; i < userMovies.length;i++){
          $("#movie").text($("#movie").val()+userMovies[i]+",");
        }
        Materialize.updateTextFields();
        initMap(USEREMAIL);

      }
    }

  });
}
