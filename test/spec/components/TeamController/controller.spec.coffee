require '../../../../client/app/index'

describe 'TeamsController', ->

  stubPrincipal = null
  stubTeam = null
  stubModal = null
  fakeModal = null
  TeamsCntrl = null
  CntrlScope = null

  beforeEach ->
    angular.mock.module 'app'
    stubPrincipal =
      getUser : ->

    stubTeam =
      init : ->
      add : ->
      all : ->
      delete : ->
      save : ->

    stubModal =
      open : ->
      result : ->

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
      defAdd = $q.defer()
      defAdd.resolve({teams : ['Team1', 'Team2', 'Team3']})

      sinon.stub(stubPrincipal, 'getUser').returns(defAuth.promise)
      sinon.stub(stubTeam, 'all').returns(defAdd.promise)
      sinon.stub(stubTeam, 'add')
      sinon.stub(stubTeam, 'delete')
      sinon.stub(stubTeam, 'save')
      sinon.stub(stubModal, 'open').returns(fakeModal)

      CntrlScope = $rootScope.$new()
      TeamsCntrl = $controller('TeamsController', {$scope : CntrlScope, principalService : stubPrincipal, teamService : stubTeam, $modal : stubModal})
      CntrlScope.$apply()

  describe 'when team controller loads', ->
    it 'should call the authService to get user info', ->
      expect(stubPrincipal.getUser).to.have.been.calledOnce
      expect(TeamsCntrl.user).to.have.been.eql({name: 'Bob', email: 'bob@y.com'})
    it 'should load all user teams they have created', ->
      expect(TeamsCntrl.teams).to.have.been.eql({teams : ['Team1', 'Team2', 'Team3']})

  describe 'when a user choses to add a team', ->
    beforeEach ->
      TeamsCntrl.add()
      CntrlScope.$apply()
    it 'should call the $modal service opening an edit window', ->
      expect(stubModal.open).to.have.been.calledOnce
    it 'should pass a team object with user email as firebase priority', ->
      teamObj =
        name: ''
        desc: ''
        owner: 'bob@y.com'
        $priority :'bob@y.com'
      fakeModal.close(teamObj)
      expect(stubTeam.add).to.have.been.calledWithMatch(teamObj)
    it 'should call the team service to add the team when modal is closed', ->
      fakeModal.close()
      expect(stubTeam.add).to.have.been.calledOnce

  describe 'when a user choses to edit a team', ->
    it 'should call the $modal service opening an edit window', ->
      TeamsCntrl.edit()
      CntrlScope.$apply()
      expect(stubModal.open).to.have.been.calledOnce
    it 'should call the team service to save the team when modal is closed', ->
      TeamsCntrl.edit()
      fakeModal.close()
      expect(stubTeam.save).to.have.been.calledOnce
  describe 'when a user choses to delete a team', ->
    it 'should call the team service to delete the team', ->
      TeamsCntrl.delete()
      expect(stubTeam.delete).to.have.been.calledOnce
