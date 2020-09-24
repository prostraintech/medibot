
socket.on('vbat', (vbat) => {
    //socket.emit('data',data);
    console.log("battery -> " + vbat +"V");
    document.getElementById('statusbar').innerHTML = vbat +"V";
    //console.log("im here in connect");
  });