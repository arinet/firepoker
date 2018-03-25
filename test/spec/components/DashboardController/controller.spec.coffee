require '../../../../client/app/index'

describe 'DashboardController', ->

  stubPrincipal = null
  stubGameService = null
  stubGameQueue = null
  stubModal = null
  DashboardCntrl = null
  CntrlScope = null
  fakeModal = null

  beforeEach ->

    angular.mock.module 'app'

    stubPrincipal =
      getUser : ->
    stubGameService =
      init : ->
      getPagedData : ->
      fetchByDate : ->
      delete : ->
      save : ->
    stubGameQueue =
      init : ->
      all : ->
      delete : ->
      updateStatus : ->
    stubModal =
      open : ->

    fakeModal =
      result: then: (confirmCallback, cancelCallback) ->
        #Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
        @confirmCallBack = confirmCallback
        @cancelCallback = cancelCallback
        return
      close: (item) ->
        #The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
        @result.confirmCallBack item
        return
      dismiss: (type) ->
        #The user clicked cancel on the modal dialog, call the stored cancel callback
        @result.cancelCallback type
        return

    inject ($controller, $rootScope, $q)->
      defAuth = $q.defer()
      defAuth.resolve({name: 'Bob', email: 'bob@y.com'})
      defGames = $q.defer()
      defGames.resolve(['game1', 'game2', 'game3'])
      defQueue = $q.defer()
      defQueue.resolve(['game1Q', 'game2Q'])

      sinon.stub(stubPrincipal, 'getUser').returns(defAuth.promise)
      sinon.stub(stubGameService, 'getPagedData').returns(defGames.promise)
      sinon.stub(stubGameService, 'fetchByDate').returns(defGames.promise)
      sinon.stub(stubGameService, 'delete')
      sinon.spy(stubGameService, 'save')
      sinon.spy(stubGameQueue, 'updateStatus')
      sinon.stub(stubGameQueue, 'all').returns(defQueue.promise)
      sinon.spy(stubGameQueue, 'delete')
      sinon.stub(stubModal, 'open').returns(fakeModal)

      CntrlScope = $rootScope.$new()
      DashboardCntrl = $controller('DashboardController', {$scope : CntrlScope, principalService : stubPrincipal, gameService : stubGameService, gameQueueService : stubGameQueue, $modal: stubModal})
      CntrlScope.$apply()

  describe 'when game owner controller loads', ->
    it 'should call the authService to get user info', ->
      expect(stubPrincipal.getUser).to.have.been.calledOnce
      expect(DashboardCntrl.user).to.have.been.eql({name: 'Bob', email: 'bob@y.com'})

    it 'should load the users games they have created', ->
      expect(stubGameService.getPagedData).to.have.been.calledOnce
      expect(DashboardCntrl.games).to.have.been.eql(['game1', 'game2', 'game3'])

    it 'should load the users game queue', ->
      expect(stubGameQueue.all).to.have.been.calledOnce
      expect(DashboardCntrl.gameQueue).to.have.been.eql(['game1Q', 'game2Q'])

  describe 'when user loads more games', ->
    beforeEach ->
      DashboardCntrl.getPagedData()
      CntrlScope.$apply()
    it 'should call into gameService and more paged data', ->
      expect(stubGameService.getPagedData).to.have.been.called
      
  describe 'when user wants to get games in a date range', ->
    beforeEach ->
      DashboardCntrl.fetchByDate()
      CntrlScope.$apply()
    it 'should call into gameService and get games by date', ->
      expect(stubGameService.fetchByDate).to.have.been.calledOnce

  describe 'when a user choses to modify stories', ->
    game = null
    beforeEach ->
      game = {name : 'Game 1'}
      DashboardCntrl.addStories(game)
      CntrlScope.$apply()
    it 'should call the $modal service opening an edit window', ->
      expect(stubModal.open).to.have.been.calledOnce
    it 'should call the game service to save changes to game', ->
      fakeModal.close()
      expect(stubGameService.save).to.have.been.calledOnce
    it 'should call the game queue to save changes to queue', ->
      fakeModal.close()
      expect(stubGameQueue.updateStatus).to.have.been.calledOnce

  describe 'when a user deletes a game they have created', ->
    it 'should call the gameQueue and delete game from player queues', ->
        DashboardCntrl.delete({gameId:'12lkjd34'})
        expect(stubGameQueue.delete).to.have.been.calledOnce
    it 'should call the gameService to delete game', ->
        DashboardCntrl.delete({gameId:'12lkjd34'})
        expect(stubGameService.delete).to.have.been.calledOnce
