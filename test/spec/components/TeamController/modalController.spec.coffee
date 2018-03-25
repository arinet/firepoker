require '../../../../client/app/index'

describe 'TeamsModalController', ->

  stubTeam = null
  TeamModalCntrl = null
  CntrlScope = null

  beforeEach ->
    angular.mock.module 'app'

    stubTeam =
      name: ''
      desc: ''
      owner : ''
      $priority : ''

    inject ($controller,$rootScope)->
      CntrlScope = $rootScope.$new()
      TeamModalCntrl = $controller('TeamModalController', {team : stubTeam})
      CntrlScope.$apply()

  describe 'when team modalController loads', ->
    it 'should intialize with a team', ->
      expect(TeamModalCntrl.team).to.not.be.null

  describe 'when adding a player to a team', ->
    beforeEach ->
      TeamModalCntrl.player.name = 'Bob Johnson'
      TeamModalCntrl.player.email = "BoB@Johnson.com"
      TeamModalCntrl.addPlayer()
    it 'should add player to teams players', ->
      expect(TeamModalCntrl.team.players.length).to.be.eql(1)
    it 'should make players email address all lower-case', ->
      expect(TeamModalCntrl.team.players[0].email).to.be.eql("bob@johnson.com")
    it 'should clear the player object', ->
      expect(TeamModalCntrl.player).to.be.eql({name: "", email: ""})

  describe 'when removing a player', ->
    beforeEach ->
      TeamModalCntrl.player.name = 'Bob Johnson'
      TeamModalCntrl.player.email = "BoB@Johnson.com"
      TeamModalCntrl.addPlayer()
    it 'should removed player from team players', ->
      TeamModalCntrl.deletePlayer()
      expect(TeamModalCntrl.team.players.length).to.be.eql(0)
