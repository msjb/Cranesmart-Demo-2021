const express = require('express')
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.use(express.static(__dirname+'/dist/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/dist/index.html');
});

http.listen(3000, () => {
    console.log('listening on port 3000');
});

io.on('connection', (socket) => {
    socket.on('sensor-update', (data) => {
        socket.emit('update-client', (data));
    })
});
