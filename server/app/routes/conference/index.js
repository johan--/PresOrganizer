var router = require('express').Router();
var mongoose = require('mongoose');
var Conference = mongoose.model('Conference');
//var Promise = require('bluebird');
//require('../../../../server/db/models/conference');
//var Conference = Promise.promisifyAll(mongoose.model('Conference'));
////////////////////////////////////////////////////////////////////
// CREATE
// Create a conference
router.post('/',function(req, res, next){
	Conference.create(req.body, function (err, conference){
		if (err) return next(err);

		res.send(conference);
	});
});
////////////////////////////////////////////////////////////////////
// READ
// find by queries
router.get('/', function(req, res, next){
	Conference.find(req.query)
	.populate('presenters', 'name _id')
	.populate('locale')
	//.populate('locale.organizers')
	.exec()
	.then(function (conferences){
		console.log('populated:', conferences);
		res.send(conferences);
	})
	.then(null, function(err){
		return next(err);
	});
});
////////////////////////////////////////////////////////////////////
// UPDATE
// update by conference Id
router.put('/:conferenceId', function(req, res, next){
	var conferenceId = req.params.conferenceId;   // locale is an Id

	Conference.findByIdAndUpdate( conferenceId, req.body, function(err, conference){
		if(err) return next(err);

		res.send(conference);
	});
});
////////////////////////////////////////////////////////////////////
// DELETE
// delete a conference
router.delete('/:id',function(req, res, next) {
	Conference.findByIdAndRemove(req.params.id, function (err, conference) {
		if (err) return next(err);
		res.send(conference);
	});
});

module.exports = router;