// Developed by Darius Alasu
// 
// UIC ART 150 Assignment 1
//
// This project explores different aspects of P5.js.
// This is a game which the player draws lines to guide the correct ball
// into the "endzone". The purpose of this project is to explore different
// functions and different inputs in order to create a visual and
// interactive game.

// GLOBAL VARIABLES - CUSTOM CHANGES
let staRadius = 10;
let screenW = 500;
let screenH = 500;

class Ball {
  // constructor:
  // Creates instance of ball object, storing ball information provided in parameters
  constructor(r, xp, yp, id) {
    this._radius = r;
    this._xPos = xp;
    this._yPos = yp;
    this._xSpeed = 0;
    this._ySpeed = 0;
    this._id = id;
    
    switch(id) {
      case 1: // Green ball
        this._color = 'green';
        break;
      case 2: // Red ball
        this._color = 'red';
        break;
    } // End of switch case
    
    while(abs(this._xSpeed) < 1) {
      this._xSpeed = random(-5, 5);
    }
    while(abs(this._ySpeed) < 1) {
      this._ySpeed = random(-5, 5);
    }
  } // End of constructor
  
  // draw:
  // Method to draw and display ball object
  draw() {
    stroke(0);
    strokeWeight(0.5);
    ellipseMode(RADIUS);
    fill(this._color);
    ellipse(this._xPos, this._yPos, this._radius);
  } // End of draw
  
  // move:
  // Method to move ball object
  // End of class Ball
  move() {
    let velocity = createVector(this._xSpeed, this._ySpeed); // Velocity vector
    
    // Check if ball is hitting house and determine game outcome
    if(createVector(this._xPos-house.getXPos(), this._yPos-house.getYPos()).mag() < 
       (1.5 * staRadius) + velocity.mag()) {
      switch(this._id) {
        case 1: // Green Ball (player wins)
          console.log("Player wins!\nPress 'enter' to continue");
          level++;
          break;
        case 2: // Red Ball (player loses)
          console.log("Player loses :(\nPress 'enter' to continue");
          level = 1;
          break;
      }
      endOfLevel = true;
      noLoop();
      return;
    }
    
    // Check if ball is hitting walls and invert direction
    if(this._xPos > width - staRadius || this._xPos < staRadius) {
      this._xSpeed *= -1;
    }
    if(this._yPos > height - staRadius || this._yPos < staRadius) {
      this._ySpeed *= -1;
    }
    
    // Loop through each line
    for(let i = 0; i < lines.length; i++) {
      // Vectors of ends of line
      let vLine1 = createVector(lines[i].getX1(), lines[i].getY1());
      let vLine2 = createVector(lines[i].getX2(), lines[i].getY2());
      
      let a = (vLine2.y - vLine1.y); // Change in y
      let b = (vLine2.x - vLine1.x); // Change in x
      if(a/b > 0) {
        b = abs(b);
      } else {
        b = -1*abs(b);
      }
      a = abs(a);
      let c = (vLine2.y * b) - (vLine2.x * a);
      
      // Find Distance d between ball and line
      let d = abs((a*this._xPos) - (b*this._yPos) + c)/(sqrt(sq(a) + sq(b)));

      // Find min and max of line ends
      let minX = min(vLine1.x, vLine2.x);
      let minY = min(vLine1.y, vLine2.y);
      let maxX = max(vLine1.x, vLine2.x);
      let maxY = max(vLine1.y, vLine2.y);
      
      // Ensure edge of ball is hitting line and not projection of line
      if(minX-staRadius <= this._xPos && this._xPos <= maxX+staRadius &&
         minY-staRadius <= this._yPos && this._yPos <= maxY+staRadius) {
        if(d < staRadius + velocity.mag()) {
          // Adjust so ball doesn't get suck in wall
          this._xPos -= 2*this._xSpeed;
          this._yPos -= 2*this._ySpeed;
          
          let ballPos = createVector(this._xPos, this._yPos); // Ball position vector
          
          // Vector for initial direction ball is travelling
          let initialDir = createVector(ballPos.x-velocity.x*10, ballPos.y-velocity.y*10);
          
          // Vector orthogonal to line
          let lineNormal = (vLine2.copy().sub(vLine1)).normalize(); // Normal vector of line
          let lambda = (ballPos.copy().sub(vLine1)).dot(lineNormal); // Scalar of orthogonal
          let linePos = lineNormal.copy().mult(lambda).add(vLine1); // Vector of line position
          
          // Calculate line normal
          let lineDelta = (vLine2.copy().sub(vLine1)).normalize();
          let normal = createVector(-lineDelta.y, lineDelta.x);
          
          // Calculate reflection of initial velocity
          //let initVel = createVector(velocity.x, velocity.y);
          let vNorm = createVector(linePos.x-normal.x*100, linePos.y-normal.y*100);
          let finalVel = velocity.copy();
          finalVel.reflect(normal.copy());

          //console.log("normal: " + normal.x + ", " + normal.y);
          //console.log("vNorm: " + vNorm.x + ", " + vNorm.y);
          //console.log("ballPos: " + ballPos.x + ", " + ballPos.y);
          //console.log("speed: " + this.xSpeed + ", " + this.ySpeed);
          //console.log("finalVel: " + finalVel.x + ", " + finalVel.y);

          // Vector for final direction ball is travelling
          let finalDir = createVector(ballPos.x+finalVel.x*10, ballPos.y+finalVel.y*10);
          
          // *** TESTING ***
          //stroke('blue');
          //line(vLine1.x-50, vLine1.y+50, vLine2.x-50, vLine2.y+50);
          //line(vLine1.x+50, vLine1.y-50, vLine2.x+50, vLine2.y-50);
          //stroke('red');
          //line(linePos.x, linePos.y, linePos.x-normal.x*100, linePos.y-normal.y*100);
          //stroke('yellow');
          //line(initialDir.x, initialDir.y, ballPos.x, ballPos.y);
          //stroke('pink');
          //line(ballPos.x, ballPos.y, finalDir.x, finalDir.y);
          
          this._xSpeed = finalVel.x;
          this._ySpeed = finalVel.y;
          //this._xSpeed = 0;
          //this._ySpeed = 0;
          //noLoop();
        }
      }
    }
    
    this._xPos += this._xSpeed;
    this._yPos += this._ySpeed;
    
    if(this._xPos < 0 || this._xPos > screenW) {
      this._xPos = screenW/2;
    }
    if(this._yPos < 0 || this._yPos > screenH) {
      this._yPos = screenH/2;
    }
  } // End of move
} // End of class Ball

