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
    var pointTurnAxis= gamepad.axes[5];
      
    if (buttonPressed(gamepad.buttons[1])) {

        //if (xAxis>-0.5 && xAxis<0.5 && yAxis<-0.1 && yAxis>-0.5)  //straight slow
		    //{
          //socket.emit('navi', 1);
        //}

        if (yAxis<-0.1 && yAxis>-0.6 && pointTurnAxis<0.5 && pointTurnAxis>-0.5)  //straight slow
		    {
          socket.emit('navi', 1);
        }

		    //else if (xAxis>-0.5 && xAxis<0.5 && yAxis<-0.5)       //straight fast
		    //{
          //socket.emit('navi', 2);
        //}
    
        else if (yAxis<-0.5 && pointTurnAxis<0.8 && pointTurnAxis>-0.8)       //straight fast
		    {
          socket.emit('navi', 2);
        }
    
        else if (pointTurnAxis>0.8 )       //rotate right
		    {
          socket.emit('navi', 3);
        }
    
        else if (pointTurnAxis<-0.8)       //rotate left
		    {
          socket.emit('navi', 4);
	    	}
		
		    //else if (xAxis>0.5 && yAxis<-0.25)                //turn right
		    //{
          //socket.emit('navi', 3);
        //}
    
        //else if (xAxis<-0.5 && yAxis<-0.25)                //turn left
		    //{
          //socket.emit('navi', 4);
        //}
    
		    //else if (xAxis>0.5 && yAxis>-0.25)            //rotate right
		    //{
          //socket.emit('navi', 5);
        //}

        //else if (xAxis<-0.5 && yAxis>-0.25)            //rotate left
		    //{
          //socket.emit('navi', 6);
       //}

       else if (yAxis>0.1 && pointTurnAxis<0.8 && pointTurnAxis>-0.8)  //reverse slow
       {
         socket.emit('navi', 7);
       }

        else 
        {
          socket.emit('navi', 8);
        }
    }

    else if (buttonPressed(gamepad.buttons[0])) 
    {
      socket.emit('navi', 9);
    }

    else if (buttonPressed(gamepad.buttons[2]))
    {
      socket.emit('connect', 1);
      connect();
    }

    else if (buttonPressed(gamepad.buttons[3]))
    {
      socket.emit('connect', 0);
      disconnect();
    }

    else if (buttonPressed(gamepad.buttons[6]))
    {
      socket.emit('shutdown', 0);
      
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
