function preload(){
  customFont = loadFont("static/assets/fonts/Lexend-Regular.ttf")

  vocal = loadSound("static/assets/output_wav/vocal_output.wav");
  bass = loadSound("static/assets/output_wav/bass_output.wav");
  drum = loadSound("static/assets/output_wav/drum_output.wav");
  other = loadSound("static/assets/output_wav/other_output.wav");
  chords = loadJSON("static/assets/output_json/chord_output.json")
  links = loadJSON("static/assets/output_json/links.json")

  vocalMidi = loadStrings("static/assets/output_txt/vocal_output.txt")
  bassMidi = loadStrings("static/assets/output_txt/bass_output.txt")
  drumMidi = loadStrings("static/assets/output_txt/drum_output.txt")
  otherMidi = loadStrings("static/assets/output_txt/other_output.txt")

  vocalImage = loadImage("static/assets/images/microphone.png")
  bassImage = loadImage("static/assets/images/guitar.png")
  drumImage = loadImage("static/assets/images/drum-set.png")
  otherImage = loadImage("static/assets/images/other.png")
  chordImage = loadImage("static/assets/images/chord.png")
  playImage = loadImage("static/assets/images/play.png")
  pauseImage = loadImage('static/assets/images/pause.png')

  vocalfft = new p5.FFT();
  bassfft = new p5.FFT();
  drumfft = new p5.FFT();
  otherfft = new p5.FFT();

  vocalfft.setInput(vocal)
  bassfft.setInput(bass)
  drumfft.setInput(drum)
  otherfft.setInput(other)
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  vocalSlider = createSlider(0, 100, 100);
  bassSlider = createSlider(0, 100, 100);
  drumSlider = createSlider(0, 100, 100);
  otherSlider = createSlider(0, 100, 100);
  chordSlider = createSlider(10, 100, 50);

  vocalSlider.style('transform', 'rotate(270deg)'); 
  vocalSlider.style('width', str(displayWidth*0.045)+'px');
  vocalSlider.position(displayWidth*0.09,displayHeight*0.05)

  bassSlider.style('transform', 'rotate(270deg)'); 
  bassSlider.style('width', str(displayWidth*0.045)+'px');
  bassSlider.position(displayWidth*0.09,displayHeight*0.20)

  drumSlider.style('transform', 'rotate(270deg)'); 
  drumSlider.style('width', str(displayWidth*0.045)+'px');
  drumSlider.position(displayWidth*0.09,displayHeight*0.35)

  otherSlider.style('transform', 'rotate(270deg)'); 
  otherSlider.style('width', str(displayWidth*0.045)+'px');
  otherSlider.position(displayWidth*0.09,displayHeight*0.50)

  chordSlider.style('transform', 'rotate(270deg)'); 
  chordSlider.style('width', str(displayWidth*0.045)+'px');
  chordSlider.position(displayWidth*0.09,displayHeight*0.650)
  accum = 0;
  start = null;
}

