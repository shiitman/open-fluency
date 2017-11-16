var drawGrid = new Draw(document.getElementById("canvas"));
var micro = new Microphone();
var fluency = new Fluency(drawGrid, micro);

function initInput(id, func){
  $("#"+id).keyup(function(){
  //  $("#"+id).change();
  });
  $("#"+id).change(function(){
    $("#"+id).val(fluency[func]($("#"+id).val()));    
  });
}

$("#hear").click (function() {
  $(this).text( (fluency.hear) ? "Start" : "Stop" );
  $(this).toggleClass("btn-success");
  $(this).toggleClass("btn-danger");
  fluency.startHear();
});

$("#equalizer").change (function() {
  fluency.equalizer=$("#equalizer").prop("checked");
});

$("#settingsButtons").click (function() {
    $("#settings").toggle();
});

initInput("middlevolume", "setMiddleVolume");
initInput("lowVolume", "setLowVolume");
initInput("indent", "setIndent");
initInput("pause", "setPauseTime");
initInput("intro", "setIntro");
initInput("smoothing", "setSmoothing");


$("#settings").hide();

fluency["setMiddleVolume"]("50");
$("#middlevolume").val(fluency.middleVolume);
fluency.startScreen();

if (!micro.hasGetUserMedia()) {
  alert('getUserMedia() is not supported in your browser');
}
