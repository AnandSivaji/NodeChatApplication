'use strict';
var Utils = {};

$(document).ready(function() {

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

       Utils.scrollToBottom = function () {
        $("html, body").animate({
            scrollTop: $(document).height() - $(window).height()
        }, 1000);
    };

    Utils.isValid = function(thatemail) {

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(thatemail);
    };

    Utils.showMessage = function(status, data, friend) {

        if (status === "connected") {

            section.children().css('display', 'none');
            onConnect.fadeIn(1200);

        } else if (status === "inviteSomebody") {

            // Set the invite link content
            var groupName = '';

            if (data) {
                groupName = window.location.pathname.match(/\/group\/(\w+)$/);
                groupName = (groupName) ? String(groupName[1]) : null;
                data = (!groupName) ? data : null;
            }

            var url = data ? window.location.href + '/' + data : window.location.href;

            $("#p-chat-link").text(url);
            $("#p-chat-link").attr('href', url);

            onConnect.fadeOut(1200, function () {
                inviteSomebody.fadeIn(1200);
            });

        } else if (status === "personinchat") {

            onConnect.css("display", "none");
            personInside.fadeIn(1200);

            chatNickname.text(data.user);
            ownerImage.attr("src", data.avatar);

        } else if (status === "youStartedChatWithNoMessages") {

            left.fadeOut(1200, function () {
                inviteSomebody.fadeOut(1200, function () {
                    noMessages.fadeIn(1200);
                    footer.fadeIn(1200);
                });
            });

            friend = data.users[1];
            noMessagesImage.attr("src", data.avatars[1]);

        } else if (status === "heStartedChatWithNoMessages") {

            personInside.fadeOut(1200, function () {
                noMessages.fadeIn(1200);
                footer.fadeIn(1200);
            });

            friend = data.users[0];
            noMessagesImage.attr("src", data.avatars[0]);

        } else if (status === "chatStarted") {

            section.children().css('display', 'none');
            chatScreen.css('display', 'block');

        } else if (status === "somebodyLeft") {

            leftImage.attr("src", data.avatar);
            leftNickname.text(data.user);

            section.children().css('display', 'none');
            footer.css('display', 'none');
            left.fadeIn(1200);

        } else if (status === "tooManyPeople") {

            section.children().css('display', 'none');
            tooManyPeople.fadeIn(1200);
        }
    };

    Utils.createChatMessage = function(msg, user, imgg, now) {

        var who = '';

        if(user===name) {
            who = 'me';
        }
        else {
            who = 'you';
        }

        var li = $(
            '<li class=' + who + '>'+
                '<div class="image">' +
                    '<img src=' + imgg + ' />' +
                    '<b></b>' +
                    '<i class="timesent" data-time=' + now + '></i> ' +
                '</div>' +
                '<p></p>' +
            '</li>');

        // use the 'text' method to escape malicious user input
        li.find('p').text(msg);
        li.find('b').text(user);

        chats.append(li);

        messageTimeSent = $(".timesent");
        messageTimeSent.last().text(now.fromNow());
    }
});
