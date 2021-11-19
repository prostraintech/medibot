var express = require('express');
var app = express();
var fs = require('fs');
//require('./public/js/index.js')();

var https = require('https').createServer({
  key: fs.readFileSync('webrtcwwsocket-key.pem'),
  cert: fs.readFileSync('webrtcwwsocket-cert.pem')
}, app);

var cmd = '0:0';
var count = 0;
var res;
var oneperson;
var locip;

var SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');

//get ip address
const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

locip = results["wlan0"][0];

var arduinoCOMPort = "/dev/ttyACM0";

var arduinoSerialPort = new SerialPort(arduinoCOMPort, {
  baudRate: 9600
});

//const parser = arduinoSerialPort.pipe(new Readline());

arduinoSerialPort.on('error', function () {
  console.log('Serial Port ' + arduinoCOMPort + ' is not available');
});

arduinoSerialPort.on('open', function () {
  console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
});

arduinoSerialPort.on('close', function () {
  console.log('Serial Port ' + arduinoCOMPort + ' is closed');  
});

app.use(express.static('public'));
//app.use(express.static('./public/js'));
//app.use('',express.static(__dirname + '/css'));
// app.use('/webfonts',express.static(__dirname + '/webfonts'));
// app.use('/vendor',express.static(__dirname + '/vendor'));
// app.use('/scss',express.static(__dirname + '/scss'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


https.listen(443, () => {
  console.log((new Date()) + " Node server started on port 443");
});

var io = require('socket.io')(https);

io.on('connection', (socket) => {
//oneperson = socket.id;

  console.log('a user connected');
  
  /*parser.on('data', (vbat) => {
    // console.log('got word from arduino:', vbat);
    socket.emit('vbat', vbat);
  });*/

    socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('webrtc', (webrtcdata) => {
    //console.log(webrtcdata);
    socket.broadcast.emit('webrtc', webrtcdata);
  });

  socket.on('statbar', (status) => {
    //console.log(webrtcdata);
    io.emit('statbar', status);
  });



  socket.on('video_channel', (status) => {
    io.in(oneperson).emit('video_channel', status);
  });

  socket.on('identifymedibot', (status) => {
    oneperson = status;
    console.log("medibot reported with id" + status);
    io.in(oneperson).emit('local_ip', locip);
  });

  socket.on('navi', (status) => {
    socket.emit('navi', status);

    if (cmd !== status) {
      cmd = status;
      res = '<' + cmd + '>';
      arduinoSerialPort.write(res);
      console.log(res);
    }

    else if (cmd === status) {

      count++;

      if (count > 10) {
        res = '<' + cmd + '>';
        arduinoSerialPort.write(res);
        console.log(res);
        count = 0;
      }
    }


  });

  socket.on('connect', (conn) => {
    console.log("Connection initiated");
  });


});

setInterval(() => io.emit('time', new Date().toTimeString().slice(0,5)), 1000);
