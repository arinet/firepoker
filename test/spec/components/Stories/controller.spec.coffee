require '../../../../client/app/index'

describe 'StoriesController', ->

  stubJiraService = null
  StoriesCntrl = null
  CntrlScope = null
  team = null
  stories = null
  q = null
  sandbox = null

  beforeEach ->
    angular.mock.module 'app'

    sandbox = sinon.sandbox.create()

    stubJiraService =
      get : ->

    stories = []
    team = {name: "team1", players : ['P1', 'P2']}

    inject ($controller, $rootScope, $q) ->
      q = $q
      defJira = $q.defer()
      defJira.resolve({data : {issues: [{key : 'ENDVR-1', fields : {summary : 'Sum1'} }, {key : 'ENDVR-2', fields : {summary : 'Sum2'} } ]} } )
      sandbox.stub(stubJiraService, 'get').returns(defJira.promise)
      CntrlScope = $rootScope.$new()
      StoriesCntrl = $controller('StoriesController', {$scope : CntrlScope, team: team, stories : stories, jiraRestService : stubJiraService} )
      CntrlScope.$apply()

    afterEach ->
      sandbox.restore()

  describe 'when stories controller loads', ->
    it 'should have a resolved team', ->
      expect(StoriesCntrl.team).to.have.been.eql(team)

    it 'should have a resolved set of stories', ->
      expect(StoriesCntrl.stories.length).to.have.been.eql(0)

  describe 'when loading jira stories', ->
    beforeEach ->
      StoriesCntrl.loadJiraStories()
      CntrlScope.$apply()
    it 'should call jira service for stories', ->
      expect(stubJiraService.get).to.have.been.calledOnce
      expect(StoriesCntrl.stories.length).to.be.eql(2)
    it 'should create story objects with an href', ->
      expect(StoriesCntrl.stories[0].href).to.be.eql('https://arinet.atlassian.net/browse/ENDVR-1')
    it 'should create story objects with defined jiraKey', ->
      expect(StoriesCntrl.stories[0].jiraKey).to.be.eql('ENDVR-1')
    it 'should create story objects with status of Queue', ->
      expect(StoriesCntrl.stories[0].accepted).to.be.eql(false)
    it 'should create story objects with title', ->
      expect(StoriesCntrl.stories[0].title).to.be.eql('Sum1')
    it 'should add team players to each story', ->
      expect(StoriesCntrl.stories[0].players).to.be.eql(['P1', 'P2'])

    describe 'when there is an error', ->
      it 'should load the errorMsg property', ->
          defJiraError = q.defer()
          defJiraError.resolve({data : 'HUGE FREAKIN ERROR'} )
          sandbox.restore()
          sandbox.stub(stubJiraService, 'get').returns(defJiraError.promise)
          StoriesCntrl.loadJiraStories()
          CntrlScope.$apply()
          expect(StoriesCntrl.errorMsg).to.be.eql('HUGE FREAKIN ERROR')
          expect(StoriesCntrl.errorMsg).to.not.be.eql('')

  describe 'when adding a structured story', ->
    beforeEach ->
      StoriesCntrl.structuredStory.asA= 'Monkey'
      StoriesCntrl.structuredStory.iWouldLikeTo = 'Fling Poo!'
      StoriesCntrl.structuredStory.soThat = 'People love me!'
      StoriesCntrl.structuredStory.notes = 'Yip Notes'
      StoriesCntrl.addStructuredStory()
    it 'should create a free form story obj', ->
      expect(StoriesCntrl.stories[0].title).to.be.eql('As a/an Monkey I would like to Fling Poo! so that People love me!')
      expect(StoriesCntrl.stories[0].notes).to.be.eql('Yip Notes')
      expect(StoriesCntrl.stories[0].accepted).to.be.eql(false)
    it 'should add team players to each story', ->
      expect(StoriesCntrl.stories[0].players).to.be.eql(['P1', 'P2'])

  describe 'when adding free form story', ->
    beforeEach ->
      StoriesCntrl.freeFormStory.title = 'I is free'
      StoriesCntrl.freeFormStory.notes = 'Yip Note'
      StoriesCntrl.addFreeFormStory()
    it 'should create a free form story obj', ->
      expect(StoriesCntrl.stories[0].title).to.be.eql('I is free')
      expect(StoriesCntrl.stories[0].notes).to.be.eql('Yip Note')
      expect(StoriesCntrl.stories[0].accepted).to.be.eql(false)
    it 'should add team players to each story', ->
      expect(StoriesCntrl.stories[0].players).to.be.eql(['P1', 'P2'])

  describe 'when the story created from a bulk load', ->
    beforeEach ->
      StoriesCntrl.bulkLoadStories = 'Story1\nStory2'
      StoriesCntrl.addBulkLoadStories()
    it 'should create story objects with accepted false', ->
      expect(StoriesCntrl.stories[0].accepted).to.be.eql(false)
    it 'should create story objects with title', ->
      expect(StoriesCntrl.stories[0].title).to.be.eql('Story1')
    it 'should add team players to each story', ->
      expect(StoriesCntrl.stories[0].players).to.be.eql(['P1', 'P2'])

  describe 'when the story is deleted', ->
    beforeEach ->
      StoriesCntrl.stories = [{'Mock Story'}]
    it 'should remove the story from the array', ->
      StoriesCntrl.deleteStory(0)
      expect(StoriesCntrl.stories.length).to.be.eql(0)
