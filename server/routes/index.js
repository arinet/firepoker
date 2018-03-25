var router = require('express').Router();
var path = require('path');
var api = require('./api');
var cors = require('cors');

router.use(cors());
router.use('/api/v1', api);

//Resolve all requests that don't go to /api/v1 back to the Angular router.
router.get('/*', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../../client/index.html'));
});

module.exports = router;
