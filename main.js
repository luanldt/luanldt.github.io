const socket = io('https://demo-peerjs.herokuapp.com/ ');

$('#div-chat').hide();

socket.on('DANH_SACH_ONLINE', arrUserInfo => {

  $('#div-chat').show();
  $('#div-dang-ky').hide();

  arrUserInfo.forEach(user => {
    const {username, peerId} = user;
    $('#userOnline').append(`<li id=${peerId}>${username}</li>`);
  });
  socket.on('CO_NGUOI_DUNG_MOI', user => {
    const {username, peerId} = user;
    $('#userOnline').append(`<li id=${peerId}>${username}</li>`);
  });

  socket.on('AI_DO_NGAT_KET_NOI', peerId => {
    $(`#${peerId}`).remove();
  });
});

socket.on('DANG_KY_THAT_BAI', () => {
  alert('Vui chon chon username khac!');
});


function openStream() {
  const config = {audio: false, video: true};
  return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
}
//
// openStream()
// .then(stream => playStream('localStream', stream));



const peer = new Peer({key: "peerjs", host: "https://peerdemosocket.herokuapp.com/", secure: true, port: 443});
peer.on('open', id => {
  $('#mypeer span').html(id);
  $('#signup').click(function() {
    socket.emit('NGUOI_DUNG_DANG_KY', {
      username: $('#signupText').val(), peerId: id
    });
  });
});

//Caller
$('#call').click(() =>  {
  const id = $('#remoteId').val();
  openStream()
    .then(stream => {
      playStream('localStream', stream);
      const call = peer.call(id, stream);
      call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});


peer.on('call', call => {
  openStream()
    .then(stream => {
      call.answer(stream);
      playStream('localStream', stream);
      call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

$('#userOnline').on('click', 'li', function() {
  const id = $(this).attr('id');
  openStream()
    .then(stream => {
      playStream('localStream', stream);
      const call = peer.call(id, stream);
      call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});