class Line {
  // constructor:
  // Creates instance of line, storing coordinates of lines provided
  constructor(x1, y1, x2, y2) {
    this._x1 = x1;
    this._y1 = y1;
    this._x2 = x2;
    this._y2 = y2;
  } // End of constructor
  
  // draw;
  // Draws the line
  draw() {
    stroke(255);
    strokeWeight(3);
    line(this._x1, this._y1, this._x2, this._y2);
  } // End of display
  
  // Getter for x1
  getX1() { return this._x1; } // End of getter for x1
  
  // Getter for y1
  getY1() { return this._y1; } // End of getter for y1
  
  // Getter for x2
  getX2() { return this._x2; } // End of getter for x2
  
  // Getter for y2
  getY2() { return this._y2; } // End of getter for y2
} // End of class Line

class House {
  // constructor:
  // Creates instance of house
  constructor() {
    let rand = random(15, 485);
    switch(int(random(1, 5))) {
      case 1: // Top or bottom
        this._xPos = rand;
        this._yPos = 15;
        break;
      case 2: // Bottom
        this._xPos = rand;
        this._yPos = 485;
        break;
      case 3: // Left
        this._xPos = 15;
        this._yPos = rand;
        break;
      case 4: // Right
        this._xPos = 485;
        this._yPos = rand;
        break;
    }
  } // End of constructor
  
  // draw:
  // Draws the house
  draw() {
    stroke(0);
    strokeWeight(2);
    fill('blue');
    square(this._xPos-staRadius, this._yPos-staRadius, staRadius*2);
    triangle(this._xPos-staRadius-2, this._yPos-staRadius,
             this._xPos+staRadius+2, this._yPos-staRadius,
             this._xPos, this._yPos-(staRadius*1.5));
  } // End of draw
  
  // Getter for xPos
  getXPos() { return this._xPos; } // End of getter for xPos
  
  // Getter for yPos
  getYPos() { return this._yPos; } // End of getter for yPos
} // End of class House

let level; // Game level
let endOfLevel;
let rule;
let opac;

let lines = []; // Array to hold lines
let balls = []; // Array to hold balls
let house; // Variable to hold house (target zone)

let pressing = true;
let tmpMX, tmpMY; // Temporary mouse coordinates

// setup:
// Called at startup.
// Create the canvas, set initial level, and create the ball
function setup() {
  createCanvas(screenW, screenH);
  
  level = 0; // Set starting level to 0, the entry level
  endOfLevel = true;
  opac = 255;
  
  house = new House();
  
  balls = [];
  lines = [];
  
  rules(rule = 1);
} // End of setup

