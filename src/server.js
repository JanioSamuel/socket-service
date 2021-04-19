const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv-safe').config();
const socketIO = require("socket.io");
const queueActions = require('./util/QueueActions');

app.use(express.json());
app.use(cors());


const clients = [];

const server = app.listen(process.env.PORT || 3002);

const io = socketIO(server);

io.on('connect', function (socket) {
  socket.on('join', function (name) {
    clients[socket.id] = name;
    socket.broadcast.emit('chat', 'Server', `${name} has joined the server.`)
  });

  socket.on('send', function (msg) {
    if (msg && msg.includes('/stock=')) {
      const regex = msg.match(/(^\/stock=.\S+)/i)
      const stockName = regex[0].replace('/stock=', '');

      queueActions.sendToQueue('stock.service', { stock: stockName });
    } else {
      io.emit('chat', clients[socket.id], msg);
    }
  });

  socket.on('disconnect', function () {
    io.emit('update', `${clients[socket.id]} has left the server.`);
    delete clients[socket.id];
  });

  queueActions.consume('socket.service', message => {
    const content = JSON.parse(message.content);
    if (content.Close === 'N/D') {
      io.emit('chat', 'Stock Bot', `Sorry, I couldn't find the stock ${content.Symbol}`)
    } else {
      io.emit('chat', 'Stock Bot', `${content.Symbol} quote is $${content.Close} per share`)
    }
  })
})