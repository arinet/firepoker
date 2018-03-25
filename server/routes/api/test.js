var router = require('express').Router();

router.get('/test', function(req, res) {
  res.json([
    { test: 'things' },
    { test: 'stuff' },
    { test: 'foobar' },
  ])
});

router.get('/:id', function(req, res) {
  res.json({ test: 'things' })
});

module.exports = router;