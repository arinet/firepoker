require '../../../../client/app/index'

describe 'GameService', ->

  stubFirebaseArray = null
  stubFirebaseObject = null
  GameService = null

  beforeEach ->

    angular.mock.module 'app'

    stubFirebaseArray =
      $save : ->
      $add : ->
      $remove : ->

    angular.mock.module ($provide)->
      $provide.value '$firebaseArray', stubFirebaseArray
      $provide.value '$firebaseObject', stubFirebaseObject
      return

    inject ($controller, $rootScope, $q, gameService) ->
      defAuth = $q.defer()
      defAuth.resolve({name: 'Bob', email: 'bob@y.com'} )
      GameService = gameService

  describe 'when game service is initialized loads', ->
    it 'should store the users email lowercased', ->
      GameService.init("USER.EMAIL@gmail.COM");
      expect(GameService.userEmail).to.have.be.eql("user.email@gmail.com")

    it 'should have a default pageSize of 5', ->
      expect(GameService.pageSize).to.be.eql(5)

  describe 'when getPokerDecks is called', ->
    it 'should return two poker decks', ->
      expect(GameService.getPokerDecks().length).to.have.be.eql(2)
