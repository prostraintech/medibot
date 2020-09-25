var debugc = 0;

socket.on('vbat', (vbat) => {

  
    var monitoring = vbat.split(" ");

    var volt = parseInt(monitoring[0]);
    // console.log(volt);
    //socket.emit('data',data);
    //console.log("battery -> " + vbat +"V");
    document.getElementById("top_battery").innerHTML = " " + monitoring[0] + "V";
    if (volt == 24) {
      document.getElementById("top_battery").className = "fas fa-battery-full";
    }
    
    //console.log("im here in connect");
    
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

    if (temp > 30)  {
      document.getElementById("battery_temp").className = "fas fa-thermometer-three-quarters";
    }

  });