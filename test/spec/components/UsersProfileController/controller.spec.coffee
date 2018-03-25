require '../../../../client/app/index'

describe 'UsersProfileController', ->
  stubPrincipal = null
  stubAccountService = null
  UserCntrl = null
  CntrlScope = null
  q = null;
  sandbox = null

  beforeEach ->

    angular.mock.module 'app'

    stubAccountService =
      changePassword : ->
      updateUserInfo : ->

    stubPrincipal =
      getUser : ->
      isAuthenticated : ->

    inject ($controller, $rootScope, $q)->
      q = $q
      defAuth = $q.defer()
      defAuth.resolve({name: 'Bob', email: 'bob@y.com', jobTitle:'Farmer'} )

      defChngPwrd = $q.defer()
      defChngPwrd.resolve(true)

      defUpdateUsr = $q.defer()
      defUpdateUsr.resolve(null)

      sandbox = sinon.sandbox.create()
      sandbox.stub(stubPrincipal, 'getUser').returns(defAuth.promise)
      sandbox.stub(stubAccountService, 'changePassword').returns(defChngPwrd.promise)
      sandbox.stub(stubAccountService, 'updateUserInfo').returns(defUpdateUsr.promise)
      sandbox.stub(stubPrincipal, 'isAuthenticated').returns({uid:'123s'})
      CntrlScope = $rootScope.$new()

      UserCntrl = $controller('UserProfileController',
        {$scope : CntrlScope, principalService : stubPrincipal,
        accountService : stubAccountService})

    CntrlScope.$apply()

  afterEach ->
    sandbox.restore()

  describe 'when the controller initializes', ->

    it 'should call the authService to get user info', ->
      expect(stubPrincipal.getUser).to.have.been.calledOnce
      expect(UserCntrl.user).to.have.been.eql({name: 'Bob', email: 'bob@y.com', jobTitle : 'Farmer'} )

    it 'should set the profileForm props to the current users info', ->
      expect(UserCntrl.profileForm.userName).to.have.been.eql('Bob')
      expect(UserCntrl.profileForm.jobTitle).to.have.been.eql('Farmer')

  describe 'when updateProfile is called', ->

    beforeEach ->
      UserCntrl.profileForm.userName = "Joe"
      UserCntrl.updateProfile()
      CntrlScope.$apply()

    it 'should use the principal service to get the users uid', ->
      expect(stubPrincipal.isAuthenticated).to.have.been.calledOnce

    it 'should call the account service to update user info', ->
      expect(stubAccountService.updateUserInfo).to.have.been.calledWith({uid: '123s',
      userName: 'Joe', jobTitle:'Farmer'})

    it 'should upon success set the successMessage on the profileForm', ->
      expect(UserCntrl.profileForm.successMessage).to.have.been.eql('Profile info updated')

    it 'should upon failure set the failMessage on the profileForm', ->
      def = q.defer()
      def.resolve("Oops!")
      stubAccountService.updateUserInfo.restore()
      sandbox.stub(stubAccountService, "updateUserInfo").returns(def.promise)
      UserCntrl.updateProfile()
      CntrlScope.$apply()
      expect(UserCntrl.profileForm.failMessage).to.have.been.eql('Failed to update profile info! Oops!')


  describe 'when updatePassword is called', ->
    beforeEach ->
      UserCntrl.passwordForm.oldPword = "Hmmm"
      UserCntrl.passwordForm.pword = "Joe1"
      UserCntrl.passwordForm.pwordConfirm = "Joe1"
      UserCntrl.updatePassword()
      CntrlScope.$apply()

    describe 'and the input passwords do not match', ->
      it 'should set the failMessage on the passwordForm', ->
        UserCntrl.passwordForm.pword = "Joe1"
        UserCntrl.passwordForm.pwordConfirm = "Joe2"
        UserCntrl.updatePassword()
        CntrlScope.$apply()
        expect(UserCntrl.passwordForm.failMessage).to.be.eql('Password does not match!')

    describe 'and the input passwords do match', ->
      it 'should call the account service to update user password', ->
        expect(stubAccountService.changePassword).to.have.been.calledWith("bob@y.com", "Hmmm", "Joe1")

      it 'should upon success set the successMessage on the passwordForm', ->
        expect(UserCntrl.passwordForm.successMessage).to.have.been.eql('Password updated')

      it 'should upon success reset the password props on the passwordForm', ->
        expect(UserCntrl.passwordForm.oldPword).to.have.been.eql('')
        expect(UserCntrl.passwordForm.pword).to.have.been.eql('')
        expect(UserCntrl.passwordForm.pwordConfirm).to.have.been.eql('')

      it 'should upon failure set the failMessage on the profileForm', ->
        def = q.defer()
        def.resolve(false)
        stubAccountService.changePassword.restore()
        sandbox.stub(stubAccountService, "changePassword").returns(def.promise)
        UserCntrl.updatePassword()
        CntrlScope.$apply()
        expect(UserCntrl.passwordForm.failMessage).to.have.been.eql('Failed to change password!')
