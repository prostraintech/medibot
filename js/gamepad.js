const refreshRate = 100;



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
    var pressed = 0;
    
		if (xAxis > 0.1)
		{
			//console.log("going right");
			socket.emit('navi', gamepad.axes[0]);
		}
		else if (xAxis < -0.1)
		{
			//console.log("going left");
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
      if (pressed = 1)
      {
      socket.emit('button', "check temperature" )
      }
    }

    else
    {
      pressed = 0;
    }

		

			
		/*
		        // Filter out only the buttons which are pressed
        const pressedButtons = gamepad.buttons
            .map((button, id) => ({id, button}))
            .filter(isPressed);

        // Print the pressed buttons to our HTML
        for (const button of pressedButtons) {
            console.log(button);
            //log(`Button ${button.id} was pressed.`)
        }
		*/

    }

    function buttonPressed(b) {
      if (typeof(b) == "object") {
        return b.pressed;
      }
      return b == 1.0;
    }
	
	    function isPressed({button: {pressed}}) {
        return !!pressed;
    }
	
		socket.on('navi', function(msg){
			console.log(msg);
		});