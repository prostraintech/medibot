var localvid = document.getElementById('localvideo');
var remotevid = document.getElementById('remotevideo');
var localStream = null;
var pc = null;
var mediaFlowing = false;
var useH264 = false;
var dINIT = '';


function startMedia(constraints) {

  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      localStream = stream;
      try {
        localvid.srcObject = stream;
        var playPromise = localvid.play();

        if (playPromise !== undefined) {
          playPromise.then(_ => {
            // Automatic playback started!
            connect();
          })
          .catch(error => {
            // Auto-play was prevented
         
          });
        }

      } catch (e) {
        console.log("Error setting video src: ", e);
      }
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
      if (location.protocol === 'http:') {
        alert('Please test this using HTTPS.');
      } else {
        alert('Have you enabled the appropriate flag? see README.md');
      }
      console.error(err);
    });

    
}

function startLocalMedia(constraints) {

  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      localStream = stream;
      try {
        localvid.srcObject = stream;
        var playPromise = localvid.play();

        if (playPromise !== undefined) {
          playPromise.then(_ => {
            // Automatic playback started!
            //connect();
          })
          .catch(error => {
            // Auto-play was prevented
         
          });
        }

      } catch (e) {
        console.log("Error setting video src: ", e);
      }
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
      if (location.protocol === 'http:') {
        alert('Please test this using HTTPS.');
      } else {
        alert('Have you enabled the appropriate flag? see README.md');
      }
      console.error(err);
    });

    
}

// stop local video
function stopMedia() {
  console.log("stopMedia");
  localvid.src = "";
  localStream.getVideoTracks()[0].stop();
}

function useH264Codec(sdp) {
  console.log("useH264Codec");
  var isFirefox = typeof InstallTrigger !== 'undefined';
  if (isFirefox)
    updated_sdp = sdp.replace("m=video 9 UDP/TLS/RTP/SAVPF 120 126 97\r\n", "m=video 9 UDP/TLS/RTP/SAVPF 126 120 97\r\n");
  else
    updated_sdp = sdp.replace("m=video 9 UDP/TLS/RTP/SAVPF 100 101 107 116 117 96 97 99 98\r\n", "m=video 9 UDP/TLS/RTP/SAVPF 107 101 100 116 117 96 97 99 98\r\n");

  return updated_sdp;
}

function setLocalDescAndSendMessageOffer(sessionDescription) {
  console.log("setLocalDescAndSendMessageOffer");
  if (useH264) {
    // use H264 video codec in offer every time
    sessionDescription.sdp = useH264Codec(sessionDescription.sdp);
  }

  pc.setLocalDescription(sessionDescription);

  // console.log("Sending SDP offer: ");
  // console.log(sessionDescription);

  socket.emit('webrtc', JSON.stringify({
    "messageType": "offer",
    "peerDescription": sessionDescription
  }));
}

function setLocalDescAndSendMessageAnswer(sessionDescription) {
  console.log("setLocalDescAndSendMessageAnswer");
  if (useH264) {
    // use H264 video codec in offer every time
    sessionDescription.sdp = useH264Codec(sessionDescription.sdp);
  }

  pc.setLocalDescription(sessionDescription);

  // console.log("Sending SDP answer:");
  // console.log(sessionDescription);

  socket.emit('webrtc', JSON.stringify({
    "messageType": "answer",
    "peerDescription": sessionDescription
  }));


}

function onCreateOfferFailed() {
  console.log("Create Offer failed");
}

// start the connection on button click
function connect() {
  console.log('connect');
  if (!mediaFlowing && localStream) {
    createPeerConnection();
    mediaFlowing = true;
    pc.createOffer()
      .then(setLocalDescAndSendMessageOffer)

      .catch(onCreateOfferFailed);
  } else {
    console.log("Please wait, syncing matrix presence..");
  }
}

// stop the connection on button click
function disconnect() {
  console.log("disconnect.");
  socket.emit('webrtc', JSON.stringify({
    messageType: "bye"
  }));
  stop();
}

function stop() {
  console.log('stop');
  if (pc !== null) {
    pc.close();
    pc = null;
    remotevid.srcObject = null;
    //remotevid.getVideoTracks()[0].stop();
    mediaFlowing = false;
  }
}

