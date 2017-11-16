  class Fluency {
    constructor(vizualizer, microphone) {
      var self = this;
      this.hear = false;
      this.speachStopped = false;

      this.volumesSaved = [];

      this.time = 0;
      this.timestamp = 0;
      this.startTime = 0;

      this.pauseTime = 2500;

      this.volumeCurve = [];

      this.middleVolume = 100;
      this.lowVolume = 10;

      this.indent = 200;

      this.vizualizer = vizualizer;
      this.microphone = microphone;

      this.equalizer = false;

      this.player = document.getElementById("player");

      this.constraints = {
        audio: true,
        video: false
      };
      this.init();
    }


    init() {
      this.tickSound = new Audio();
      this.tickSound.src = "https://www.shiitman.ninja/wp-content/uploads/2017/11/tick.mp3";
      this.clockSound = new Audio();
      this.clockSound.src = "https://www.shiitman.ninja/wp-content/uploads/2017/11/clock.mp3";
    }

    setIndent(ind) {
      this.indent = parseInt(ind);
      this.vizualizer.indent = this.indent;
      return this.indent;
    }

    setMiddleVolume(mV) {
      this.middleVolume = parseInt(mV);
      this.vizualizer.middleVolume = this.middleVolume;
      return this.middleVolume;
    }

    setLowVolume(lV) {
      this.lowVolume = parseInt(lV);
      this.vizualizer.lowVolume = this.lowVolume;
      return this.lowVolume;
    }
    
    setIntro(intr) {
      this.indent = parseInt(intr);
      this.vizualizer.indent =  this.indent;
      return this.indent;
    }

    setPauseTime(pt) {
      this.pauseTime = parseInt(pt);
      return parseInt(pt);
    }

    setSmoothing(sm) {
      if (sm<0)
        sm=0;
      else 
      if (sm>1)
        sm=1;
      
      this.microphone.analyser.smoothingTimeConstant = parseFloat(sm);
      return parseFloat(sm);
    }

    startScreen(){
      this.vizualizer.fullRedraw(null, [], "Press START button and begin to speak");
    }

    startHear() {
      this.time = 0;
      this.speachStopped = false;
      this.timestamp = Date.now();
      this.startTime = this.timestamp;
      this.lineCrossed = false;

      this.hear = !this.hear;
      console.log(this.hear);
      this.volumeCurve = [];
      this.onHearing();
    }
    onHearing() {
      if (this.hear === false) {
        return;
      }
      var t = Date.now();
      var self = this;
      var timeDiff = t - this.timestamp;

      requestAnimationFrame(function() {
        self.onHearing();
      });

      //if (timeDiff % 20 >= 10) {

      var oberText = "";
      var volume = this.microphone.totalVolume(0, 255);
      t = Date.now();
      var frequency = null;
      if (!this.player.paused) {
        volume = 0;
      } else
      if (this.equalizer) {
        frequency = this.microphone.frequencyArray();
      }

      if (this.lineCrossed && this.speachStopped) {


        if ((t - this.startTime) < this.pauseTime) {

          if (this.player.src != this.clockSound.src) {
            this.player.src = this.clockSound.src;
            this.player.pause();
            this.player.currentTime = 0;
            this.player.play();
          }
          oberText += "STOP " + (this.pauseTime - (t - this.startTime));
        } else {
          this.player.pause();
          this.lineCrossed = false;
          oberText = "SPEAK!";
        }
      } else {
        if (volume - this.lowVolume > 0) {
          if (!this.lineCrossed && this.speachStopped) {
            this.speachStopped = false;
            this.startTime = t;
            this.lineCrossed = false;
            this.volumeCurve = [];
          }

          if (!this.speachStopped) {
            if (this.volumeCurve.length == 0) {
              this.startTime = t;
            }
            this.volumeCurve.push({
              vol: volume,
              time: (t - this.startTime)
            });
            oberText = (t - this.startTime) + "ms " + timeDiff;

            if (volume > this.middleVolume) {
              this.lineCrossed = true;
              console.log(this.middleVolume);
            }
          } else {
            oberText = "STOP " + (this.pauseTime - (t - this.startTime));

            if (this.player.src != this.clockSound.src) {
              this.player.src = this.clockSound.src;
              this.player.pause();
              this.player.currentTime = 0;
              this.player.play();
            }
          }
        } else {
          if (!this.speachStopped) {
            this.startTime = t;
            this.speachStopped = true;

            this.player.src = this.lineCrossed ? this.clockSound.src : this.tickSound.src;
            if (this.lineCrossed ) this.player.play();

          }
          oberText = "SPEAK!"
        }
      }
      if (timeDiff > 16) {
        this.vizualizer.fullRedraw(frequency, this.volumeCurve, oberText);
        this.timestamp = t;
      }

    }

    startAdjust(callback) {
      this.time = 0;

    }
    adjustVolume(timestamp, callback, silence) {
      this.adjust = false;
    }

  }