function draw(){
  imageMode(CENTER)
  elapsedTime = accum + (start != null ? millis() - start : 0);
  textSize(32)
  textFont(customFont)
  background(255);
  fill(93,210,179,500)
    strokeWeight(4)

    rawr = 0
    beginShape();
    for (i = 0; i < vocalMidi.length; i++){
      noFill()
      vertex(displayWidth*0.125 + (rawr*1000 - (elapsedTime))*0.25,map(int(vocalMidi[i].split(" ")[0]),30,80,displayHeight*0.00, displayHeight*0.13))
      rawr += float(vocalMidi[i].split(" ")[1])
    }
    endShape();

    rawr = 0
    beginShape();
    for (i = 0; i < bassMidi.length; i++){
      noFill()
      vertex(displayWidth*0.125 + (rawr*1000 - (elapsedTime))*0.25,map(int(bassMidi[i].split(" ")[0]),30,80,displayHeight*0.15, displayHeight*0.28))
      rawr += float(bassMidi[i].split(" ")[1])
    }
    endShape();

    rawr = 0
    beginShape();
    for (i = 0; i < drumMidi.length; i++){
      noFill()
      vertex(displayWidth*0.125 + (rawr*1000 - (elapsedTime))*0.25,map(int(drumMidi[i].split(" ")[0]),30,80,displayHeight*0.30, displayHeight*0.43))
      rawr += float(drumMidi[i].split(" ")[1])
    }
    endShape();

    rawr = 0
    beginShape();
    for (i = 0; i < otherMidi.length; i++){
      noFill()
      vertex(displayWidth*0.125 + (rawr*1000 - (elapsedTime))*0.25,map(int(otherMidi[i].split(" ")[0]),30,80,displayHeight*0.45, displayHeight*0.58))
      rawr += float(otherMidi[i].split(" ")[1])
    }
    endShape();
  
  drawSpectrum(vocalfft,displayHeight*0.85)
  drawSpectrum(bassfft,displayHeight*0.70)
  drawSpectrum(drumfft,displayHeight*0.55)
  drawSpectrum(otherfft,displayHeight*0.40)
  
  if (elapsedTime>=vocal.duration()*1000){
    start = null
    accum = 0
    vocal.stop()
    drum.stop()
    other.stop()
    bass.stop()

  }
  ar = chordSlider.value()*0.01
  for (var key in chords){
    noStroke()
    fill(93,210,179,500)
    ellipse(displayWidth*0.125 + (chords[key]["start"]*1000 - (elapsedTime))*ar,displayHeight*0.665,displayHeight*0.1)
    textAlign(CENTER)
    fill(0)
    text(chords[key]["chord_complex_pop"],displayWidth*0.125 + (chords[key]["start"]*1000 - (elapsedTime))*ar,displayHeight*0.73)
  }

  noStroke()
  fill(225*1.5, 85*1.5, 84*1.5)
  rect(0,0,displayWidth*0.125,displayHeight*0.15)
  image(vocalImage,displayWidth*0.0625,(displayHeight*0.07),displayWidth*0.05,displayWidth*0.05)
  fill(225*1.5, 188*1.5, 41*1.5)
  rect(0,displayHeight*0.15,displayWidth*0.125,displayHeight*0.15)
  image(bassImage,displayWidth*0.0625,(displayHeight*0.22),displayWidth*0.05,displayWidth*0.05)
  fill(59*1.5, 178*1.5, 115*1.5)
  rect(0,displayHeight*0.30,displayWidth*0.125,displayHeight*0.15)
  image(drumImage,displayWidth*0.0625,(displayHeight*0.37),displayWidth*0.05,displayWidth*0.05)
  fill(77*1.5, 157*1.5, 224*1.5)
  rect(0,displayHeight*0.45,displayWidth*0.125,displayHeight*0.15)
  image(otherImage,displayWidth*0.0625,(displayHeight*0.52),displayWidth*0.05,displayWidth*0.05)
  fill(119*1.5, 104*1.5, 174*1.5)
  rect(0,displayHeight*0.6,displayWidth*0.125,displayHeight*0.15)
  image(chordImage,displayWidth*0.0625,(displayHeight*0.665),displayWidth*0.05,displayWidth*0.05)

  fill(0)
  textAlign(LEFT)
  text("Vocal", displayWidth*0.02,displayHeight*0.13)
  text("Bass", displayWidth*0.02,displayHeight*0.28)
  text("Drum", displayWidth*0.02,displayHeight*0.43)
  text("Other", displayWidth*0.02,displayHeight*0.58)
  text("Chord", displayWidth*0.02,displayHeight*0.73)
  textAlign(LEFT,CENTER)
  textSize(25)
  text(fancyTimeFormat(round(elapsedTime/1000)) + "-" + fancyTimeFormat(round(vocal.duration())), displayWidth*0.02,displayHeight*0.8-5)
  if (start == null){
    image(playImage,displayWidth*0.11,displayHeight*0.8,40,40)
  }
  else {
    image(pauseImage,displayWidth*0.11,displayHeight*0.8,40,40)
  }

  textAlign(RIGHT)
  text(vocalSlider.value(), displayWidth*0.12,displayHeight*0.13)
  text(bassSlider.value(), displayWidth*0.12,displayHeight*0.28)
  text(drumSlider.value(), displayWidth*0.12,displayHeight*0.43)
  text(otherSlider.value(), displayWidth*0.12,displayHeight*0.58)
  text(chordSlider.value(), displayWidth*0.12,displayHeight*0.73)

  completion = (elapsedTime)/(other.duration()*1000)
  strokeWeight(30)
  stroke(93,255,179,50)
  line(displayWidth*0.135,displayHeight*0.8,displayWidth*0.935,displayHeight*0.8)
  stroke(93,210,179)
  line(displayWidth*0.135,displayHeight*0.8,displayWidth*0.135+displayWidth*0.8*completion,displayHeight*0.8)
  vocal.setVolume(vocalSlider.value()*0.01)
  bass.setVolume(bassSlider.value()*0.01)
  drum.setVolume(drumSlider.value()*0.01)
  other.setVolume(otherSlider.value()*0.01)
}

var drawSpectrum = function(fft, yOffset) {
  let spectrum = fft.analyze();
  stroke(77, 157, 224,100);
  strokeWeight(4)
  beginShape();
  vertex(displayWidth*0.125,displayHeight-yOffset)
  for (i = 0; i < spectrum.length; i++) {
    vertex(displayWidth*0.125+i*displayWidth/spectrum.length, map(spectrum[i], 0, 255, height,height*0.85)-yOffset);
  }
  endShape();
}

var fancyTimeFormat = function(duration) {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;

  return ret;
}

function mouseClicked() {
  if (mouseX >= displayWidth*0.11-20 && mouseX <= displayWidth*0.11+20 && mouseY >= displayHeight*0.8-20 && mouseY <= displayHeight*0.8+20){
    if (start == null){
      start = millis()
      meow = (elapsedTime/1000)
      other.play();
      bass.play();
      drum.play();
      vocal.play();
      other.jump(meow);
      bass.jump(meow+1/30);
      drum.jump(meow+2/30);
      vocal.jump(meow+3/30);
    }
    else{
      accum += millis() - start
      start = null
      other.pause();
      bass.pause();
      drum.pause();
      vocal.pause();
    }
  }
}

function mouseDragged(){
  scrub()
}

function scrub(){
  if(mouseX>=displayWidth*0.135 && mouseX<=displayWidth*0.935 && mouseY<=displayHeight*0.81 && mouseY>=displayHeight*0.79){
    mousePos = mouseX
    songPercent = (mousePos - displayWidth*0.135)/(displayWidth*0.935-displayWidth*0.135)
    accum = vocal.duration()*songPercent*1000
    meow = (elapsedTime/1000)  
    }
}


function mouseReleased(){
  if(mouseX>=displayWidth*0.135 && mouseX<=displayWidth*0.935){
    start = millis()
    meow = (elapsedTime/1000)
    other.play();
    bass.play();
    drum.play();
    vocal.play();
    other.jump(meow);
    bass.jump(meow+1/30);
    drum.jump(meow+2/30);
    vocal.jump(meow+3/30);  
  }
}