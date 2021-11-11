var socket = io();
var el;
var constraints = {};
var elemVid = document.getElementById("remotevideo");
var dIDnavi ='', dIDtconf='';

var videol = document.querySelector("#videoElement");



function getAllConnectedDevices(label, callback) {
  try {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const filtered = devices.filter(device => device.kind === label);
        callback(filtered);
      });
  }
  catch {
    console.log('no such input here');
  }
}

function getConnectedDevices(label, callback) {
  try {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const filtered = devices.filter(device => device.label === label);
        callback(filtered);
      });
  }
  catch {
    console.log('no such input here');
  }
}

//list all camera
getAllConnectedDevices('videoinput', cameras => {
  try {
    console.log('Cameras found', cameras);
    console.log(cameras[0].deviceId);
    dIDtconf = cameras[0].deviceId;
  }

  catch {
    console.log('no such input here');
  }
});

//find_frontcam
getConnectedDevices('front_cam', cameras => {
  try {
    console.log('Cameras found', cameras);
    console.log(cameras[0].deviceId);
    dIDtconf = cameras[0].deviceId;
  }

  catch {
    console.log('no such input here');
  }
});

//find_navi_cam
getConnectedDevices('Intel(R) RealSense(TM) Depth Camera 455  RGB (8086:0b5c)', cameras => {
  try {
    console.log('Cameras found', cameras);
    console.log(cameras[0].deviceId);
    dIDnavi = cameras[0].deviceId;
  }

  catch {
    console.log('no such input here');
  }
});

const constraints_navi = {
  'audio': { 'echoCancellation': true },
  'video': {
    'deviceId': dIDnavi
  }
}

const constraints_teleconf = {
  'audio': { 'echoCancellation': true },
  'video': {
    'deviceId': dIDtconf
  }
}


function set_stream(location) {
  // location
  // 1- teleconf
  // 2- navi

  if (location == 1) {
    console.log(constraints_teleconf);
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints_teleconf)
        .then(function (stream) {
          videol.srcObject = stream;
        })
        .catch(function (err0r) {
          console.log("Something went wrong!");
        });

    }
  }
  else if (location == 2) {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints_navi)
        .then(function (stream) {
          videol.srcObject = stream;
        })
        .catch(function (err0r) {
          console.log("Something went wrong!");
        });

    }
  }

  console.log("hi " + location);



}

socket.on('testsock', (msg) => {
  el = document.getElementById('server-time');
  el.innerHTML = msg;
  console.log('got sock');
});

socket.on('video_channel', (channel) => {
  set_stream(channel);
  console.log('masuk');
});

function openNav() {
  document.getElementById("sidenav").classList.add("open-nav");
}

function closeNav() {
  document.getElementById("sidenav").classList.remove("open-nav");
}

function openFullscreen() {
  if (elemVid.requestFullscreen) {
    elemVid.requestFullscreen();
  } else if (elemVid.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elemVid.msRequestFullscreen) { /* IE11 */
    elemVid.msRequestFullscreen();
  }
}
