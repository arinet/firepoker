require '../../../../client/app/index'

describe 'LoginController', ->

  stubAccountService = null
  stubLogin = null
  spyState = null
  LoginCntrl = null
  CntrlScope = null
  q = null;

  beforeEach ->

    angular.mock.module 'app'

    stubLogin =
      loginUser : ->

    spyState =
      go : () ->

    stubAccountService =
      createNewUser : ->

    sinon.spy(spyState, 'go');

    inject ($controller, $rootScope, $q)->
      q = $q

      CntrlScope = $rootScope.$new()

      LoginCntrl = $controller('LoginController',
        {$scope : CntrlScope,
        loginService : stubLogin,
        accountService : stubAccountService,
        $state : spyState})

  describe 'when a game owner attempts to login', ->

    describe 'and the user login succeeds', ->
      it 'should redirect the user to the game owners page', ->
        deffered = q.defer()
        deffered.resolve({ auth : uid : 23})
        sinon.stub(stubLogin, 'loginUser').returns(deffered.promise)
        LoginCntrl.login()
        CntrlScope.$apply()
        expect(spyState.go).to.have.been.calledWithMatch('app.dashboard',  {reload:true})

    describe 'and the user login fails', ->
        it 'should show the user a failure message', ->
          deffered = q.defer()
          deffered.resolve(false)
          sinon.stub(stubLogin, 'loginUser').returns(deffered.promise)
          LoginCntrl.login()
          CntrlScope.$apply()
          expect(LoginCntrl.loginForm.message).to.have.been.eql('Login failed!  Email or password is incorrect, or account	does not exist')

    #Account Creation
    describe 'when a user attemps to create a new account', ->
      describe 'and the user email addresses do not match', ->
        it 'should show a validation message', ->
          LoginCntrl.registerForm.email = "bob@bob.com"
          LoginCntrl.registerForm.emailConfirm = "bo@bob.com"
          LoginCntrl.createAccount()
          expect(LoginCntrl.registerForm.failMessage).to.be.eql('Email addresses do not match!')

      describe 'and the user passwords do not match', ->
        it 'should show a validation message', ->
          LoginCntrl.registerForm.pword = "yo"
          LoginCntrl.registerForm.pwordConfirm = "yNo"
          LoginCntrl.createAccount()
          expect(LoginCntrl.registerForm.failMessage).to.be.eql('Password does not match!')

      describe 'and the user name and password are valid', ->
        beforeEach ->
          LoginCntrl.registerForm.userName = 'Bob'
          LoginCntrl.registerForm.email = "bob@bob.com"
          LoginCntrl.registerForm.emailConfirm = "bob@bob.com"
          LoginCntrl.registerForm.pword = "yo"
          LoginCntrl.registerForm.pwordConfirm = "yo"

        describe 'and account creation is success', ->

          beforeEach ->
            deffered = q.defer()
            deffered.resolve({ auth : uid : 23})
            sinon.stub(stubLogin, 'loginUser').returns(deffered.promise)

            deferredAcnt = q.defer()
            deferredAcnt.resolve({uid :'1'})
            sinon.stub(stubAccountService, 'createNewUser').returns(deferredAcnt.promise)

          it 'should create a new account', ->
            LoginCntrl.createAccount()
            CntrlScope.$apply()
            expect(stubAccountService.createNewUser).to.have.be.calledWith(LoginCntrl.registerForm.email, LoginCntrl.registerForm.pword, LoginCntrl.registerForm.userName)

          it 'should log user in', ->
            LoginCntrl.createAccount()
            CntrlScope.$apply()
            expect(stubLogin.loginUser).to.have.been.called

        describe 'and account creation is failure', ->
          it 'should show an error message to the user', ->
            deferred = q.defer()
            deferred.resolve({message: 'Email account is taken.'})
            sinon.stub(stubAccountService, 'createNewUser').returns(deferred.promise)
            LoginCntrl.createAccount()
            CntrlScope.$apply()
            expect(LoginCntrl.registerForm.failMessage).to.have.been.eql('Failed to create account! Email account is taken.')
