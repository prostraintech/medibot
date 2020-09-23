var express = require('express');
var app = express();
var fs = require('fs');
var shell = require('shelljs');

var https = require('https').createServer({
  key: fs.readFileSync('webrtcwwsocket-key.pem'),
  cert: fs.readFileSync('webrtcwwsocket-cert.pem')
}, app);

var cmd = 0;
var count = 0;
var res;
var scount = 0;
var stat = 1;

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

arduinoSerialPort.on('close', function () {
  console.log('Serial Port ' + arduinoCOMPort + ' is closed');  
});

parser.on('data', data => {
  console.log('got word from arduino:', data);
  //socket.emit('bat_voltage', data);
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

  socket.on('bat_voltage', (batt) => {
    //socket.emit('connect',status);
    console.log(batt);
    // console.log("im here in connect");
  });

  socket.on('update_code', (shut) => {
    //scount += 1;
    //if (scount == 1) {

      const { exec } = require('child_process');
      exec('git pull && pm2 restart 0 && pkill -o chromium || sleep 1s && chromium-browser --app=https://localhost --ignore-certificate-errors &', (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          console.error(err)
          
        } else {
          // the *entire* stdout and stderr (buffered)
          console.log("running <<git pull>>");
          console.log(`${stdout}`);
         // scount = 0;
          //////console.log(`stderr: ${stderr}`);
        }
      });

    //}

  });

/*   socket.on('upload_arduino', (shut) => {
    //scount += 1;
    //if (scount == 1) {

      const { exec } = require('child_process');
      exec('arduino-cli compile --fqbn arduino:avr:mega current-code && pm2 stop 0 && arduino-cli upload -p /dev/ttyACM0 --fqbn arduino:avr:mega current-code && pm2 restart 0 && pm2 restart 0', (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          console.error(err)
          
        } else {
          // the *entire* stdout and stderr (buffered)
          console.log("uploading arduino code..");
          console.log(`${stdout}`);
         // scount = 0;
          //////console.log(`stderr: ${stderr}`);
        }
      });

    //}

  }); */

  socket.on('upload_arduino', (upl) => {
    if (stat != upl) {
      stat = upl;

      arduinoSerialPort.close();

      
        setTimeout(execupl, 2000);
        

      
  
      
  

    }

    else if (stat == upl) {

      scount++;

      if (scount > 5) {
        stat = 1 ; 
        scount = 0;
      }
    }

    //}

  });

  function openard() {
    shell.exec('pm2 restart 0 && pm2 restart 0 && pm2 restart 0',{detach:true}).unref();

  }

  function execupl() {
    shell.exec('arduino-cli compile --fqbn arduino:avr:mega current-code && arduino-cli upload -p /dev/ttyACM0 --fqbn arduino:avr:mega current-code');
    setTimeout(openard, 3000);
  }
  

});
