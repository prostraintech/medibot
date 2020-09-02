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
    var sendstop = 0;
    var slow = 0;
    var fast = 0;
    
    
		//if (xAxis>-0.5 && xAxis<0.5 && yAxis<-0.1 && yAxis>-0.5)  //straight slow
		//{
			//console.log("straight slow");
      //socket.emit('navi', 1);
     // sendstop = 0;
    //}

    if (yAxis<-0.1 && yAxis>-0.5 && pointTurnAxis<0.5 && pointTurnAxis>-0.5 && !buttonPressed(gamepad.buttons[0]))  //straight slow
		{
      //console.log("straight slow");
      if (slow<1) {
      socket.emit('navi', 1);
      }
      slow++;
      fast = 0;
     // sendstop = 0;
    }
    
		//else if (xAxis>-0.5 && xAxis<0.5 && yAxis<-0.5)       //straight fast
		//{
      //console.log("straight fast");
      //socket.emit('navi', 2);
      //sendstop = 0;
    //}
    
    else if (yAxis<-0.5 && pointTurnAxis<0.5 && pointTurnAxis>-0.5 && !buttonPressed(gamepad.buttons[0]))       //straight fast
		{
      //console.log("straight fast");
      if (fast<1) {
      socket.emit('navi', 2);
      }
      fast++;
      slow = 0;
      //sendstop = 0;
    }
    
    else if (pointTurnAxis>0.5 && !buttonPressed(gamepad.buttons[0]))       //rotate right
		{
      //console.log("rotate right");
      socket.emit('navi', 3);
      fast = 0;
      slow = 0;
      //sendstop = 0;
    }
    
    else if (pointTurnAxis<-0.5 && !buttonPressed(gamepad.buttons[0]))       //rotate left
		{
      //console.log("rotate left");
      socket.emit('navi', 4);
      fast = 0;
      slow = 0;
      //sendstop = 0;
		}
		
		//else if (xAxis>0.5 && yAxis<-0.25)                //turn right
		//{
      //socket.emit('navi', gamepad.axes[1]);
      //socket.emit('navi', 3);
      //sendstop = 0;
    //}
    
    //else if (xAxis<-0.5 && yAxis<-0.25)                //turn left
		//{
      //socket.emit('navi', gamepad.axes[1]);
      //socket.emit('navi', 4);
      //sendstop = 0;
    //}
    
		//else if (xAxis>0.5 && yAxis>-0.25)            //rotate right
		//{
      //socket.emit('navi', 5);
      //sendstop = 0;
    //}

    //else if (xAxis<-0.5 && yAxis>-0.25)            //rotate left
		//{
      //socket.emit('navi', 6);
      //sendstop = 0;
    //}

    else {
      sendstop++;
      if (sendstop==1)
      {
        socket.emit('navi', 0);
      }
    }
    
    if (buttonPressed(gamepad.buttons[0])) {
      if (pressed<1)
      {
      socket.emit('navi', 9)
      }
      pressed++;
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