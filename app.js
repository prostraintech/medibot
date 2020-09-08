// This is the node.js server application

var express = require('express');
var app = express();
var fs = require('fs');
spawn('cmd.exe', ['/c', 'medikit.vbs'], {
  shell: false,
  detached: true,
  stdio: 'ignore',
  windowsHide: true
}).unref()

var https = require('https').createServer({
  key: fs.readFileSync('webrtcwwsocket-key.pem'),
  cert: fs.readFileSync('webrtcwwsocket-cert.pem')
}, app);
var cmd = 0;
var count = 0;

var SerialPort = require("serialport");
//const Delimiter = require('@serialport/parser-delimiter')
//const InterByteTimeout = require('@serialport/parser-inter-byte-timeout');
const Readline = require('@serialport/parser-readline');


var arduinoCOMPort = "COM5";
//"/dev/ttyACM0";

var arduinoSerialPort = new SerialPort(arduinoCOMPort, {  
 baudRate: 9600
});

arduinoSerialPort.on('error',function() {
  console.log('Serial Port ' + arduinoCOMPort + ' is not available');
});

//const parser = arduinoSerialPort.pipe(new Delimiter({ delimiter: '\n' }))
//const parser = arduinoSerialPort.pipe(new InterByteTimeout({interval: 30}));

arduinoSerialPort.on('open',function() {
  console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
});

//const parser = new Readline();
//arduinoSerialPort.pipe(parser);

//parser.on('data',function(line) {
//  console.log('Data: ' + line);
//});


app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/fav'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



var berry_data = {
  heart_rate : '-',
  spo2 : '-'
}

setInterval(function() {
    spawn('python', ['medikit.py']);
    }, 7000);

app.get('/api/berry', function (req, res) {
  
res.send(berry_data);
});

https.listen(443, () => {
  console.log((new Date()) + " Node server started on port 443");
});

dupvar io = require('socket.io')(https);

io.on('connection', (socket) => {
	
	console.log('a user connected');
 
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('webrtc', (webrtcdata) => {
    //console.log(webrtcdata);
		socket.broadcast.emit('webrtc',webrtcdata);
	});
  
	socket.on('navi', (status) => {
    socket.emit('navi',status);
    //if (cmd != status) {
     // cmd = status;
      //console.log(status);
      var res = cmd.toString();
   // var count_string = count.toString();
    arduinoSerialPort.write(res+'\n');
    console.log(res);
   // console.log(count_string);
      //count = 0;
  //  }

    //count++;

    // else if(cmd == status) {
    //   setInterval(sendData, 2000);
    // }
    //if (count == 1000) {
      //sendData()
      //count = 0;
    //}
  });

socket.on('button', (status) => {
  socket.emit('button',status);
  arduinoSerialPort.write(res+'\n');
  console.log(status.toString());
    
});

socket.on('resp', (status) => {
  socket.emit('resp',status);
  
  berry_data.heart_rate = status.pulse_rate;
  berry_data.spo2 = status.spo2;
  //console.log(status);
  //var res = 1100-(Math.trunc((Math.sqrt(Math.pow(status*1000,2))))).toString();
  //arduinoSerialPort.write(res+'\n');
  console.log("berrymed data rcecived");
    
});

});