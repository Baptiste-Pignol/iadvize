/**
 * Test the chat controller
 */
describe('Testing chat controller', function() {
  var scope;

  /*
  * create chat controller before each test
   */
	beforeEach(function (){
    angular.mock.module('chatApp');
    angular.mock.inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      $controller('chatCtrl as ctrl', {$scope: scope});
    });
  });

  /**
   * just test if tests are ok
   */
  it('tests works', function() {
    expect(true).toBe(true);
  });

  /**
   * test if the initialisation of the two first chats (A and B) is ok
   */
  it('chats initialisation', function() {
    expect(scope.ctrl.chats['Chat A']).not.toBe(null);
    expect(scope.ctrl.chats['Chat B']).not.toBe(null);

    expect(scope.ctrl.chats['Chat A'].getName()).toBe('Chat A');
    expect(scope.ctrl.chats['Chat B'].getName()).toBe('Chat B');

    expect(scope.ctrl.chats['Chat A'].getMessages().length).toBe(0);
    expect(scope.ctrl.chats['Chat B'].getMessages().length).toBe(0);
  });
  /**
   * test the creation of the list of possible target for messages
   */
  it('check message target', function() {
    var targetPossible = scope.ctrl.getPossibleTargets(scope.ctrl.chats['Chat A']);
    expect(targetPossible.length).toBe(2);
    expect(targetPossible[0]).toBe('All');
    expect(targetPossible[1]).toBe('Chat B');
    expect(scope.ctrl.chats['Chat A'].currentMsgTarget).toBe('All');
  });
  /**
   * test message sending
   */
  it('send message', function() {
    var chatA = scope.ctrl.chats['Chat A'];
    expect(chatA.getMessages()).toEqual([]);

    var chatB = scope.ctrl.chats['Chat B'];
    expect(chatB.getMessages()).toEqual([]);

    chatA.currentMsgText = 'message';
    scope.ctrl.send(chatA);

    expect(chatA.currentMsgText).toBe('');

    expect(chatA.getMessages().length).toBe(1);
    expect(chatB.getMessages().length).toBe(1);

    var msg = chatB.getMessages()[0];

    expect(msg.getText()).toBe('message');
    expect(msg.getAuthor()).toBe('Chat A');
    expect(msg.isWhisper()).toBe(false);
  });
});