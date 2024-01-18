const io = require('socket.io')(process.env.PORT, {
    cors: {
        origin: "https://chatsroom.vercel.app",
        methods: ["GET", "POST"]
    }
}); //https://webchats1.netlify.app

const users = {}

io.on('connection', socket => {

    socket.on('newUserJoined', name => {
        console.log("User joined: ", name)
        users[socket.id] = name;
        socket.broadcast.emit("userJoined", name);
    });

    socket.on('newMsg', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    })

});
