const io = require('socket.io')(process.env.PORT || 3000, {
    cors: {
        origin: "*"
        // methods: ["GET", "POST"]
    }
}); 

const users = {}
const MAX_USER = 10;
let connectedUsers = 0;

io.on('connection', socket => {

    connectedUsers++;

    socket.emit('usersOnline', connectedUsers)

    if(connectedUsers <= MAX_USER){

        socket.on('newUserJoined', name => {
          console.log("User joined: ", name);
          console.log("number of users:", connectedUsers);
          users[socket.id] = name;
          socket.broadcast.emit("userJoined", {name: name, totalUsers: connectedUsers});
      });

        socket.on('disconnect', () =>{
          connectedUsers--;
          name = users[socket.id];
          socket.broadcast.emit('userLeft', {name: name, totalUsers: connectedUsers});
          socket.emit('usersOnline', connectedUsers)
          console.log(`${name} disconnected. Total users: ${connectedUsers}`);
      })
    }

    else{
        console.log("Max user limit reached!")
        socket.emit('maxUserReached', { message: 'Maximum users limit reached' });
        socket.disconnect(true);
    }
   
    socket.on('typing', name =>{
        socket.broadcast.emit('userTyping', {name: users[socket.id]});
    });

     socket.on('notTyping', () => {
        socket.broadcast.emit('userTypingFalse');
    })

    socket.on('newMsg', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    socket.on('sendImage', data => {
        var name = users[socket.id];
        socket.broadcast.emit('newImage', {imgData: data.imgData, message: data.msg, name: users[socket.id]});
    });

});