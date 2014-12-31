'use strict';

$(function() {

    var groupName = window.location.pathname.match(/\/group\/(\w+)$/);
    groupName = (groupName) ? String(groupName[1]) : null;

    // connect to the socket
    var socket = io.connect('/group');

    var name   = "";
    var email  = "";
    var img    = "";
    var friend = "";


    var loginForm = $(".p-login-form");
    var hisName   = $("#p-his-name");
    var hisEmail  = $("#p-his-email");

    // on connection to server get the id of person's room
    socket.on('connect', onConnectionEstablished);

    // receive the names and avatars of all people in the chat room
    socket.on('chatroomentered', onChatRoomEntered);

    // Other useful
    socket.on('startChat', onStartChat);

    function onConnectionEstablished() {

        while (!groupName) { groupName = prompt('Please enter a group name'); }
        socket.emit('load', groupName);
    }

    function onChatRoomEntered(data) {

        if (data.number === 0) {

            Utils.showMessage("connected");

            loginForm.on('submit', onFirstUserLoginSubmitted);
        } else {

            Utils.showMessage("personinchat", data);

            loginForm.on('submit', function(event) { onLoginFormSubmitted(data, event); });
        }
    }

    function onFirstUserLoginSubmitted(event) {

        event.preventDefault();

        var yourName  = $("#p-user-name");
        name = $.trim(yourName.val());

        if (name.length < 1) {

            alert("Please enter a nick name longer than 1 character!");
            return;
        }

        var yourEmail = $("#p-user-email");
        email = yourEmail.val();

        if (!Utils.isValid(email)) {

            alert("Please enter a valid email!");
            return;
        }

        Utils.showMessage("inviteSomebody", groupName);

        // call the server-side function 'login' and send user's parameters
        socket.emit('login', { user: name, avatar: email, group: groupName });
    }

    function onLoginFormSubmitted(data, event) {

        event.preventDefault();

        name = $.trim(hisName.val());

        if (name.length < 1) {
            alert("Please enter a nick name longer than 1 character!");
            return;
        }

        if (name == data.user) {
            alert("There already is a \"" + name + "\" in this room!");
            return;
        }

        email = hisEmail.val();

        if (!Utils.isValid(email)) {
            alert("Wrong e-mail format!");
            return;
        }

        socket.emit('login', { user: name, avatar: email, group: groupName });
    }

    function onStartChat(data) {

        console.log(data.id);

        console.log("data");

        if(!data.boolean || data.id != groupName) return;

        var chats = $(".p-chats");
        var chatNickname = $(".p-chat-nickname");

        chats.empty();

        var startMessage = (name === data.users[0]) ? 'youStartedChatWithNoMessages' : 'heStartedChatWithNoMessages';

        Utils.showMessage(startMessage, data, friend);

        chatNickname.text(friend);
    }
})
