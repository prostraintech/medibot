var socket = io();
var el;
var constraints = {};
var elemVid = document.getElementById("remotevideo");

const spo2 = document.getElementById('spo2');
const pulse = document.getElementById('pulse');
const patientName = document.getElementById('nameInput');
const patientRemark = document.getElementById('remarkInput');
const resetBtn = document.getElementById('reset');
const takeBtn = document.getElementById('take');

var videol = document.querySelector("#videoElement");

  const constraints_navi = {
        'audio': {'echoCancellation': true},
        'video': {
            'deviceId': 'b18c34404595c0cbdb4dd1bcf146b46f709d6357a6a2428910d3b4d17c7f4d5f'
            }
        }

        const constraints_teleconf = {
        'audio': {'echoCancellation': true},
        'video': {
            'deviceId': '6e5b4c36dc543308887c116abf5fac376a78987375fea5cce8fc254b6a145723'
            }
        }

  function getConnectedDevices(type, callback) {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const filtered = devices.filter(device => device.kind === type);
            callback(filtered);
        });
}

getConnectedDevices('videoinput', cameras => console.log('Cameras found', cameras));


//frontcam - 6e5b4c36dc543308887c116abf5fac376a78987375fea5cce8fc254b6a145723

module.exports = {
set_stream: function set_stream (location) {
  // location
  // 1- teleconf
  // 2- navi

  if (location == 1)
  {
    constraints = constraints_teleconf;
  }
  else if (location == 2)
  {
    constraints = constraints_navi;
  }

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
      videol.srcObject = stream;
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });

}

}
}

takeBtn.addEventListener('click', () => {
  socket.emit('patientData', {
    name: patientName.value,
    remark: patientRemark.value,
    info: {
      spo2: spo2.innerHTML,
      heartRate: pulse.innerHTML
    }
  });

  getClear();

  //console.log(patientName.value);
});

resetBtn.addEventListener('click', () => {
  getClear(); 
});

function getClear() {
  spo2.innerHTML = "--";
  pulse.innerHTML = "--";
  patientName.value = "";
  patientRemark.value = "";
}

socket.on('time', (timeString) => {
  el = document.getElementById('server-time');
  el.innerHTML = timeString;
});

socket.on('resp', berrymedData => {
  pulse.innerHTML = berrymedData.pulse_rate;
  spo2.innerHTML = berrymedData.spo2;
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
