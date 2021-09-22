var socket = io();
var el;
var elemVid = document.getElementById("remotevideo");

const spo2 = document.getElementById('spo2');
const pulse = document.getElementById('pulse');
const patientName = document.getElementById('nameInput');
const patientRemark = document.getElementById('remarkInput');
const resetBtn = document.getElementById('reset');
const takeBtn = document.getElementById('take');

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
