require '../../../../client/app/index'

describe 'CreateGameController', ->

  stubPrincipal = null
  stubGameService = null
  stubGameQueue = null
  stubTeamService = null
  stubState = null
  CreateCntrl = null
  CntrlScope = null

  beforeEach ->

    angular.mock.module 'app'

    stubPrincipal =
      getUser : ->
    stubGameService =
      init : ->
      add : ->
      all : ->
      delete : ->
      getPokerDecks : ->
    stubGameQueue =
      init : ->
      add : ->
      all : ->
      delete : ->
    stubTeamService =
      init : ->
      all : ->
    stubState =
      go : ->

    inject ($controller, $rootScope, $q) ->
      defAuth = $q.defer()
      defAuth.resolve({name: 'Bob', email: 'bob@y.com'} )
      defGames = $q.defer()
      defGames.resolve(['game1', 'game2', 'game3'])
      defGamesAdd = $q.defer()
      defGamesAdd.resolve({key:()->'~23dk34kr'})
      defQueue = $q.defer()
      defQueue.resolve(['game1Q', 'game2Q'])
      defTeam = $q.defer()
      defTeam.resolve([{name: "team1", players : ['P1', 'P2']},{name:'team2', players : ['P3', 'P4']} ])
      defJira = $q.defer()
      defJira.resolve({data : {issues: [{key : 'ENDVR-1', fields : {summary : 'Sum1'} }, {key : 'ENDVR-2', fields : {summary : 'Sum2'} } ]} } )

      sinon.stub(stubTeamService, 'all').returns(defTeam.promise)
      sinon.stub(stubPrincipal, 'getUser').returns(defAuth.promise)
      sinon.stub(stubGameService, 'all').returns(defGames.promise)
      sinon.stub(stubGameService, 'add').returns(defGamesAdd.promise)
      sinon.stub(stubGameQueue, 'all').returns(defQueue.promise)
      sinon.spy(stubGameQueue, 'add')
      sinon.spy(stubGameQueue, 'delete')
      sinon.stub(stubGameService, 'delete')
      sinon.stub(stubGameService, 'getPokerDecks').returns(['deck1', 'deck2'])
      sinon.spy(stubState, 'go')

      CntrlScope = $rootScope.$new()
      CreateCntrl = $controller('CreateGameController', {$scope : CntrlScope, $state: stubState, principalService : stubPrincipal,
      gameService : stubGameService, teamService : stubTeamService, gameQueueService : stubGameQueue} )
      CntrlScope.$apply()

  describe 'when game owner controller loads', ->
    it 'should call the authService to get user info', ->
      expect(stubPrincipal.getUser).to.have.been.calledOnce
      expect(CreateCntrl.user).to.have.been.eql({name: 'Bob', email: 'bob@y.com'} )

    it 'should load the users teams', ->
      expect(stubTeamService.all).to.have.been.calledOnce
      expect(CreateCntrl.teams.length).to.have.been.eql(2)

    it 'should set the poker decks', ->
      expect(stubGameService.getPokerDecks).to.have.been.calledOnce
      expect(CreateCntrl.decks).to.be.eql(['deck1', 'deck2'])

  describe 'when creating game', ->
    game = null
    beforeEach ->
      CreateCntrl.team = CreateCntrl.teams[0]
      game = CreateCntrl.createGame()

    it 'should set the createdOn time', ->
      expect(game.createdOn).to.not.be.null
    it 'should set priority on game obj', ->
      expect(game.$priority).eql("bob@y.com")
    it 'should set game owner to user email', ->
      expect(game.owner).eql("bob@y.com")
    it 'should save the game to firebase', ->
      expect(stubGameService.add).to.be.called
    it 'should save the game to players queues', ->
      game = CreateCntrl.createGame()
      CntrlScope.$apply()
      expect(stubGameQueue.add).to.be.called
    it 'should navigate back to game', ->
      game = CreateCntrl.createGame()
      CntrlScope.$apply()
      expect(stubState.go).to.be.calledWith('app.dashboard')
