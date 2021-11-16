var socket = io();
var el;
var constraints = {};
var elemVid = document.getElementById("remotevideo");
var dIDnavi = '', dIDtconf = '';

var videol = document.getElementById("localvideo");
var sid;
var gmarker = document.getElementById("gmarker");

var set_statbar = document.getElementById("statbar");


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
    //dIDtconf = cameras[0].deviceId;
  }

  catch {
    console.log('no such input here');
  }
});


function set_stream(location) {
  // location
  // 1- teleconf
  // 2- navi

  if (location == 1) {
    const constraints_teleconf = {
      'audio': { 'echoCancellation': true },
      'video': {
        'deviceId': dIDtconf,
        "maxWidth": 1280,
        "maxHeight": 720,
        "aspectRatio": 16 / 9,
        "frameRate": {
          "min": "10"
        }
      }
    }

    gmarker.style.display="none";
    disconnect();
    startMedia(constraints_teleconf);

  }
  else if (location == 2) {

    const constraints_navi = {
      'audio': { 'echoCancellation': true },
      'video': {
        'deviceId': dIDnavi,
        "maxWidth": 1280,
        "maxHeight": 720,
        "aspectRatio": 16 / 9,
        "frameRate": {
          "min": "10"
        }
      }
    }
    gmarker.style.display="none";
    disconnect();
    startMedia(constraints_navi);
    
  }

  console.log("hi " + location);



}


socket.on('video_channel', (channel) => {
  set_stream(channel);
  console.log('masuk');
});

socket.on('statbar', (status) => {
  if (status == 1)
  {
    set_statbar.innerHTML = 'TELEPERESENCE';
    set_statbar.classList.remove("btn-primary");
    set_statbar.classList.remove("btn-warning");
    set_statbar.classList.add("btn-danger");
    set_statbar.classList.add("btn-info");
  }

  else if (status == 2)
  {
    set_statbar.innerHTML = 'NAVIGATION';
    set_statbar.classList.remove("btn-primary");
    set_statbar.classList.remove("btn-info");
    set_statbar.classList.add("btn-danger");
    set_statbar.classList.add("btn-warning");
  }

  else if (status == 0)
  {
    set_statbar.innerHTML = 'DISCONNECTED';
    set_statbar.classList.remove("btn-primary");
    set_statbar.classList.remove("btn-info");
    set_statbar.classList.remove("btn-warning");
    set_statbar.classList.add("btn-danger");
  }
});

socket.on('connect', () => {
  sid = socket.id; //
  console.log("client acknowledge connection");

  getConnectedDevices('front_cam', cameras => {
    try {
      console.log('Cameras found', cameras);
      console.log(cameras[0].deviceId);
      dIDtconf = cameras[0].deviceId;
      if (cameras.length > 0)
      {

        socket.emit('identifymedibot', sid);
        
        gmarker.style.display = "none";

 
      }
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
