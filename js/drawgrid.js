class Draw {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.startX = 10;

    this.middleVolume = 100;
    this.lowVolume = 10;

    this.indent = 200;

    this.width = 800;
    this.seconds = 10;

    this.coeff = this.width / (this.seconds+1);
    this.coeffMs = this.coeff / 1000;

    this.yShift = 10;
    this.yShiftUp = 150;

    this.context.beginPath();
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.context.moveTo(this.startX, this.startY);
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    
    this.resize();
  }

  clearAll() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

  }


  resize() {
    if (this.width != Math.round(window.innerWidth*0.8) ||  this.height != Math.round(window.innerHeight*0.5)){
      this.width = Math.round(window.innerWidth*0.8);
      this.height = Math.round(window.innerHeight*0.5);
      
      this.context.canvas.width = this.width;
      this.context.canvas.height = this.height;
      this.coeff = this.width /(this.seconds+1);
      this.coeffMs = this.coeff / 1000;
  
      this.startX = Math.round(this.width / 80);
      this.startY = Math.round(this.height*0.9);
    }
  }

  drawGrid() {
    var context = this.context;
    context.beginPath();
    context.moveTo(0, this.startY + this.yShift);
    context.lineWidth = 1;
    context.strokeStyle = '#0000DD';
    context.lineTo(this.width, this.startY + this.yShift);
    context.stroke();

    context.beginPath();
    context.moveTo(0, this.startY - this.yShiftUp);
    context.lineWidth = 1;
    context.strokeStyle = '#0000DD';
    context.lineTo(this.width, this.startY - this.yShiftUp);
    context.stroke();

    for (var i = 0; i < this.seconds * 10+1; i++) {
      context.beginPath();

      var len = 3;
      if (i % 10 === 0) {
        context.font = '12pt Calibri';
        context.fillStyle = 'blue';
        context.fillText(i / 10, i / 10 * this.coeff + this.startX - 5, this.startY + 30);
        len = 0;
      }

      context.moveTo(i * this.coeff / 10 + this.startX, this.startY + 5 + len);
      context.lineTo(i * this.coeff / 10 + this.startX, this.startY + 15 - len);
      context.stroke();
    }


    context.beginPath();
    context.fillStyle = "rgba(0,255,0, 0.5)"; //'#00FF00';
    context.rect(this.startX, this.startY - this.yShiftUp, this.indent * this.coeffMs, this.yShiftUp + this.yShift);
    context.fill();

    context.beginPath();
    context.moveTo(0, this.startY - this.middleVolume);
    context.lineWidth = 1;
    context.strokeStyle = '#FF0000';
    context.lineTo(this.width, this.startY - this.middleVolume);
    context.stroke();
    
    context.beginPath();
    context.moveTo(0, this.startY - this.lowVolume);
    context.lineWidth = 1;
    context.strokeStyle = '#00FF00';
    context.lineTo(this.width, this.startY - this.lowVolume);
    context.stroke();
  }

  writeText(text) {
    var context = this.context;
    context.beginPath();
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(text, Math.round((canvas.width - context.measureText(text).width)/2)+this.startX, Math.round(this.height/8)); //this.startY - Math.round(this.height/2)
  }
  
  drawUpdate(volumeCurve) {
    var context = this.context;
    var canvas = this.canvas;

    this.drawGrid();

    var x = this.startX;
    var y = this.startY;

    for (var i = 0; i < volumeCurve.length; i++) {
      context.beginPath();
      context.moveTo(x, y);
      x = this.startX + volumeCurve[i].time * this.coeffMs;
      context.strokeStyle = '#111111';
      context.fillStyle = '#111111';
      y = this.startY - volumeCurve[i].vol;
      if (volumeCurve[i].vol > this.middleVolume) {
        if (volumeCurve[i].time < this.indent){
           context.strokeStyle = '#ff1111';
           context.fillStyle = '#ff1111';
        }else {
           context.strokeStyle = '#11ee11';
           context.fillStyle = '#11ee11';
        }
        
      }
      context.lineTo(x, y);
      context.lineWidth = 1;
      context.stroke();

      context.beginPath();
      context.arc(x, y, 3, 0, 2 * Math.PI);
      context.fill();
    }
  }

  drawEqualizer(frequency) {
    var context = this.context;
    var canvas = this.canvas;

    var x = this.startX;
    var y = this.startY;

    var width = Math.floor(this.width * 0.8);
    var rectWidth = Math.floor(width / 256);
    for (var i = 0; i < 256; i++) {
      context.beginPath();
      var r = Math.floor(Math.sin(0.1 * i + 0) * 127 + 128);
      var g = Math.floor(Math.sin(0.1 * i + 2) * 127 + 128);
      var b = Math.floor(Math.sin(0.1 * i + 4) * 127 + 128);
      context.fillStyle = "rgba(" + r + "," + g + "," + b + ", 1)";
      context.rect(this.startX + i * rectWidth, this.startY - frequency[i], rectWidth, frequency[i]);
      context.fill();

    }
  }
  
  fullRedraw(frequencyArray, volumeCurve, text){
    this.resize();

    this.clearAll();
    if (frequencyArray){
      this.drawEqualizer(frequencyArray);
    }
    
    if (volumeCurve){
      this.drawUpdate(volumeCurve);
    }
        
    if (text){
      this.writeText(text);
    }
  }

}