function onCreateAnswerFailed(error) {
  // console.log("Create Answer failed:",error);
}

//socket.addEventListener("message", onWebSocketMessage, false);

socket.on('webrtc', function(webrtcdata) {
  console.log("socket.on webrtc");

  var message = JSON.parse(webrtcdata);

  if (message.messageType === 'offer') {
    console.log("Received offer...")
    // console.log(evt);
    if (!mediaFlowing) {
      createPeerConnection();
      mediaFlowing = true;
    }
    // console.log('Creating remote session description...' );

    var remoteDescription = message.peerDescription;

    pc.setRemoteDescription(remoteDescription)
      .then(function() {
        // console.log('Sending answer...');
        pc.createAnswer()
          .then(setLocalDescAndSendMessageAnswer)

          .catch(onCreateAnswerFailed)
      })
      .catch(function() {
        // console.log('Error setting remote description');
      });



  } else if (message.messageType === 'answer' && mediaFlowing) {
    // console.log('Received answer...');
    // console.log('Setting remote session description...' );
    var remoteDescription = message.peerDescription;
    pc.setRemoteDescription(remoteDescription);

  } else if (message.messageType === "iceCandidate" && mediaFlowing) {
    // console.log('Received ICE candidate...');
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: message.candidate.sdpMLineIndex,
      sdpMid: message.candidate.sdpMid,
      candidate: message.candidate.candidate
    });
    pc.addIceCandidate(candidate);

  } else if (message.messageType === 'bye' && mediaFlowing) {
    // console.log("Received bye");
    stop();
  }
});
// process messages from web socket


function createPeerConnection() {
  console.log("Creating peer connection");
  var pc_config = {
    "iceServers": []
  };
  try {
    pc = new RTCPeerConnection(pc_config);
  } catch (e) {
    // console.log("Failed to create PeerConnection, exception: " + e.message);
  }
  // send any ice candidates to the other peer
  pc.onicecandidate = function(evt) {
    if (evt.candidate) {
      // console.log('Sending ICE candidate...');
      // console.log(evt.candidate);

      socket.emit('webrtc', JSON.stringify({
        "messageType": "iceCandidate",
        "candidate": evt.candidate
      }));
    } else {
      // console.log("End of candidates.");
    }
  };
  // console.log('Adding local stream...');
  pc.addStream(localStream);

  pc.addEventListener("addstream", onRemoteStreamAdded, false);
  pc.addEventListener("removestream", onRemoteStreamRemoved, false)

  // when remote adds a stream, hand it on to the local video element
  function onRemoteStreamAdded(evt) {
    // console.log("Added remote stream");
    remotevid.srcObject = evt.stream;
  }

  // when remote removes a stream, remove it from the local video element
  function onRemoteStreamRemoved(evt) {
    // console.log("Remove remote stream");
    remotevid.src = "";
  }
}

function initgetConnectedDevices(label, callback) {
  try {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const filtered = devices.filter(device => device.label === label);
        callback(filtered);
      });
  }
  catch {

    
    console.log('hola');
  }
}

initgetConnectedDevices('front_cam', cameras => {
  try {
    //console.log('Cameras found', cameras);
    //console.log(cameras[0].deviceId);
    dINIT = cameras[0].deviceId;
if (cameras && cameras.length > 0)
{
  console.log('jumpa');
    const constraints_inity = {
      "audio": true,
      "video": {
        "deviceId" : dINIT,
        "maxWidth": 1280,
        "maxHeight": 720,
        "aspectRatio": 16/9,
        "frameRate": {
          "min": "10"
        }
      }
    };

    startLocalMedia(constraints_inity);
  }
   
    
  }

  catch {
    console.log('hola');
    console.log('xjumpa');
    const constraints_initn = {
      "audio": true,
      "video": {
        "maxWidth": 1280,
        "maxHeight": 720,
        "aspectRatio": 16/9,
        "frameRate": {
          "min": "10"
        }
      }
    };

    startLocalMedia(constraints_initn);

  }
});


console.log("Connected to Medibot");
