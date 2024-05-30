/*
 * FaceMap class - holds all informaiton about one mapped
 * face and is able to draw itself.
 */  

// remove this or set to false to enable full program (load will be slower)
var DEBUG_MODE = false;

// this can be used to set the number of sliders to show
var NUM_SLIDERS = 5;

// other variables can be in here too
// here's some examples for colors used


const stroke_color = [95, 52, 8];

// example of a global function
// given a segment, this returns the average point [x, y]
function segment_average(segment) {
  let sum_x = 0;
  let sum_y = 0;
  let s_len = segment.length;
  for (let i=0; i<s_len; i++) {
    sum_x = sum_x + segment[i][0];
    sum_y = sum_y + segment[i][1];
  }
  return [sum_x / s_len , sum_y / s_len ];
}

// This where you define your own face object
function Face() {

  // Mouth slider properties
  this.mouthLowerSliderMin = 0.18;
  this.mouthLowerSliderMax = 1.8;
  this.mouthLowerSliderValue = (this.mouthLowerSliderMin + this.mouthLowerSliderMax) / 2; 

  // Lip slider properties
  this.lipSizeSliderMin = 0.5;
  this.lipSizeSliderMax = 1;
  this.lipSizeSliderValue = (this.lipSizeSliderMin + this.lipSizeSliderMax) / 2; 

  // Eye size slider properties
  this.eyeSizeSliderMin = 0.7;
  this.eyeSizeSliderMax = 1.3;
  this.eyeSizeSliderValue = (this.eyeSizeSliderMin + this.eyeSizeSliderMax) / 2;

  // Eye separation colour slider properties
  this.eyeSeparationSliderMin = -1.5;
  this.eyeSeparationSliderMax = 1.5;
  this.eyeSeparationSliderValue = (this.eyeSeparationSliderMin + this.eyeSeparationSliderMax) / 2;

  // Face colour slider properties
  this.faceColorSliderMin = 0.7;
  this.faceColorSliderMax = 1.3;
  this.faceColorSliderValue = (this.faceColorSliderMin + this.faceColorSliderMax) / 2;

  // Colours
  this.faceColor = [147, 218, 86];
  this.mouthColor = [155, 39, 65];
  this.tongueColor = [230, 53, 79];
  this.eyeColor = [255, 255, 255];
  this.pupilColor = [0, 0, 0];

  this.chinColor = [153, 153, 51];
  this.lipColor = [136, 68, 68];
  this.eyebrowColor = [119, 85, 17];

  this.facingDir = function(chin, noseTip, margin=0, _debug=false) {
    let facing = "neutral";
    let faceHorizontalCenter = segment_average(chin)[0];

    if (noseTip[2][0] < faceHorizontalCenter && noseTip[2][0] < -margin) { facing = "left"; } 
    else if (noseTip[2][0] > faceHorizontalCenter && noseTip[2][0] > margin) { facing = "right"; }
    
    if (_debug) {
      push();
      ellipseMode(CENTER);
      noStroke();

      fill([0, 255, 255]);
      circle(noseTip[2][0], noseTip[2][1], 0.15);

      fill([255, 255, 255]);
      circle(segment_average(chin)[0], segment_average(chin)[1], 0.3);

      textSize(0.3);
      text(facing, 0, -1);

      pop();
    }

    return [facing, noseTip[2][0]];
  }

  this.drawContour = function(positions, alpha) {
    push();
    textSize(0.15);
    for (let posString of Object.keys(positions)) {
      fill([255, 0, 255, alpha]);
      stroke([255, 0, 255, alpha]);
      this.draw_segment(positions[posString]);

      stroke([200, 200, 200, alpha]);
      fill([30, 30, 30, alpha]);
      text(posString, positions[posString][0][0], positions[posString][0][1])
    }
    pop();
  }

  this.scaleColor = function(col, factor) {
    if (typeof col === "number") return col * factor;
    let newCol = [];
    for (let v of col) newCol.push(v * factor);
    return newCol;
  }

  this.drawOutline = function(col, chin, noseBridge, mouthSize, facing, outlineScale=1) {
    push();
    scale(1);
    strokeJoin(ROUND);
    strokeWeight(0.2);
    stroke(col);
    fill(col);

    if (facing === "neutral" || facing === undefined) {
      stroke(this.scaleColor(col, 0.8));
      beginShape();
      vertex(outlineScale * chin[2][0],        outlineScale * chin[2][1]             );
      vertex(outlineScale * chin[8][0],        outlineScale * mouthSize              );
      vertex(outlineScale * chin[14][0],       outlineScale * chin[14][1]            );
      vertex(outlineScale * noseBridge[0][0],  outlineScale * noseBridge[0][1] * 2.5 );
      endShape(CLOSE);
    }
    else {
      // Left side
      if (facing === "left") { 
        fill(this.scaleColor(col, 0.8)); 
        stroke(this.scaleColor(col, 0.8));
      }
      beginShape();
      vertex(outlineScale * noseBridge[0][0],  outlineScale * noseBridge[0][1] * 2.5 );
      vertex(outlineScale * chin[2][0],        outlineScale * chin[2][1]             );
      vertex(outlineScale * chin[8][0],        outlineScale * mouthSize              );
      vertex(outlineScale * noseBridge[1][0], outlineScale * noseBridge[1][1] * mouthSize);
      endShape(CLOSE);

      fill(col);
      stroke(col);
      if (facing === "right") { 
        fill(this.scaleColor(col, 0.8)); 
        stroke(this.scaleColor(col, 0.8));
      }
      // Right side
      beginShape();
      vertex(outlineScale * noseBridge[0][0],  outlineScale * noseBridge[0][1] * 2.5 );
      vertex(outlineScale * chin[14][0],       outlineScale * chin[14][1]            );
      vertex(outlineScale * chin[8][0],        outlineScale * mouthSize              );
      vertex(outlineScale * noseBridge[1][0], outlineScale * noseBridge[1][1] * mouthSize);
      endShape(CLOSE);
    }
    pop();
  }

  this.drawMouth = function(col, chin, noseBridge, mouthSize, mouthScale=1) {
    push();
    strokeJoin(ROUND);
    strokeWeight(0.2 * mouthSize);
    stroke(col);
    fill(col);

    beginShape();
    vertex(mouthScale * chin[2][0] * this.lipSizeSliderValue,  mouthScale * chin[2][1]);
    vertex(mouthScale * noseBridge[1][0], mouthScale * noseBridge[1][1] * mouthSize);
    vertex(mouthScale * chin[14][0] * this.lipSizeSliderValue, mouthScale * chin[14][1]);
    vertex(mouthScale * chin[8][0],  mouthScale * mouthSize);
    endShape(CLOSE);

    fill([0, 0, 0])
    noStroke();

    pop();
  }

  this.drawEye = function(x, y, eyeCol, pupilCol, eye, eyeScale, side) {

    // Eye
    const EYE_OFFSET_FACTOR = 1.07;
    
    push();
    ellipseMode(CENTER);
    stroke(this.scaleColor(this.eyeColor, 0.78));
    fill(eyeCol);


    ellipse(
      x * EYE_OFFSET_FACTOR  * this.eyeSeparationSliderValue, 
      y * EYE_OFFSET_FACTOR, 
      1.5 * Math.abs(eye[0][0] - eye[3][0]) * eyeScale, 
      1.5 * Math.abs(eye[0][0] - eye[3][0]) * eyeScale
    );

    // Pupil
    const VERTICAL_PUPIL_SHIFT = 0.15 * Math.abs(eye[0][0] - eye[3][0]);
    const HORIZONTAL_PUPIL_SHIFT = 1.1;
    const PUPIL_LINE_MIN_FACTOR = 0.9;
    const PUPIL_LINE_MAX_FACTOR = 1.4;

    fill(pupilCol);
    noStroke();

    ellipse(
      x * HORIZONTAL_PUPIL_SHIFT * EYE_OFFSET_FACTOR * this.eyeSeparationSliderValue, 
      y * EYE_OFFSET_FACTOR - VERTICAL_PUPIL_SHIFT, 
      0.5 * Math.abs(eye[0][0] - eye[3][0]) * eyeScale, 
      0.5 * Math.abs(eye[0][0] - eye[3][0]) * eyeScale
    );

    pop();

    // The weird line thing in Kermit's eye
    push();
    strokeWeight(eyeScale / 10);
    noFill();
    stroke(pupilCol);
    let eyeLine = 0.32 * Math.abs(eye[0][0] - eye[3][0]);
    beginShape();

    vertex(
      x * HORIZONTAL_PUPIL_SHIFT * EYE_OFFSET_FACTOR * this.eyeSeparationSliderValue + eyeLine, 
      y * EYE_OFFSET_FACTOR - VERTICAL_PUPIL_SHIFT 
      + ((side === "left") ? -eyeLine * PUPIL_LINE_MIN_FACTOR : eyeLine * PUPIL_LINE_MAX_FACTOR)
    );

    vertex(
      x * HORIZONTAL_PUPIL_SHIFT * EYE_OFFSET_FACTOR * this.eyeSeparationSliderValue + eyeLine/2, 
      y * EYE_OFFSET_FACTOR - VERTICAL_PUPIL_SHIFT  
      + ((side === "left") ? -eyeLine/2 : eyeLine/2)
    );

    vertex(
      x * HORIZONTAL_PUPIL_SHIFT * EYE_OFFSET_FACTOR * this.eyeSeparationSliderValue, 
      y * EYE_OFFSET_FACTOR - VERTICAL_PUPIL_SHIFT
    );

    vertex(
      x * HORIZONTAL_PUPIL_SHIFT * EYE_OFFSET_FACTOR * this.eyeSeparationSliderValue - eyeLine/2, 
      y * EYE_OFFSET_FACTOR - VERTICAL_PUPIL_SHIFT  
      + ((side === "left") ? eyeLine/2 : -eyeLine/2)
    );

    vertex(
      x * HORIZONTAL_PUPIL_SHIFT * EYE_OFFSET_FACTOR * this.eyeSeparationSliderValue - eyeLine, 
      y * EYE_OFFSET_FACTOR - VERTICAL_PUPIL_SHIFT 
      + ((side === "left") ? eyeLine * PUPIL_LINE_MAX_FACTOR : -eyeLine * PUPIL_LINE_MIN_FACTOR)
    );

    endShape();
    pop();
  }
  
  /*
   * Draw the face with position lists that include:
   *    chin, right_eye, left_eye, right_eyebrow, left_eyebrow
   *    bottom_lip, top_lip, nose_tip, nose_bridge, 
   */  
  this.draw = function(positions) {
    
    /* Positions */
    const CHIN = positions.chin;

    const RIGHT_EYE = positions.right_eye;
    const LEFT_EYE = positions.left_eye;

    const RIGHT_EYEBROW = positions.right_eyebrow;
    const LEFT_EYEBROW = positions.left_eyebrow;

    const BOTTOM_LIP = positions.bottom_lip;
    const TOP_LIP = positions.top_lip;

    const NOSE_TIP = positions.nose_tip;
    const NOSE_BRIDGE = positions.nose_bridge;

    push();

    const SCALE_FACTOR = 1.6;
    const VERTICAL_TRANSLATION_FACTOR = 0.45;
    scale(SCALE_FACTOR);
    translate(0, VERTICAL_TRANSLATION_FACTOR);


    /* Back eyes */
    let facing = this.facingDir(CHIN, NOSE_TIP,  0.07);
    
    if (facing[0] === "neutral" || facing[0] === "left") {
      this.drawEye(LEFT_EYE[0][0], LEFT_EYE[0][1], this.eyeColor, this.pupilColor, LEFT_EYE, this.eyeSizeSliderValue, "left");

    }
    if (facing[0] === "neutral" || facing[0] === "right") {
      this.drawEye(RIGHT_EYE[3][0], RIGHT_EYE[3][1], this.eyeColor, this.pupilColor, RIGHT_EYE,this.eyeSizeSliderValue, "right");
    }

    let fc = this.scaleColor(this.faceColor, this.faceColorSliderValue);

    /* Outline */
    const OUTLINE_SCALE = 1.07;
    this.drawOutline(this.scaleColor(fc, 1/3), CHIN, NOSE_BRIDGE, this.mouthLowerSliderValue, undefined, OUTLINE_SCALE);
    this.drawOutline(fc, CHIN, NOSE_BRIDGE, this.mouthLowerSliderValue, facing[0]);

    /* Mouth */
    const MOUTH_SCALE = 0.7;
    this.drawMouth(this.mouthColor, CHIN, NOSE_BRIDGE, this.mouthLowerSliderValue, MOUTH_SCALE);
    this.drawMouth(this.tongueColor, CHIN, NOSE_BRIDGE, this.mouthLowerSliderValue, MOUTH_SCALE/2);

    /* Front eyes */
    if (facing[0] === "right") {
      this.drawEye(LEFT_EYE[0][0], LEFT_EYE[0][1], this.eyeColor, this.pupilColor, LEFT_EYE, this.eyeSizeSliderValue, "left");
    }

    if (facing[0] === "left") {
      this.drawEye(RIGHT_EYE[3][0], RIGHT_EYE[3][1], this.eyeColor, this.pupilColor, RIGHT_EYE, this.eyeSizeSliderValue, "right");
    }

    pop();

    // this.facingDir(CHIN, NOSE_TIP,  0.07, true);
    // this.drawContour(positions, 80);

  }

  // example of a function *inside* the face object.
  // this draws a segment, and do_loop will connect the ends if true
  this.draw_segment = function(segment, do_loop) {
    for(let i=0; i<segment.length; i++) {
      let px = segment[i][0];
      let py = segment[i][1];
      ellipse(px, py, 0.1);
      if(i < segment.length - 1) {
        let nx = segment[i+1][0];
        let ny = segment[i+1][1];
        line(px, py, nx, ny);
      }
      else if(do_loop) {
        let nx = segment[0][0];
        let ny = segment[0][1];
        line(px, py, nx, ny);
      }
    }
  };

  /* set internal properties based on list numbers 0-100 */
  this.setProperties = function(settings) {
    this.faceColorSliderValue = map(settings[0], 0, 100, this.faceColorSliderMin, this.faceColorSliderMax);
    this.eyeSizeSliderValue = map(settings[1], 0, 100, this.eyeSizeSliderMin, this.eyeSizeSliderMax);
    this.eyeSeparationSliderValue = map(settings[2], 0, 100, this.eyeSizeSliderMin, this.eyeSizeSliderMax);
    this.mouthLowerSliderValue = map(settings[3], 0, 100, this.mouthLowerSliderMin, this.mouthLowerSliderMax);
    this.lipSizeSliderValue = map(settings[4], 0, 100, this.lipSizeSliderMin, this.lipSizeSliderMax);
  }

  /* get internal properties as list of numbers 0-100 */
  this.getProperties = function() {
    let settings = new Array(3);
    settings[0] = map(this.faceColorSliderValue, this.faceColorSliderMin, this.faceColorSliderMax, 0, 100);
    settings[1] = map(this.eyeSizeSliderValue, this.eyeSizeSliderMin, this.eyeSizeSliderMax, 0, 100);
    settings[2] = map(this.eyeSeparationSliderValue, this.eyeSeparationSliderMin, this.eyeSeparationSliderMax, 0, 100);
    settings[3] = map(this.mouthLowerSliderValue, this.mouthLowerSliderMin, this.mouthLowerSliderMax, 0, 100);
    settings[4] =  map(this.lipSizeSliderValue, this.lipSizeSliderMin, this.lipSizeSliderMax, 0, 100);
    return settings;
  }
}
