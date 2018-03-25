require '../../../../client/app/index'

describe 'PlayGameController', ->

  stubPrincipal = null
  stubGameService = null
  stubGameQueue = null
  stubJiraApi = null
  stubState = null
  game = null
  teamW = null
  sandbox = null

  PlayCntrl = null
  CntrlScope = null

  beforeEach ->

    angular.mock.module 'app'

    teamW =
      desc : 'Test Team'
      name : 'Team for Testing'
      owner : 'don.w@ari.com'
      players : [{email : 'don.w@ari.com', name : 'Don W.'}, {email : 'bob@y.com', name : 'Bob W.'}]

    jiraStory1 =
      href : 'http://www.google.com'
      players : [{email : 'don.w@ari.com', name : 'Don W.'}, {email : 'bob@y.com', name : 'Bob W.'}]
      status : 'Queue'
      title : 'Story 1'
      jiraKey : 'ENDVR-1'

    jiraStory2 =
      href : 'http://www.google.com'
      players : [{email : 'don.w@ari.com', name : 'Don W.'}, {email : 'bob@y.com', name : 'Bob W.'}]
      status : 'Queue'
      title : 'Story 1'

    game =
      $id : '123'
      deck: '1'
      name: 'Test Game'
      owner : 'bob@y.com'
      status : 'Queue'
      stories : [jiraStory1, jiraStory2]
      team : teamW

    stubPrincipal =
      getUser : ->
    stubGameService =
      init : ->
      getPokerDecks : ->
      get : ->
      save : ->
    stubGameQueue =
      init : ->
      all : ->
      delete : ->
      save : ->
    stubJiraApi =
      putStoryPoints : ->
    stubState =
      go : ->
      params :
        gid : '139dsaDrs'

    inject ($controller, $rootScope, $q) ->
      defAuth = $q.defer()
      defAuth.resolve({name: 'Bob', email: 'bob@y.com'} )
      defGame = $q.defer()
      defGame.resolve(game)
      defQueue = $q.defer()
      defQueue.resolve([{gameId: game.$id, status:'Queue', name : game.name, player : 'bob@y.com'}])
      defJira = $q.defer()
      defJira.resolve({data : {issues: [{key : 'ENDVR-1', fields : {summary : 'Sum1'} }, {key : 'ENDVR-2', fields : {summary : 'Sum2'} } ]} } )

      sandbox = sinon.sandbox.create()
      sandbox.spy(stubJiraApi, 'putStoryPoints')
      sandbox.stub(stubPrincipal, 'getUser').returns(defAuth.promise)
      sandbox.stub(stubGameQueue, 'all').returns(defQueue.promise)
      sandbox.spy(stubGameQueue, 'save')
      sandbox.spy(stubGameQueue, 'delete')
      sandbox.stub(stubGameService, 'get').returns(defGame.promise)
      sandbox.stub(stubGameService, 'getPokerDecks').returns([[0, 1, 2, 4, 8, 16, 32, 64, 128, '?'], [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?']])
      sandbox.spy(stubGameService, 'save')
      sandbox.spy(stubState, 'go')


      CntrlScope = $rootScope.$new()
      PlayCntrl = $controller('PlayGameController', {$scope : CntrlScope,
      $state: stubState, principalService : stubPrincipal, gameService : stubGameService,
      gameQueueService : stubGameQueue, jiraRestService : stubJiraApi} )

      sandbox.spy(PlayCntrl, 'refreshGame')
      CntrlScope.$apply()

  afterEach ->
    sandbox.restore()

  describe 'when game owner controller loads', ->

    it 'should call the authService to get user info', ->
      expect(stubPrincipal.getUser).to.have.been.calledOnce
      expect(PlayCntrl.user).to.have.been.eql({name: 'Bob', email: 'bob@y.com'} )

    it 'should load the game', ->
      expect(stubGameService.get).to.have.been.calledOnce
      expect(PlayCntrl.game).to.be.eql(game)

    it 'should set the poker decks', ->
      expect(stubGameService.getPokerDecks).to.have.been.calledOnce
      expect(PlayCntrl.decks).to.be.eql(stubGameService.getPokerDecks())

    describe 'and the game owner matches the current users email', ->
      it 'should set the isOwner flag to true', ->
        PlayCntrl.game.owner = 'bob@y.com'
        expect(PlayCntrl.isOwner).to.be.eql(true)

    describe 'and the game owner does not match the current users email', ->
      it 'should set the isOwner flag to false', ->
        PlayCntrl.game.owner = 'bobberta@y.com'
        expect(PlayCntrl.isOwner).to.be.eql(true)

    describe 'when a story is set as the active story', ->
      beforeEach ->
          PlayCntrl.setActiveStory(0)
      it 'should set the view models activeStory prop', ->
        expect(PlayCntrl.activeStory).to.be.eql(game.stories[0])
      it 'should refresh the game ui', ->
        expect(PlayCntrl.refreshGame).to.have.been.called

    describe 'when a story is estimated', ->
      beforeEach ->
        PlayCntrl.setActiveStory(0)
        PlayCntrl.estimate(8)
      it 'should set the current players estimate on the story', ->
        expect(PlayCntrl.activeStoryPlayer.estimate).to.be.eql(8)
      it 'should set the current players played status to played', ->
        expect(PlayCntrl.activeStoryPlayer.played).to.be.true
      it 'should update the stories modal average estimate', ->
        expect(PlayCntrl.activeStory.avgEstimate).to.be.eql(0)
      it 'should save the game back to firebase', ->
        expect(stubGameService.save).to.have.been.calledOnce
      it 'should refresh the game ui', ->
        expect(PlayCntrl.refreshGame).to.have.been.called

    describe 'when a story is commented on', ->
      beforeEach ->
        PlayCntrl.setActiveStory(0)
        PlayCntrl.addComment('Yo!')
      it 'should add a comment object to the current story', ->
        expect(PlayCntrl.activeStory.comments.length).to.be.eql(1)
        expect(PlayCntrl.activeStory.comments[0].name).to.be.eql('Bob')
        expect(PlayCntrl.activeStory.comments[0].comment).to.be.eql('Yo!')
        expect(PlayCntrl.activeStory.comments[0].email).to.be.eql('bob@y.com')
      it 'should save the game back to firebase', ->
        expect(stubGameService.save).to.have.been.calledOnce
      it 'should clear the user comment prop', ->
        expect(PlayCntrl.userComment).to.be.eql('')

    describe 'when a story is accepted', ->
      beforeEach ->
          PlayCntrl.isOwner = true;
          PlayCntrl.setActiveStory(0)
          PlayCntrl.estimate(8)
          PlayCntrl.acceptStory()

      it 'should allow user to accept if they are game owners', ->
        expect(PlayCntrl.activeStory.accepted).to.be.eql(true)
      it 'should save the game back to firebase', ->
        expect(stubGameService.save).to.have.been.calledTwice #Once for estimate, once for accept
      it 'should set showCards to true for active story', ->
        expect(PlayCntrl.showCards).to.be.true
      it 'should refresh the game ui', ->
        expect(PlayCntrl.refreshGame).to.have.been.called

    describe 'when a game is being played', ->
      beforeEach ->
        PlayCntrl.isOwner = true;
        PlayCntrl.setActiveStory(0)
        PlayCntrl.estimate(8)
        PlayCntrl.acceptStory()
        CntrlScope.$apply()

      describe 'and a player plays some of the stories', ->
        it 'should set game que status to partially play', ->
          expect(stubGameQueue.save).to.have.been.calledWith({gameId: game.$id, status:'Partially Played', name : game.name, player : 'bob@y.com'})

      describe 'and a player plays all the stories', ->
        it 'should set game que status to finished play', ->
          PlayCntrl.setActiveStory(1)
          PlayCntrl.estimate(8)
          PlayCntrl.acceptStory()
          CntrlScope.$apply()
          expect(stubGameQueue.save).to.have.been.calledWith({gameId: game.$id, status:'Finished Play', name : game.name, player : 'bob@y.com'})

      describe 'and all players have played all the stories', ->
        it 'should set game status to Played', ->
          game.stories[0].players[0].played = true
          game.stories[0].players[1].played = true
          game.stories[1].players[0].played = true
          game.stories[1].players[1].played = true
          PlayCntrl.acceptStory() #Used here to trigger refresh logic...
          CntrlScope.$apply()
          expect(PlayCntrl.game.status).to.be.eql('Played')

    describe 'when a game is accepted', ->
      beforeEach ->
          PlayCntrl.isOwner = true;
          PlayCntrl.setActiveStory(0)
          PlayCntrl.estimate(8)
          PlayCntrl.acceptStory()
          PlayCntrl.setActiveStory(1)
          PlayCntrl.estimate(8)
          PlayCntrl.acceptStory()
          PlayCntrl.acceptGame()

      it 'should allow user to accept game if they are game owners', ->
        expect(PlayCntrl.game.status).to.be.eql('Accepted')

      it 'should set the endedAt time', ->
        expect(PlayCntrl.game.endedAt).to.not.be.null
        expect(PlayCntrl.game.endedAt).to.not.be.undefined
        expect(PlayCntrl.game.endedAt).to.not.be.a('object')

      it 'should save each stories points back to jira', ->
        expect(stubJiraApi.putStoryPoints).to.have.callCount(1) #Only have 1 Jira story as a mock in this test...

      it 'should save the game back to firebase', ->
        expect(stubGameService.save).to.have.been.called

      it 'should remove the game from the players queue', ->
        expect(stubGameQueue.delete).to.have.been.calledWith(PlayCntrl.game)

      it 'should navigate back to the dashboard', ->
        expect(stubState.go).to.have.been.calledWith('app.dashboard')
