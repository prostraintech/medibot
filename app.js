var express = require('express');
var app = express();
var fs = require('fs');
var mset = require('./public/js/index.js');

var https = require('https').createServer({
  key: fs.readFileSync('webrtcwwsocket-key.pem'),
  cert: fs.readFileSync('webrtcwwsocket-cert.pem')
}, app);

var cmd = 0;
var count = 0;
var res;

var SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');

var arduinoCOMPort = "/dev/ttyACM0";

var arduinoSerialPort = new SerialPort(arduinoCOMPort, {
  baudRate: 9600
});

const parser = arduinoSerialPort.pipe(new Readline());

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
//app.use(express.static('public/js'));
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

  console.log('a user connected');
  
  parser.on('data', (vbat) => {
    // console.log('got word from arduino:', vbat);
    socket.emit('vbat', vbat);
  });

    socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('webrtc', (webrtcdata) => {
    //console.log(webrtcdata);
    socket.broadcast.emit('webrtc', webrtcdata);
  });

  socket.on('video_channel', (vid_channel) => {
    //console.log(webrtcdata);
    socket.broadcast.emit('webrtc', vid_channel);
if(vid_channel == 1)
{
  mset.set_stream(1);
}

else if (vid_channel == 2)
{
  mset.set_stream(2);
}

  });

  socket.on('navi', (status) => {
    socket.emit('navi', status);

    if (cmd != status) {
      cmd = status;
      res = cmd.toString();
      arduinoSerialPort.write(res + '\n');
      console.log(res);
    }

    else if (cmd == status) {

      count++;

      if (count > 10) {
        res = cmd.toString();
        arduinoSerialPort.write(res + '\n');
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
