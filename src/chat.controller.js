/**
 * add chat controller to chatApp module
 */
(function () {
    /*jshint validthis: true */

    'use strict';

    // add controller to app
    angular.module('chatApp')
        .controller('chatCtrl', chatCtrlFct);

    // inject dependencie
    chatCtrlFct.$inject = ['$mdDialog'];

    /**
     * the chat controller function
     * @param  $mdDialog injection
     */
    function chatCtrlFct($mdDialog) {
        var _this = this;

        /**
         * chats list
         * @type {Object}
         */
        this.chats = createInitChats();

        /**
         * handle key down in input message
         * @param  {Object} the event description object
         * @param  {Object} chat concerned by the input
         */
        this.keySend = function(event, chat) {
            if (event.keyCode == 13) {
                _this.send(chat);
            }
        };

        /**
         * send message
         * @param  {Object} the chat wich send a message
         */
        this.send = function(chat) {
            var targets = getTargets(_this.chats, chat);
            var time = moment().format('MMMM Do YYYY, h:mm:ss a');
            var msg = createMsg(chat.currentMsgText, chat.getName(), time, chat.currentMsgTarget != 'All');
            sendMsg(targets, msg);
            chat.currentMsgText = "";
        };

        /**
         * close a chat
         * @param  {Object} the chat to close
         */
        this.exit = function(chat) {
            //_this.chats[chat.getName()] = undefined;
            delete _this.chats[chat.getName()];
            var time = moment().format('MMMM Do YYYY, h:mm:ss a');
            var msg = createMsg(chat.getName() + ' quit the chat', 'info', time);
            sendMsg(_this.chats, msg);
        };

        /**
         * add a new chat with dialog input to get the name
         * @param {event} the openner dialog event
         */
        this.addChatDialog = function(event) {
            var dialog = $mdDialog.prompt()
                .title('What would you name your chat?')
                .placeholder('chat name')
                .ariaLabel('Chat name')
                .targetEvent(event)
                .ok('Ok')
                .cancel('Cancel');
            $mdDialog.show(dialog).then(function(chatName) {
                if (chatName === undefined ||
                    chatName === 'info' ||
                    chatName === 'All' ||
                    _this.chats[chatName]) {
                    $mdDialog.show(
                      $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent('You can\'t specify this name.')
                        .ariaLabel('Name Error')
                        .ok('Got it!')
                    );
                } else {
                    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
                    var msg = createMsg(chatName + ' enter on the chat', 'info', time);
                    sendMsg(_this.chats, msg);
                    _this.chats[chatName] = createChat(chatName, []);
                }
            });
        };

        /**
         * get all possible targets of message to a chat
         */
        this.getPossibleTargets = getPossibleTargets.bind(this, this.chats);

        /**
         * get css class for a message
         * @param  {Object} the message object
         * @return {string} the css class name of the message
         */
        this.getMsgTxtClass = function(msg) {
            return msg.isWhisper() ? 'whispered_msg' : 'standard_msg';
        };
    }

    /**
     * send a message to other chats
     * @param  {Array} list of chats wich will receive the msg
     * @param  {Object} message
     */
    function sendMsg(chats, msg) {
        _.forOwn(chats, function(chat) {
            chat.addMessage(msg);
        });
    }

    /**
     * get all possible target of a message
     * @param  {Array} chats array
     * @param  {Object} chat wich send the msg
     * @return {Array} possible targets
     */
    function getPossibleTargets(chats, chatSrc) {
        var targets = ['All'];
        _.forOwn(chats, function(chat, chatName) {
            if (chatName != chatSrc.getName()) {
                targets.push(chatName);
            }
        });
        return targets;
    }

    /**
     * get target from chat
     * @param  {Array} chats array
     * @param  {Object} chat wich send the msg
     * @return {Array} msg targets
     */
    function getTargets(chats, chatSrc) {
        var targets = [];
        if (chatSrc.currentMsgTarget === 'All') {
            return chats;
        }
        targets.push(chatSrc);
        _.forOwn(chats, function(chat, chatName) {
            if (chatName === chatSrc.currentMsgTarget) {
                targets.push(chat);
            }
        });
        return targets;
    }

    /**
     * Create chat object
     * @param  {string} chat name
     * @param  {Array} list of message in the chat
     * @return {Object} a new chat object
     */
    function createChat(name, messages) {
        return {
            currentMsgText: '',
            currentMsgTarget: 'All',
            getName: function() {
                return name;
            },
            getMessages: function() {
                return messages;
            },
            addMessage: function(msg) {
                messages.push(msg);
            }
        };
    }

    /**
     * Create message object
     * @param  {string} text of the message
     * @param  {string} the name of the chat wich send the message
     * @param  {string} the time
     * @param  {boolean} true if it's not a global message
     * @return {Object} a new message object
     */
    function createMsg(text, author, time, whisper) {
        return {
            getText: function() {
                return text;
            },
            getAuthor: function() {
                return author;
            },
            getTime: function() {
                return time;
            },
            isWhisper: function() {
                return whisper;
            }
        };
    }

    /**
     * create a map of chat with chat A and chat B
     * @return {Object}
     */
    function createInitChats() {
        var chats = {};
        chats["Chat A"] = createChat("Chat A", []);
        chats["Chat B"] = createChat("Chat B", []);
        return chats;
    }
})();