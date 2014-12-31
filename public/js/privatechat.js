'use strict';
// This file is executed in the browser, when people visit /chat/<random id>

$(document).ready(function() {

    // getting the id of the room from the url
    var id = Number(window.location.pathname.match(/\/private\/(\d+)$/)[1]);

    // connect to the socket
    var socket = io.connect('/private');

    // variables which hold the data for each person
    var name = "",
        email = "",
        img = "",
        friend = "";

    // cache some jQuery objects
    var section = $(".p-chat-section"),
        footer = $("footer"),
        onConnect = $(".p-chat-connected"),
        inviteSomebody = $(".p-chat-invite-textfield"),
        personInside = $(".p-person-inside"),
        chatScreen = $(".p-chat-screen"),
        left = $(".p-chat-left"),
        noMessages = $(".p-chat-no-messages"),
        tooManyPeople = $(".p-chat-too-many-people");

    // some more jquery objects
    var chatNickname = $(".p-chat-nickname"),
        leftNickname = $(".p-chat-nickname-left"),
        loginForm = $(".p-login-form"),
        yourName = $("#p-user-name"),
        yourEmail = $("#p-user-email"),
        hisName = $("#p-his-name"),
        hisEmail = $("#p-his-email"),
        chatForm = $("#chatform"),
        textarea = $("#message"),
        messageTimeSent = $(".timesent"),
        chats = $(".p-chats");

    // these variables hold images
    var ownerImage = $(".p-info-inside img"),
        leftImage = $(".p-chat-left img"),
        noMessagesImage = $("#noMessagesImage");


    // on connection to server get the id of person's room
    socket.on('connect', function() {

        socket.emit('load', id);
    });

    // save the gravatar url
    socket.on('img', function(data){
        img = data;
    });

    // receive the names and avatars of all people in the chat room
    socket.on('peopleinchat', function(data) {

        if(data.number === 0){

            Utils.showMessage("connected");

            loginForm.on('submit', function(e){

                e.preventDefault();

                name = $.trim(yourName.val());

                if(name.length < 1){
                    alert("Please enter a nick name longer than 1 character!");
                    return;
                }

                email = yourEmail.val();

                if(!Utils.isValid(email)) {
                    alert("Please enter a valid email!");
                }
                else {

                    Utils.showMessage("inviteSomebody");

                    // call the server-side function 'login' and send user's parameters
                    socket.emit('login', {user: name, avatar: email, id: id});
                }

            });
        }

        else if(data.number === 1) {

            Utils.showMessage("personinchat",data);

            loginForm.on('submit', function(e){

                e.preventDefault();

                name = $.trim(hisName.val());

                if(name.length < 1){
                    alert("Please enter a nick name longer than 1 character!");
                    return;
                }

                if(name == data.user){
                    alert("There already is a \"" + name + "\" in this room!");
                    return;
                }
                email = hisEmail.val();

                if(!Utils.isValid(email)){
                    alert("Wrong e-mail format!");
                }
                else {
                    socket.emit('login', {user: name, avatar: email, id: id});
                }

            });
        }

        else {
            Utils.showMessage("tooManyPeople");
        }

    });

    // Other useful

    socket.on('startChat', function(data){
        console.log(data);
        if(data.boolean && data.id == id) {

            chats.empty();

            if(name === data.users[0]) {

                Utils.showMessage("youStartedChatWithNoMessages", data, friend);
            }
            else {

                Utils.showMessage("heStartedChatWithNoMessages", data, friend);
            }

            chatNickname.text(friend);
        }
    });

    socket.on('leave',function(data){

        if(data.boolean && id==data.room) {

            Utils.showMessage("somebodyLeft", data);
            chats.empty();
        }

    });

    socket.on('tooMany', function(data) {

        if(data.boolean && name.length === 0) {

            Utils.showMessage('tooManyPeople');
        }
    });

    socket.on('receive', function(data) {

        Utils.showMessage('chatStarted');

        if(data.msg.trim().length) {
            Utils.createChatMessage(data.msg, data.user, data.img, moment());
            Utils.scrollToBottom();
        }
    });

    textarea.keypress(function(e){

        // Submit the form on enter

        if(e.which == 13) {
            e.preventDefault();
            chatForm.trigger('submit');
        }

    });

    chatForm.on('submit', function(e){

        e.preventDefault();

        // Create a new chat message and display it directly

        Utils.showMessage("chatStarted");

        if(textarea.val().trim().length) {
            Utils.createChatMessage(textarea.val(), name, img, moment());
            Utils.scrollToBottom();

            // Send the message to the other person in the chat
            socket.emit('msg', {msg: textarea.val(), user: name, img: img});

        }
        // Empty the textarea
        textarea.val("");
    });

    // Update the relative time stamps on the chat messages every minute

    setInterval(function(){

        messageTimeSent.each(function(){
            var each = moment($(this).data('time'));
            $(this).text(each.fromNow());
        });

    },60000);

    // Function that creates a new chat message


});
