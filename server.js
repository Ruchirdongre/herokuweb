const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid');
const port =  3030;
// const { ExpressPeerServer } = require('peer');
// const peerServer = ExpressPeerServer(server, {
//     deburg: true
// });
app.set('view engine', 'ejs');
app.use(express.static('public'))





// app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
    // res.status(200).send("hello world");
    // res.render('room');
    res.redirect(`/${uuidv4()}`)

})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})



io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log("joined room")
        socket.join(roomId);

        // socket.to(roomId).broadcast.emit('user-connected');
        socket.broadcast.to(roomId).emit('user-connected', userId);
    console.log(roomId, userId);
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);


        })
    })
})


server.listen(port);