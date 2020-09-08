const refreshRate = 50;
var pressed = 0;
var cmd = 8;

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

//var gamepads = navigator.getGamepads();
//console.log(gamepads);

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
    var val_joystick = 0;
    var count = 0;
      
    if (buttonPressed(gamepad.buttons[1])) {

        if (yAxis<-0.1 && yAxis>-0.5 && pointTurnAxis<0.5 && pointTurnAxis>-0.5)  //straight slow
		  {
        val_joystick=1;
      }

      else if (yAxis>0.1 && pointTurnAxis<0.5 && pointTurnAxis>-0.5)  //reverse slow
		  {
        val_joystick=7;
      }
    
      else if (yAxis<-0.5 && pointTurnAxis<0.5 && pointTurnAxis>-0.5)       //straight fast
		  {
        val_joystick=2;
      }
    
      else if (pointTurnAxis>0.5)       //rotate right
		  {
        val_joystick=3;
      }
    
      else if (pointTurnAxis<-0.5)       //rotate left
		  {
        val_joystick=4;
		  }

      else {
        val_joystick = 8;
      }
    
  
      if (cmd != val_joystick)
      {
        cmd = val_joystick;
        socket.emit('navi',cmd);
        count = 0;
      }

      else
        count++;

      if (count >=50 ){
        socket.emit('navi',cmd);
        count = 0;
      }

    }

    else if (buttonPressed(gamepad.buttons[0])) 
    {
      socket.emit('navi', 9);
    }

    else if (buttonPressed(gamepad.buttons[2]))
    {
      socket.emit ('connect', 1)
    }

    else if (buttonPressed(gamepad.buttons[3]))
    {
      socket.emit ('connect', 0)
    }
    
    else
    {
      socket.emit('navi', 8);
    }

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