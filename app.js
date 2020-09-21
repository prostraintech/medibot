var express = require('express');
var app = express();
var fs = require('fs');

var https = require('https').createServer({
  key: fs.readFileSync('webrtcwwsocket-key.pem'),
  cert: fs.readFileSync('webrtcwwsocket-cert.pem')
}, app);

var cmd = 0;
var count = 0;

var SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');

var arduinoCOMPort = "/dev/ttyACM0";

var arduinoSerialPort = new SerialPort(arduinoCOMPort, {
  baudRate: 9600
});

const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\n' }));

arduinoSerialPort.on('error', function () {
  console.log('Serial Port ' + arduinoCOMPort + ' is not available');
});

arduinoSerialPort.on('open', function () {
  console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
});

// arduinoSerialPort.on('data',function(fromArduino) {
//   console.log('Data:', fromArduino)
// }) 

parser.on('data', data =>{
  console.log('got word from arduino:', data);
});


app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/fav'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var berry_data = {
  heart_rate: '-',
  spo2: '-'
}

/*setInterval(function() {

  var spawn = require('child_process').spawn;
  var cp = spawn(process.env.comspec, ['/c', 'python','medikit.py']);
    }, 5000);*/

app.get('/api/berry', function (req, res) {

  res.send(berry_data);
});

https.listen(443, () => {
  console.log((new Date()) + " Node server started on port 443");
});

var io = require('socket.io')(https);

io.on('connection', (socket) => {

  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('webrtc', (webrtcdata) => {
    //console.log(webrtcdata);
    socket.broadcast.emit('webrtc', webrtcdata);
  });

  socket.on('navi', (status) => {
    socket.emit('navi', status);
    //console.log("i'm here at navi");
    if (cmd != status) {
      cmd = status;
      var res = cmd.toString();
      arduinoSerialPort.write(res + '\n');
      console.log(res);
    }

    count++;
    // console.log(count);

    if (count > 50) {
      arduinoSerialPort.write(res + '\n');
      count = 0;
    }

  });

  socket.on('resp', (response) => {
    socket.emit('resp', response);

    berry_data.heart_rate = response.pulse_rate;
    berry_data.spo2 = response.spo2;
    console.log("berrymed data received - pulse: " + response.pulse_rate + " spo2 = " + response.spo2);

  });

  socket.on('connect', (conn) => {
    //socket.emit('connect',status);
    //console.log(status);
    console.log("im here in connect");
  });

  socket.on('shutdown', (shut) => {
    //socket.emit('shutdown',shut);

  console.log("im here in shutdown");

  });

});