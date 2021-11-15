const refreshRate = 50;
var pressed = 0;
var count = 0;


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

  var xAxis = gamepad.axes[0];
  var yAxis = gamepad.axes[1];
  var pointTurnAxis = gamepad.axes[5];
  var pan_tilt = gamepad.axes[9];

  if (buttonPressed(gamepad.buttons[2])) {

    connect();
  }

  else if (buttonPressed(gamepad.buttons[3])) {

    disconnect();
    const constraints_initn = {
      "audio": true,
      "video": {
        "maxWidth": 1280,
        "maxHeight": 720,
        "aspectRatio": 16/9,
        "frameRate": {
          "min": "10"
        }
      }
    };

    startLocalMedia(constraints_initn);
  }

  else if (buttonPressed(gamepad.buttons[6])) {
    count++;
    if(count < 2) {
    socket.emit('video_channel', 1);
    gmarker.style.display = 'none';
    }

  }

  else if (buttonPressed(gamepad.buttons[7])) {
    count++;
    if(count < 2) {
    socket.emit('video_channel', 2);
    gmarker.style.display = 'block';
    }

  }


  else if (buttonPressed(gamepad.buttons[0])) {
    cnow = 0;

    if (buttonPressed(gamepad.buttons[1])) {
      socket.emit('navi', 9);
      console.log('reset - 9');
    }



    //forward
    if (yAxis < -0.1 && pointTurnAxis < 0.5 && pointTurnAxis > -0.5) {
      socket.emit('navi', 1);
      console.log('forward - 1');
    }

    //reverse
    else if (yAxis > 0.1 && pointTurnAxis < 0.8 && pointTurnAxis > -0.8) {
      socket.emit('navi', 2);
      console.log('reverse - 1');
    }

    //rotate right
    else if (pointTurnAxis > 0.8) {
      socket.emit('navi', 3);
      console.log('right - 3');
    }

    //rotate left
    else if (pointTurnAxis < -0.8) {
      socket.emit('navi', 4);
      console.log('left - 4');
    }

    //pan left
    else if (pan_tilt > 0.5 && pan_tilt < 1) {
      socket.emit('navi', 5);
      console.log('pan left - 5');
    }

    //pan right
    else if (pan_tilt < 0 && pan_tilt > -0.5) {
      socket.emit('navi', 6);
      console.log('pan right - 6');
    }

    //tilt up
    else if (pan_tilt < -0.5) {
      socket.emit('navi', 7);
      console.log('tilt up - 7');
    }

    //tilt down
    else if (pan_tilt > 0 && pan_tilt < 0.5) {
      socket.emit('navi', 8);
      console.log('tilt down - 8');
    }

    else {
      socket.emit('navi', 0);
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