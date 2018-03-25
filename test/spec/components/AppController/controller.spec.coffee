require '../../../../client/app/index'

describe 'AppController', ->

  stubPrincipal = null
  stubState = null
  AppCntrl = null
  CntrlScope = null
  q = null

  beforeEach ->

    angular.mock.module 'app'

    stubPrincipal =
      authenticate : ->
      isAuthenticated : ->
      getUser : ->

    stubState =
      go : () ->
      current :
        name : 'play.Game'

    sinon.spy(stubState, 'go');

    inject ($controller, $rootScope, $q)->
      q = $q
      deferredUser = q.defer()
      deferredUser.resolve({email:'bob@b.com'})
      sinon.stub(stubPrincipal, 'getUser').returns(deferredUser.promise);

      CntrlScope = $rootScope.$new()

      AppCntrl = $controller('AppController',
        {$scope : CntrlScope,
        principalService : stubPrincipal,
        $state : stubState})

  describe 'when app controller checks user authentication', ->
    it 'should call principal ervice for user info', ->
      sinon.stub(stubPrincipal, 'isAuthenticated').returns(true)
      result = AppCntrl.isAuthenticated()
      expect(stubPrincipal.isAuthenticated).to.be.calledOnce

    describe 'and the user is authenticated', ->
      it 'should return true', ->
        sinon.stub(stubPrincipal, 'isAuthenticated').returns(true)
        result = AppCntrl.isAuthenticated()
        expect(result).to.be.true

    describe 'and the user is not authenticated', ->
      it 'should return false', ->
        sinon.stub(stubPrincipal, 'isAuthenticated').returns(false)
        result = AppCntrl.isAuthenticated()
        expect(result).to.be.false

    describe 'when getPageClasses is called', ->
      it 'should return an array of formatted strings to match css classes', ->
        result = AppCntrl.getPageClasses()
        expect(result).to.be.eql(['play-Game'])
