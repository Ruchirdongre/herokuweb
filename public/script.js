// const { create } = require("domain");
// const { Stream } = require("stream");

// const { prototype } = require("events");
// import { Peer } from "peerjs";

const socket = io('/')
const videoGrid = document.getElementById('video-grid');
// console.log(videoGrid);
const myVideo = document.createElement('video');
myVideo.muted = true;


var peer = new Peer(undefined, {
    host: 'localhost',
    port:  '9000',
    path: '/myapp',
});


let myVideoStream
// console.log("<%=uuidv4%>");
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    socket.on('user-connected', userId => {
        // console.log("user-connected" + userId)
        connectToNewUser(userId, stream);
    })




    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
        connecToNewUser(userId, stream);
    })
})


var conn = peer.connect('another-peers-id');
// on open will be launch when you successfully connect to PeerServer
conn.on('open', function () {
    // here you have conn.id
    conn.send('hi!');
});
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);

})


// socket.emit('join-room', ROOM_ID,10);

// socket.on('user-connected', userId => {
//     console.log("user-connected" + userId)
//     // connectToNewUser(userId, stream);
// })

socket.on('user-disconnected', userId => {
    console.log(userId)
})

const connectToNewUser = (userId) => {
    console.log("new user");
}

const connecToNewUser = (userId,stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

