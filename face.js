/*
 * FaceMap class - holds all informaiton about one mapped
 * face and is able to draw itself.
 */  

// remove this or set to false to enable full program (load will be slower)
var DEBUG_MODE = true;

// this can be used to set the number of sliders to show
var NUM_SLIDERS = 3;

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
  // these are state variables for a face
  // (your variables should be different!)

  

  this.detailColour = [204, 136, 17]; // colour of features
  this.mainColour = [51, 119, 153]; // colour of main face
  this.num_eyes = 2;    // can be either 1 (cyclops) or 2 (two eyes)
  this.eye_shift = -1;   // range is -10 to 10
  this.mouth_size = 1;  // range is 0.5 to 8

  // these are the lines
  this.chinColour = [153, 153, 51];
  this.lipColour = [136, 68, 68];
  this.eyebrowColour = [119, 85, 17];


  this.borderPoints = [];

  this.CARD_COLOR = [238, 207, 170];
  this.INNER_BORDER_SCALE = 0.98;


  this.scaleColor = function(col, factor) {
    if (typeof col === "number") return col * factor;
    let newCol = [];
    for (let v of col) newCol.push(v * factor);
    return newCol;
  }

  this.generateBorder = function(chin, heightScale) {
    this.borderPoints = [
      [chin[0][0],  chin[0][1] * heightScale], // Top Left
      [chin[0][0],  chin[8][1]              ], // Bot Left
      [chin[16][0], chin[8][1]              ], // Bot right
      [chin[16][0], chin[16][1] * heightScale] // Top right
    ];
  }

  this.getBorderCenter = function() {
    return segment_average(this.borderPoints);
  }

  this.getBorderDimensions = function() {
    return [
      Math.abs(this.borderPoints[0][0] - this.borderPoints[3][0]),
      Math.abs(this.borderPoints[0][1] - this.borderPoints[1][1])
    ];
  }


  this.drawBorder = function(fillCol, strokeCol, scaleFactor=1, strokeWeightFactor=0.2) {
    push();
    noFill();
    noStroke();

    if (fillCol !== undefined) { fill(fillCol) }
    if (strokeCol !== undefined) { stroke(strokeCol) }

    strokeJoin(ROUND);
    strokeWeight(strokeWeightFactor);
    beginShape();
    for (let bp of this.borderPoints) {
      vertex(scaleFactor * bp[0], scaleFactor * bp[1])
    }
    endShape(CLOSE);
    pop();
  }


  /*
   * Draw the face with position lists that include:
   *    chin, right_eye, left_eye, right_eyebrow, left_eyebrow
   *    bottom_lip, top_lip, nose_tip, nose_bridge, 
   */  
  this.draw = function(positions) {
    const CHIN = positions.chin;

    const RIGHT_EYE = positions.right_eye;
    const LEFT_EYE = positions.right_eye;

    const RIGHT_EYEBROW = positions.right_eyebrow;
    const LEFT_EYEBROW = positions.left_eyebrow;

    const BOTTOM_LIP = positions.bottom_lip;
    const TOP_LIP = positions.top_lip;

    const NOSE_TIP = positions.nose_tip;
    const NOSE_BRIDGE = positions.nose_bridge;


    push();
    
    noStroke();
    fill(255);
    ellipseMode(CENTER);
    ellipse(LEFT_EYEBROW[1][0], LEFT_EYEBROW[1][1], 1.5*Math.abs(LEFT_EYE[0][0] - LEFT_EYE[3][0]), 1.5*Math.abs(LEFT_EYE[0][0] - LEFT_EYE[3][0]));
    ellipse(RIGHT_EYEBROW[3][0], RIGHT_EYEBROW[3][1], 1.5*Math.abs(RIGHT_EYE[0][0] - RIGHT_EYE[3][0]), 1.5*Math.abs(RIGHT_EYE[0][0] - RIGHT_EYE[3][0]));
    pop();



    push();
    const OUTLINE_SCALE = 1.07;
    strokeJoin(ROUND);
    strokeWeight(0.2);
    stroke(this.scaleColor([147, 218, 86], 0.5));
    fill(this.scaleColor([147, 218, 86], 0.5));
    
    beginShape();
    vertex(OUTLINE_SCALE * CHIN[1][0],        OUTLINE_SCALE * CHIN[1][1]                  );
    vertex(OUTLINE_SCALE * CHIN[8][0],        OUTLINE_SCALE * CHIN[8][1] * this.mouth_size);
    vertex(OUTLINE_SCALE * CHIN[15][0],       OUTLINE_SCALE * CHIN[15][1]                 );
    vertex(OUTLINE_SCALE * NOSE_BRIDGE[0][0], OUTLINE_SCALE * NOSE_BRIDGE[0][1]        * 3);
    endShape(CLOSE);

    pop();




    push();
    strokeJoin(ROUND);
    strokeWeight(0.2);
    stroke([147, 218, 86]);
    fill([147, 218, 86]);
    
    beginShape();
    vertex(CHIN[1][0], CHIN[1][1]);
    vertex(CHIN[8][0], CHIN[8][1] * this.mouth_size);
    vertex(CHIN[15][0], CHIN[15][1]);
    vertex(NOSE_BRIDGE[0][0], 3*NOSE_BRIDGE[0][1]);
    endShape(CLOSE);
    pop();

    push();
    const MOUTH_SCALE = 0.7;
    strokeJoin(ROUND);
    strokeWeight(0.2);
    stroke([155, 39, 65]);
    fill([155, 39, 65]);

    beginShape();
    vertex(MOUTH_SCALE * CHIN[1][0],  MOUTH_SCALE * CHIN[1][1]);
    vertex(MOUTH_SCALE * NOSE_BRIDGE[0][0], MOUTH_SCALE * NOSE_BRIDGE[0][1]);
    vertex(MOUTH_SCALE * CHIN[15][0], MOUTH_SCALE * CHIN[15][1]);
    vertex(MOUTH_SCALE * CHIN[8][0],  MOUTH_SCALE * CHIN[8][1] * this.mouth_size);
    endShape(CLOSE);
    pop();

    // const CARD_HEIGHT_SCALE = 3;
    // this.generateBorder(CHIN, CARD_HEIGHT_SCALE);

    // // Draw border of card
    // this.drawBorder(this.CARD_COLOR, this.CARD_COLOR);

    // push();
    
    // ellipseMode(CENTER);
    // noStroke();
    // fill(this.scaleColor(this.CARD_COLOR, 0.9));
    // ellipse(
    //   this.getBorderCenter()[0], 
    //   this.getBorderCenter()[1], 
    //   this.getBorderDimensions()[0] * this.INNER_BORDER_SCALE * 4/5, 
    //   this.getBorderDimensions()[1] * this.INNER_BORDER_SCALE * 4/5
    // );
    // pop();

    // // this.drawBorder(this.scaleColor(this.CARD_COLOR, 0.9), this.scaleColor(this.CARD_COLOR, 0.9), 0.9);

    // this.drawBorder(undefined, 0, this.INNER_BORDER_SCALE, 0.04);

    push();

    // Draw the chin segment using points
    fill([255, 0, 255]);
    stroke([255, 0, 255]);
    this.draw_segment(positions.chin);

    pop();


    // push();
    // fill(0);
    // strokeWeight(0.05);
    // strokeJoin(ROUND);
    // stroke(255);

    // beginShape();

    // // Low points
    // vertex(positions.chin[6][0], positions.chin[6][1]);   // Bot left
    // vertex(positions.chin[10][0], positions.chin[10][1]); // Bot right

    // // Right Top
    // vertex(positions.chin[15][0], positions.chin[15][1]);

    // // Middle Top
    // vertex(
    //   (positions.right_eyebrow[0][0] + positions.left_eyebrow[4][0]) / 2,
    //   (positions.right_eyebrow[0][1] + positions.left_eyebrow[4][1]) / 2
    // );

    // // Left Top
    // vertex(positions.chin[1][0], positions.chin[1][1]);

    // endShape(CLOSE);
    // pop();

    // push();
    // const SCALE_COEF = 0.85;
    // noStroke();
    // fill(255);
    // strokeJoin(ROUND);

    // beginShape();

    // // Low points
    // vertex(positions.chin[6][0] * SCALE_COEF, positions.chin[6][1] * SCALE_COEF);   // Bot left
    // vertex(positions.chin[10][0] * SCALE_COEF, positions.chin[10][1] * SCALE_COEF); // Bot right

    // // Right Top
    // vertex(positions.chin[15][0] * SCALE_COEF, positions.chin[15][1] * SCALE_COEF);

    // // Middle Top
    // vertex(
    //   SCALE_COEF * (positions.right_eyebrow[0][0] + positions.left_eyebrow[4][0]) / 2,
    //   SCALE_COEF * (positions.right_eyebrow[0][1] + positions.left_eyebrow[4][1]) / 2
    // );

    // // Left Top
    // vertex(positions.chin[1][0] * SCALE_COEF, positions.chin[1][1] * SCALE_COEF);

    // endShape(CLOSE);


    

    
    // let leftEyeHorizontalSize = 0.7;
    // let leftEyeVerticalSize = 0.7;
    // fill(255);
    // strokeWeight(0.15);
    // stroke(0);
    // ellipseMode(CENTER);
    // ellipse(
    //   (positions.left_eye[0][0] + positions.nose_bridge[3][0])/2, 
    //   (positions.left_eye[0][1] + positions.nose_bridge[3][1])/2,
    //   leftEyeHorizontalSize, leftEyeVerticalSize
    // );
    // ellipse(
    //   (positions.right_eye[3][0] + positions.nose_bridge[3][0])/2, 
    //   (positions.right_eye[3][1] + positions.nose_bridge[3][1])/2, 
    //   leftEyeHorizontalSize, leftEyeVerticalSize
    // );

    // pop();

    // pop();
    // ellipseMode(CENTER);
    // ellipse(segment_average(positions.nose_bridge)[0], segment_average(positions.nose_bridge)[1], 0.2, 0.2);



    // head
    // ellipseMode(CENTER);
    // stroke(stroke_color);
    // fill(this.mainColour);
    // ellipse(segment_average(positions.chin)[0], 0, 3, 4);
    // noStroke();

    /**
     * LET MOUTH BE AN EXAMPLE
     * - what this code does is that it first takes in some face
     * - then it generates points on the face based on the features of that face
     * - the ellipse draw is taking the average position of the mouth points and then using them
     *   as an (x, y) position for drawing an ellipse
     * - this.mouth_size is a slider value used for making the mouth bigger
     * 
     *  notice that the ellipse code is using indices ([0], [1]) - this is how it gets (x, y) from the average points
     */

    // fill(this.detailColour);
    // ellipse(segment_average(positions.bottom_lip)[0], segment_average(positions.bottom_lip)[1], 1.36, 0.25 * this.mouth_size);

    

    // eyebrows
    // fill( this.eyebrowColour);
    // stroke( this.eyebrowColour);
    // strokeWeight(0.08);
    // this.draw_segment(positions.left_eyebrow);
    // this.draw_segment(positions.right_eyebrow);



    // fill(100, 0, 100);
    // stroke(100, 0, 100);
    // this.draw_segment(positions.nose_bridge);
    // this.draw_segment(positions.nose_tip);

    // strokeWeight(0.03);

    // fill(this.lipColour);
    // stroke(this.lipColour);
    // this.draw_segment(positions.top_lip);
    // this.draw_segment(positions.bottom_lip);

    // let left_eye_pos = segment_average(positions.left_eye);
    // let right_eye_pos = segment_average(positions.right_eye);

    // // eyes
    // noStroke();
    // let curEyeShift = 0.04 * this.eye_shift;
    // if(this.num_eyes == 2) {
    //   fill(this.detailColour);
    //   ellipse(left_eye_pos[0], left_eye_pos[1], 0.5, 0.33);
    //   ellipse(right_eye_pos[0], right_eye_pos[1], 0.5, 0.33);
    // }
    // else {
    //   let eyePosX = (left_eye_pos[0] + right_eye_pos[0]) / 2;
    //   let eyePosY = (left_eye_pos[1] + right_eye_pos[1]) / 2;

    //   fill(this.detailColour);
    //   ellipse(eyePosX, eyePosY, 0.45, 0.27);

    //   fill(this.mainColour);
    //   ellipse(eyePosX - 0.1 + curEyeShift, eyePosY, 0.18);
    // }
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
    this.num_eyes = int(map(settings[0], 0, 100, 1, 2));
    this.eye_shift = map(settings[1], 0, 100, -2, 2);
    this.mouth_size = map(settings[2], 0, 100, 0.15, 1);
  }

  /* get internal properties as list of numbers 0-100 */
  this.getProperties = function() {
    let settings = new Array(3);
    settings[0] = map(this.num_eyes, 1, 2, 0, 100);
    settings[1] = map(this.eye_shift, -2, 2, 0, 100);
    settings[2] = map(this.mouth_size, 0.15, 1, 0, 100);
    return settings;
  }
}
