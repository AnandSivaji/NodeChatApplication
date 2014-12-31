'use strict';

var gravatar          = require('gravatar');
var groupNamespace   = '/group';
var privateNamespace = '/private';

module.exports = function (io) {

    // Initialize a new socket.io application, named 'chat'
    var chat = io.of(privateNamespace).on('connection', function (socket) {

        // When the client emits the 'load' event, reply with the
        // number of people in this chat room

        socket.on('load', function (data) {

            var room = findClientsSocket(io, data, privateNamespace);

            if (room.length === 0) {

                socket.emit('peopleinchat', {
                    number: 0
                });

            } else if (room.length === 1) {

                socket.emit('peopleinchat', {
                    number: 1,
                    user: room[0].username,
                    avatar: room[0].avatar,
                    id: data
                });

            } else if (room.length >= 2) {

                chat.emit('tooMany', {
                    boolean: true
                });
            }
        });

        // When the client emits 'login', save his name and avatar,
        // and add them to the room
        socket.on('login', function (data) {

            var room = findClientsSocket(io, data.id, privateNamespace);

            // Only two people per room are allowed
            if (room.length < 2) {

                // Use the socket object to store data. Each client gets
                // their own unique socket object

                socket.username = data.user;
                socket.room = data.id;
                socket.avatar = gravatar.url(data.avatar, {
                    s: '140',
                    r: 'x',
                    d: 'mm'
                });

                // Tell the person what he should use for an avatar
                socket.emit('img', socket.avatar);


                // Add the client to the room
                socket.join(data.id);

                if (room.length == 1) { startChat(room, socket, chat, data); }

            } else {
                socket.emit('tooMany', {
                    boolean: true
                });
            }
        });

        // Somebody left the chat
        socket.on('disconnect', function () {

            // Notify the other person in the chat room
            // that his partner has left

            socket.broadcast.to(this.room).emit('leave', {
                boolean: true,
                room: this.room,
                user: this.username,
                avatar: this.avatar
            });

            // leave the room
            socket.leave(socket.room);
        });


        // Handle the sending of messages
        socket.on('msg', function (data) {

            // When the server receives a message, it sends it to the other person in the room.
            socket.broadcast.to(socket.room).emit('receive', {
                msg: data.msg,
                user: data.user,
                img: data.img
            });
        });
    });

    var groupChat = io.of('/group').on('connection', function (socket) {


        socket.on('load', function (data) {

            var room = findClientsSocket(io, data, groupNamespace);

            if (room.length === 0) {

                socket.emit('chatroomentered', {
                    number: 0
                });

            } else {

                socket.emit('chatroomentered', {
                    number: 1,
                    user: room[0].username,
                    avatar: room[0].avatar,
                    id: data
                });
            }
        });

        socket.on('login', function (data) {

            var room = findClientsSocket(io, data.group, groupNamespace);

            // Use the socket object to store data. Each client gets
            // their own unique socket object

            socket.username = data.user;
            socket.room = data.group;
            socket.avatar = gravatar.url(data.avatar, {
                s: '140',
                r: 'x',
                d: 'mm'
            });

            // Tell the person what he should use for an avatar
            socket.emit('img', socket.avatar);

            // Add the client to the room
            socket.join(data.group);

            if (room.length == 1) { startChat(room, socket, groupChat, data); }
        });
    });
}

function findClientsSocket(io, roomId, namespace) {

    var res = [];
    var ns = io.of(namespace || "/"); // the default namespace is "/"

    if (!ns) return res;

    for (var id in ns.connected) {

        if (roomId) {

            var index = ns.connected[id].rooms.indexOf(roomId);
            if (index !== -1) {
                res.push(ns.connected[id]);
            }
        } else {
            res.push(ns.connected[id]);
        }
    }

    return res;
}

function startChat(room, socket, chat, data) {

    var avatars   = [];
    var usernames = [];

    usernames.push(room[0].username);
    usernames.push(socket.username);

    avatars.push(room[0].avatar);
    avatars.push(socket.avatar);

    // Send the startChat event to all the people in the
    // room, along with a list of people that are in it.

    var id = data.id || data.group;

    chat.in(id).emit('startChat', {
        boolean: true,
        id: id,
        users: usernames,
        avatars: avatars
    });
}
