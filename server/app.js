const express = require('express')
const socket = require('socket.io')
const http = require('http')
const fs = require('fs')

const PORT = 3001

const app = express()
const server = http.createServer(app)

const io = socket(server)

let userNum = 0

io.sockets.on('connection', (socket) => {

    socket.on('newUser', () => {
        console.log(userNum++, 'connection')
        socket.name = userNum
        io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: userNum + ' connection'})
    })

    socket.on('message', (data) => {
        data.name = socket.name
        // socket.broadcast.emit('update', data);
        io.sockets.emit('update', data);
    })

    socket.on('disconnect', () => {
        console.log(socket.name + 'disconnection')
        // socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + ' disconnection'})
        io.sockets.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + ' disconnection'})
    })
})


server.listen(PORT, () => {
    console.log('Server running at ', PORT)
})