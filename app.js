// This is the node.js server application

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
//const Delimiter = require('@serialport/parser-delimiter')
//const InterByteTimeout = require('@serialport/parser-inter-byte-timeout');
const Readline = require('@serialport/parser-readline');


var arduinoCOMPort = "COM7";
//"/dev/ttyACM0";

/*new by NR
var readData = '';
var sp = new SerialPort(arduinoCOMPort,{} );

sp.on('close', function (err) {
  console.log('port closed');
});

sp.on('error', function (err) {
  console.error("error", err);
});

sp.on('open', function () {
  console.log('port opened... Press reset on the Arduino.');
});

sp.open(arduinoCOMPort, {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false
});
/*end by NR*/

/**disable original code temporarily*********************************/
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

/*************************************************/
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

  var spawn = require('child_process').spawn;
  var cp = spawn(process.env.comspec, ['/c', 'python','medikit.py']);
    }, 5000);

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
		socket.broadcast.emit('webrtc',webrtcdata);
	});
  
	socket.on('navi', (status) => {
    socket.emit('navi',status);
    //console.log("ni'm here at navi");
    if (cmd != status) {
      cmd = status;
      var res = cmd.toString();
      arduinoSerialPort.write(res+'\n');
      console.log(res);
      }

    count++;

    if (count > 50) {
    arduinoSerialPort.write(res+'\n');
    //console.log(res);
    count = 0;
    }
    
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
  console.log("berrymed data received - pulse: " + status.pulse_rate + " spo2 = " + status.spo2);
    
});

socket.on('connect', (status) => {
  socket.emit('connect',status);
  var r = status.toString();
  if (r == 'c')
  {
    //connect();
    console.log("[starting teleconference]");
  }

  if (r == 'd')
  {
    //disconnect();
    console.log("[stopping teleconference]");
  }
    
});

socket.on('shutdown', (status) => {
  socket.emit('shutdown',status);
  
 
    var spawn = require('child_process').spawn;
    var cp = spawn(process.env.comspec, ['/c', 'shutdown',]);

    
});

});