socket.on('vbat', (vbat) => {

  
    var monitoring = vbat.split(" ");

    var volt = parseInt(monitoring[0]);
    document.getElementById("top_battery").innerHTML = " " + volt.toString() + "V";

    // console.log(volt);
    //socket.emit('data',data);
    //console.log("battery -> " + vbat +"V");

    if (volt == 24) {
      document.getElementById("top_battery").className = "fas fa-battery-full";
    }
    
    else if (volt == 23)  {
      document.getElementById("top_battery").className = "fas fa-battery-three-quarters";
    }

    else if (volt == 22)
    {
    document.getElementById("top_battery").className = "fas fa-battery-half";
    }

    else if (volt == 21)
    {
    document.getElementById("top_battery").className = "fas fa-battery-quarter";
    }
    
    else if (volt == 20)
    {
    document.getElementById("top_battery").className = "fas fa-battery-empty";
    }

    var temp = parseInt(monitoring[1]);
    document.getElementById("battery_temp").innerHTML = " " + monitoring[1] + "\u00B0" + "C";

    if (temp < 30)  {
      document.getElementById("battery_temp").className = "fas fa-thermometer-half";
    }

    else if (temp >= 30)  {
      document.getElementById("battery_temp").className = "fas fa-thermometer-three-quarters";
    }

    var STOP = parseInt(monitoring[2]);
    document.getElementById("emergency_stop").innerHTML = " Emergency STOP button is pressed!";

    if (STOP == 0){
      document.getElementById("emergency_stop").className = "fas fa-exclamation-circle";
    }

    else if (STOP == 1){
      document.getElementById("emergency_stop").className = "b";
    }

    var obstacle = parseInt(monitoring[3]);
    document.getElementById("allowable").innerHTML = "Reset move!";

    if (obstacle == 2){
      document.getElementById("emergency_stop").className = "fas fa-exclamation-circle"
    }

    else if (obstacle == 1){
      document.getElementById("emergency_stop").className = "b";
    }


  });