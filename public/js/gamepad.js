const refreshRate = 50;
var pressed = 0;
var cnow = 0;
var clast = 1;



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

  if (buttonPressed(gamepad.buttons[2])) {
    socket.emit('connect', 1);
    connect();
  }

  if (buttonPressed(gamepad.buttons[3])) {
    socket.emit('connect', 0);
    disconnect();
  }

  
  if (buttonPressed(gamepad.buttons[1])) {
    cnow = 0;
    console.log('DMS pressed');
    if (yAxis < -0.1 && yAxis > -0.6 && pointTurnAxis < 0.5 && pointTurnAxis > -0.5)  //straight slow
    {
      socket.emit('navi', 1);
      console.log('forward - 1');
    }

    else if (yAxis > 0.1 && pointTurnAxis < 0.8 && pointTurnAxis > -0.8)  //reverse slow
    {
      socket.emit('navi', 2);
      console.log('reverse - 1');
    }

    else if (pointTurnAxis > 0.8)       //rotate right
    {
      socket.emit('navi', 3);
      console.log('right - 3');
    }

    else if (pointTurnAxis < -0.8)       //rotate left
    {
      socket.emit('navi', 4);
      console.log('left - 4');
    }

    else {
      socket.emit('navi', 5);
      console.log('stop - 5');
    }
  }


  else {
    //console.log("i'm here: " + cnow);
    if (cnow != clast)
    {
      
      cnow = clast;
      
    socket.emit('navi', 5);
    
    }
  }

}



function buttonPressed(b) {

  if (typeof (b) == "object") {
    return b.pressed;
  }
  return b == 1.0;
}