const refreshRate = 50;
var pressed = 0;


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
    
    
		if (xAxis > 0.1)
		{
			//console.log("going right");
			socket.emit('navi', gamepad.axes[0]);
		}
		else if (xAxis < -0.1)
		{
      //console.log("going left");
      socket.emit('navi', gamepad.axes[0]);
		}
		
		if (yAxis > 0.1)
		{
			socket.emit('navi', gamepad.axes[1]);
		}
		else if (yAxis < -0.1)
		{
			socket.emit('navi', gamepad.axes[1]);
    }
    
    if (buttonPressed(gamepad.buttons[0])) {
      pressed++;
      if (pressed == 1)
      {
      socket.emit('button', "check temperature" )
      }
    }

    else
    {
      pressed = 0;
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