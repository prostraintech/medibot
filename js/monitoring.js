var debugc = 0;

socket.on('vbat', (vbat) => {

  
    var monitoring = vbat.split(" ");

    var volt = parseInt(monitoring[0]);
    // console.log(volt);
    //socket.emit('data',data);
    //console.log("battery -> " + vbat +"V");
    document.getElementById("top_battery").innerHTML = monitoring[0] + "V";
    //console.log("im here in connect");
    if (volt == 24)
    {
    document.getElementById("top_battery").className = "fas fa-battery-empty";
    }



  });