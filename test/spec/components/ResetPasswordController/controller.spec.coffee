require '../../../../client/app/index'

describe 'ResetPasswordController', ->

  stubAccnt = null
  spyState = null
  rstPwrdCntrl = null
  CntrlScope = null
  q = null

  beforeEach ->

    angular.mock.module 'app'

    stubAccnt =
      resetPassword : ->

    inject ($controller, $rootScope, $q)->
      q = $q

      CntrlScope = $rootScope.$new()

      rstPwrdCntrl = $controller('ResetPasswordController',
        {$scope : CntrlScope,
        accountService : stubAccnt})

  describe 'when a user request a password reset', ->

    describe 'and the request is a success', ->
      it 'should show the user a message', ->
        deffered = q.defer()
        deffered.resolve(true)
        sinon.stub(stubAccnt, 'resetPassword').returns(deffered.promise)
        rstPwrdCntrl.resetPassword()
        CntrlScope.$apply()
        expect(rstPwrdCntrl.successMessage).to.have.been.eql('You will be sent an email with instruction on resetting your password!')

    describe 'and the user login fails', ->
        it 'should show the user a failure message', ->
          deffered = q.defer()
          deffered.resolve(false)
          sinon.stub(stubAccnt, 'resetPassword').returns(deffered.promise)
          rstPwrdCntrl.resetPassword()
          CntrlScope.$apply()
          expect(rstPwrdCntrl.failMessage).to.have.been.eql('Failed to find a matching email! You are hosed!')
