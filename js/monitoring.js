var debugc = 0;

socket.on('vbat', (vbat) => {

  console.log(vbat);
    // var  = vbat.split(" ");
    //socket.emit('data',data);
    //console.log("battery -> " + vbat +"V");
    document.getElementById("top_battery").innerHTML = table[0].toString() + "V";
    //console.log("im here in connect");
    if (debugc == 1)
    {
    document.getElementById("top_battery").className = "fas fa-battery-empty";
    }

  });