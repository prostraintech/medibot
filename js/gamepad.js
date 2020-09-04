const refreshRate = 50;
const sameDataRate = 500;
var pressed = 0;
var cmd = 0;

window.addEventListener("gamepadconnected", (event) => {
  console.log("A gamepad connected:");
  console.log(event.gamepad);
  repGP = window.setInterval(getGamepadState, refreshRate);
});

window.addEventListener("gamepaddisconnected", (event) => {
  console.log("A gamepad disconnected:");
  console.log(event.gamepad);
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
		
  var xAxis= gamepad.axes[0];
  var yAxis= gamepad.axes[1];
  var pointTurnAxis= gamepad.axes[5];
  var sendstop = 0;
  var slow = 0;
  var fast = 0;
  var value = 0;

  if (yAxis<-0.1 && yAxis>-0.5 && pointTurnAxis<0.5 && pointTurnAxis>-0.5 && !buttonPressed(gamepad.buttons[0]))  //straight slow
  {
    value = 1;
  }
    
  else if (yAxis<-0.5 && pointTurnAxis<0.5 && pointTurnAxis>-0.5 && !buttonPressed(gamepad.buttons[0]))       //straight fast
  {
    value = 2;
  }
    
  else if (pointTurnAxis>0.5 && !buttonPressed(gamepad.buttons[0]))       //rotate right
  {
    value = 3;
  }
    
  else if (pointTurnAxis<-0.5 && !buttonPressed(gamepad.buttons[0]))       //rotate left
  {
    value = 4;
  }
    
  else if (yAxis>0.1 && pointTurnAxis<0.5 && pointTurnAxis>-0.5)  //reverse slow
  {
    value = 7;
  }

  else {
    value = 8;
  }
    
  if (cmd != value) {
    cmd = value;
    socket.emit('navi', cmd);
  }

  else if (cmd == value) {
    sample = window.setInterval(DataSame, sameDataRate);
  }
    
  if (buttonPressed(gamepad.buttons[0])) {
    socket.emit('navi', 9);
  }

  else
  {
    pressed = 0;
  }

  }

function DataSame() {
  socket.emit('navi', cmd);
}

function buttonPressed(b) {
  if (typeof(b) == "object") {
    return b.pressed;
  }
  return b == 1.0;
}
    
socket.on('navi', function(msg){
console.log(msg);
});