// rules:
// Function to print out rules and explain game using console
// This feature is only available on the p5.js web editor.
function rules(val) {
  background(50); // Create dark grey background
  
  switch(val) {
    case 1:
      balls.push(new Ball(staRadius, screenW/2, screenH/2, 1));
      console.log("Welcome! Here are the rules!"
                  +"\nPress 'h' any time to display rules again."
                  +"\nPress 'space' to skip intro or 'r' to reset the game at any point."
                  +"\nPress 'enter' to continue with rules.");
      noLoop();
      break;
    case 2:
      loop();
      console.log("Do you see the green ball? You have to get that green ball to the blue house."
             +"\nYou can do this by drawing lines for the ball to bounce off of."
             +"\nGo ahead and try drawing a line! Don't block the house though!");
      break;
    case 3:
      balls.push(new Ball(staRadius, 300, 325, 2));
      console.log("Nice! Now, do you see the red ball? Make sure that it does not touch your house."
                 +"\nYou can block the red ball by drawing lines."
                 +"\nBut be careful! You can only draw five lines at once."
                 +"\nThe oldest lines drawn will be deleted first.");
      console.log("Are you ready? Press 'enter' to start the game!");
      noLoop();
      break;
  }
} // End of rules

// drawObjects:
// Function to draw all objects created
function drawObjects() {
  house.draw(); // Draw house
  
  // Draw lines
  for(let i = 0; i < lines.length; i++) {
    lines[i].draw();
  }
  
  // Draw balls
  for(let i = 0; i < balls.length; i++) {
    balls[i].draw();
  }
} // End of drawObjects

// draw:
// Function that loops and plays game.
// Scene will be updated depending on level.
// Ball movement is controlled here.
function draw() {
  background(50); // Set background to dark grey
  
  // Show level number and slowly fade away
  if(level > 0) {
    textAlign(CENTER);
    textSize(90);
    let c = (color(0, 0, 0))
    c.setAlpha(opac -= 0.8);
    fill(c);
    stroke(c);
    text("Level " + level, screenW/2, screenH/2);
  }
  
  // Check if mouse is pressed to draw line
  if(mouseIsPressed === true) {
    // Get coordinates of original mouse position
    if(pressing) {
      tmpMX = pmouseX;
      tmpMY = pmouseY;
      pressing = !pressing;
    }
    // Allows user to see line before letting go of mouse
    (new Line(tmpMX, tmpMY, mouseX, mouseY)).draw();
  } else {
    // Get coordinates of last mouse position and create a line
    if(!pressing) {
      lines.push(new Line(tmpMX, tmpMY, mouseX, mouseY))
      if(lines.length > 5) {
        lines.splice(0, 1);
      }
      pressing = !pressing;
      
      // Intro stage
      if(level == 0 && rule == 2) {
        rules(++rule);
      }
    }
  }
  
  drawObjects();
  
  if(level > 0) {
    for(let i = 0; i < balls.length; i++) {
      balls[i].move();
    }
  }
} // End of draw

// levelGenerator:
// Generates the canvas and object for each level
function levelGenerator() {
  console.log("Starting level " + level + "...");
  
  opac = 255;
  
  house = new House(); // Generate new house
  
  balls = []; // Reset balls array
  lines = []; // Reset lines array
  pressing = true;
  
  balls.push(new Ball(staRadius, screenW/2, screenH/2, 1)); // Generate new good ball
  
  // Generate new bad balls
  for(let i = 0; i < int(level/3); i++) {
    balls.push(new Ball(staRadius, screenW/2, screenH/2, 2));
  }
  
  loop();
} // End of levelGenerator

// keyPressed:
// Event listener and handler is a key is pressed
function keyPressed() {
  switch(key) {
    case 'r': // Reset Game
      console.log("\n\n\n");
      loop();
      setup();
      break;
    case ' ': // Skip intro
      if(level == 0) {
        levelGenerator(++level);
        endOfLevel = false;
      }
      break;
    case 'h': // Help
      console.log("'h': list of commands\n"
                  +"'r': reset game\n"
                  +"'space': skip intro\n"
                  +"'enter': continue to next stage");
      break;
    default: // for keyCodes
      switch(keyCode) {
        case ENTER:
          if(level == 0) {
            if(rule == 1) {
              rules(++rule);
            } else if(rule == 3) {
              levelGenerator(++level);
              endOfLevel = false;
            }
          } else {
            if(endOfLevel) {
              levelGenerator(level);
              endOfLevel = false;
            }
          }
          break;
      }
  }
} // End of keyPressed