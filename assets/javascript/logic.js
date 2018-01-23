$(document).ready(function() {

var config = {
    apiKey: "AIzaSyDH9lrP91Ax_U1W7-cPwhPD_Rm_RGpgZJw",
    authDomain: "train-schedules-uci.firebaseapp.com",
    databaseURL: "https://train-schedules-uci.firebaseio.com",
    projectId: "train-schedules-uci",
    storageBucket: "train-schedules-uci.appspot.com",
    messagingSenderId: "593249950934"
};

firebase.initializeApp(config);

var database = firebase.database();

var name = "";
var destination = "";
var firstArrival = 0;
var frequency = "";

$("#add").on("click", function(event) {
  event.preventDefault();

  name = $("#name").val().trim();
  destination = $("#destination").val().trim();
  frequency = $("#frequency").val().trim();
  firstArrival = $("#firstArrival").val().trim();
  calculateTime();

  reset();
  });

  database.ref().on("child_added", function(childSnapshot) {


    $("#data").append("<tr><td> " + childSnapshot.val().TrainName + " </td><td> " + childSnapshot.val().Destination + " </td><td>" + childSnapshot.val().Frequency + " minutes </td><td>" + childSnapshot.val().NextTrain + " </td><td> " + childSnapshot.val().MinAway + " minutes </td></tr>");


  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  })

  database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

    $("#name").text(snapshot.val().TrainName);
    $("#destination").text(snapshot.val().Destination);
    $("#frequency").text(snapshot.val().Frequency);
  });

function calculateTime(){
    var firstArrivalFixed = moment(firstArrival, "hh:mm").subtract(1, "days");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstArrivalFixed), "minutes");
    var remainder = diffTime % frequency;
    var remainingTime = frequency - remainder;
    var nextTrain = moment().add(remainingTime, "minutes");
    var nextTrainFormatted = moment(nextTrain).format("hh:mm")

    database.ref().push({
     TrainName: name,
     Destination: destination,
     Frequency: frequency,
     FirstArrival: firstArrival,
     DateAdded: firebase.database.ServerValue.TIMESTAMP,
     NextTrain: nextTrainFormatted,
     MinAway: remainingTime
   });
}

function reset(){
  $("#name").val("");
  $("#destination").val("");
  $("#firstArrival").val("");
  $("#frequency").val("");
}

});

