  class Microphone {
    constructor() {
      var self = this;
      this.hear = false;
      this.time = 0;
      this.adjustLengths = [];
      this.adjustedVolume = 0.01;
      this.lowVolume=0;
      

      this.constraints = {
        audio: true,
        video: false
      };
      navigator.mediaDevices.getUserMedia(this.constraints).then(function(stream) {
        self.init(stream);
      });
    }

    hasGetUserMedia() {
      // Note: Opera builds are unprefixed.
      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

    init(stream) {
      this.audioContent = new AudioContext();
      this.audioStream = this.audioContent.createMediaStreamSource(stream);
      this.analyser = this.audioContent.createAnalyser();
      this.audioStream.connect(this.analyser);
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant =0.1; 
      console.log(this.analyser);
    }
    
    frequencyArray(){
      var frequencyArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(frequencyArray);
      return frequencyArray;
    }
    
    
    totalVolumeRaw(down, up){
      var frequencyArray=this.frequencyArray();
      
      var start=(down>0)?down:0;
      var stop=(up>0 && up<frequencyArray.length)? up: frequencyArray.length;
     
      var total = 0;

      for (var i = start; i < stop; i++) {
        total += Math.floor(frequencyArray[i]);
      }
      return total;
    }
    
    
    totalVolume(down, up){
      var frequencyArray=this.frequencyArray();
      
      var start=(down>0)?down:0;
      var stop=(up>0 && up<frequencyArray.length)? up: frequencyArray.length;
     
      var total = 0;

      for (var i = start; i < stop; i++) {
        total += Math.floor(frequencyArray[i]);;
      }
      return total/255;//*this.adjustedVolume-this.lowVolume*this.adjustedVolume;
    }

    
  }