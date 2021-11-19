const refreshRate = 50;
var pressed = 0;
var count = 0;
var motor_speed = 220, diff_speed=200, pt_speed=0;
var straight_string = '';


window.addEventListener("gamepadconnected", (event) => {
  console.log("A gamepad connected:");
  //console.log(event.gamepad);
  repGP = window.setInterval(getGamepadState, refreshRate);
});

window.addEventListener("gamepaddisconnected", (event) => {
  console.log("A gamepad disconnected:");
  //console.log(event.gamepad);
  window.clearInterval(repGP);
});


function getGamepadState() {
 
  // Returns up to 4 gamepads.
  const gamepads = navigator.getGamepads();

  // We take the first one, for simplicity
  const gamepad = gamepads[0];

  // Escape if no gamepad was found
  if (!gamepad) {
    console.log('No gamepad found.');
    return;
  }

  var speedAxis = gamepad.axes[6];
  var yAxis = gamepad.axes[1];
  var pointTurnAxis = gamepad.axes[5];
  var pan_tilt = gamepad.axes[9];

  /*start camera
  if (buttonPressed(gamepad.buttons[2])) {
    
    
    connect();

  }*/

  //stop camera
  if (buttonPressed(gamepad.buttons[5])) {

    socket.emit('statbar',0);
    disconnect();
    gmarker.style.display = 'none';
  }

  //teleconference mode
  else if (buttonPressed(gamepad.buttons[2])) {
    count++;
    if(count < 2) {
    socket.emit('video_channel', 1);
    socket.emit('statbar',1);
    gmarker.style.display = 'none';
    }

  }
  //navigation mode
  else if (buttonPressed(gamepad.buttons[3])) {
    count++;
    if(count < 2) {
    socket.emit('video_channel', 2);
    socket.emit('statbar',2);
    gmarker.style.display = 'block';
   
    }

  }


  else if (buttonPressed(gamepad.buttons[0])) {
    cnow = 0;

    motor_speed = Math.round((speedAxis * 95) + 125);
    

    if (buttonPressed(gamepad.buttons[1])) {
      socket.emit('navi', '9:' + pt_speed);
      console.log('reset - 9');
    }

    

    //forward
    if (yAxis < -0.1 && pointTurnAxis < 0.5 && pointTurnAxis > -0.5) {
      socket.emit('navi', '1:' + motor_speed);
      console.log('forward - 1');
    }

    //reverse
    else if (yAxis > 0.1 && pointTurnAxis < 0.8 && pointTurnAxis > -0.8) {
      socket.emit('navi', '2:' + motor_speed);
      console.log('reverse - 1');
    }

    //rotate right
    else if (pointTurnAxis > 0.8) {
      socket.emit('navi', '3:' + diff_speed);
      console.log('right - 3');
    }

    //rotate left
    else if (pointTurnAxis < -0.8) {
      socket.emit('navi', '4:' + diff_speed);
      console.log('left - 4');
    }

    //pan left
    else if (pan_tilt > 0.5 && pan_tilt < 1) {
      socket.emit('navi', '5:' + pt_speed);
      console.log('pan left - 5');
    }

    //pan right
    else if (pan_tilt < 0 && pan_tilt > -0.5) {
      socket.emit('navi', '6:' + pt_speed);
      console.log('pan right - 6');
    }

    //tilt up
    else if (pan_tilt < -0.5) {
      socket.emit('navi', '7:' + pt_speed);
      console.log('tilt up - 7');
    }

    //tilt down
    else if (pan_tilt > 0 && pan_tilt < 0.5) {
      socket.emit('navi', '8:' + pt_speed);
      console.log('tilt down - 8');
    }

    else {
      socket.emit('navi', '0:' + pt_speed);
      console.log('stop - 0');
    }
    console.log('DMS pressed');

  }

  else {

    socket.emit('navi', 0);
    count = 0;

  }


}



function buttonPressed(b) {

  if (typeof (b) == "object") {
    return b.pressed;
  }
  return b == 1.0;
}