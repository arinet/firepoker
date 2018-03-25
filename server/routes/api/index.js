var router = require('express').Router();
var rp = require('request-promise');
var config = require('../../config/server.json');

router.get('/search', function(req, res) {
    var opts = {
        url : config.jiraRestUrl +"/search",
	      method : 'GET',
        qs : req.query
    };
    sendRequest(opts, res);
});

router.route('/issue/:storyId')
	.get(function(req, res) {
		var opts = {
			url : config.jiraRestUrl +"/issue/" + req.params.storyId,
			method : 'GET',
			qs : req.query
		};
		sendRequest(opts,res);
	})
	.put(function(req,res){
		var opts = {
			url : config.jiraRestUrl +"/issue/" + req.params.storyId,
			method : 'PUT',
			json : req.body
		};
		sendRequest(opts, res);
	});

function sendRequest(opts, res){
	rp(opts).auth(config.user, config.pwrd).then(function(response){
		res.send(response);
	}).catch(function(response){
		res.send(response.message);
	});

}

module.exports = router;