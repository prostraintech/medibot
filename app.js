// This is the node.js server application

var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https').createServer({
  key: fs.readFileSync('webrtcwwsocket-key.pem'),
  cert: fs.readFileSync('webrtcwwsocket-cert.pem')
}, app);

var SerialPort = require("serialport");
//const Delimiter = require('@serialport/parser-delimiter')
//const InterByteTimeout = require('@serialport/parser-inter-byte-timeout');
const Readline = require('@serialport/parser-readline');


var arduinoCOMPort = "COM4";

var arduinoSerialPort = new SerialPort(arduinoCOMPort, {  
 baudRate: 115200
});

arduinoSerialPort.on('error',function() {
  console.log('Serial Port ' + arduinoCOMPort + ' is not available');
});

const parser = new Readline();
arduinoSerialPort.pipe(parser);

//const parser = arduinoSerialPort.pipe(new Delimiter({ delimiter: '\n' }))
//const parser = arduinoSerialPort.pipe(new InterByteTimeout({interval: 30}));

arduinoSerialPort.on('open',function() {
  console.log('Serial Port ' + arduinoCOMPort + ' is opened.');
});

parser.on('data',function(line) {
  console.log('Data: ' + line);
});


app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/fav'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

https.listen(443, () => {
  console.log((new Date()) + " Umair is eating on port 443");
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
		//onsole.log(status);
		var res = 1100-(Math.trunc((Math.sqrt(Math.pow(status*1000,2))))).toString();
		arduinoSerialPort.write(res+'\n');
		console.log(res);
		
	
	
	});
});




/*

var WebSocketServer = require('websocket').server;
var https = require('https');

var clients = [];
var express = require('express');
var app = express();




app.listen(8080);

// change key and cert if you have other ones you use with a different name
var options = {
  key: fs.readFileSync('webrtcwwsocket-key.pem'),
  cert: fs.readFileSync('webrtcwwsocket-cert.pem'),
};

var server = https.createServer(options, function(request, response) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      response.writeHead(500);
      return response.end('Error loading index.html');
    }
    response.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    response.writeHead(200);
    response.end(data);
  });
});

server.listen(443, function() {
  console.log((new Date()) + " Umair is eating on port 443");
});

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

function sendCallback(err) {
  if (err) console.error("send() error: " + err);
}

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
  var connection = request.accept(null, request.origin);
  console.log(' Connection ' + connection.remoteAddress);
  clients.push(connection);
    
  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      // process WebSocket message
      // console.log((new Date()) + ' Received Message ' + message.utf8Data);
      // broadcast message to all connected clients
      clients.forEach(function (outputConnection) {
        if (outputConnection != connection) {
          outputConnection.send(message.utf8Data, sendCallback);
        }   
      }); 
    }   
  }); 
    
  connection.on('close', function(connection) {
    // close user connection
    console.log((new Date()) + " Peer disconnected.");    
  }); 
});

*/