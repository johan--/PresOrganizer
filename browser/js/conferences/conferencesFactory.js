app.factory('ConferenceFactory', function ($q, $http, AuthService) {
	return {
		getAllConferences: function () {
			return $http.get('/api/conference').then(function (res) {
				return res.data;
			});
		},
		getConferences: function(){
			//get the conferences that the user is managing
			return $http.get('/api/conference/user/me').then(function (res){
				console.log('get conferences:', res.data);
					return res.data;
				});
		},
		getConferenceById: function (id){
			//get the conferences by id
			return $http.get('/api/conference?_id=' + id).then(function (res){
					return res.data;
				});
		},
		addConferencePresenter: function (id, user_id) {
			// adds a presenter to a conference 'presenters' array
			return $http.put('/api/conference/' + id +'/addpresenter', { presenters: user_id }).then(function (res) {
				return res.data;
			}).catch(function (err) {
				console.log('error: user has not been added to a valid conference.', err);
            });  // should never error out but no problem if it does
		},
		// should this be on the presentations factory instead?
		putConferenceById: function(conference){
			//put a conference by id
			var basicInfo = {};
			basicInfo.name = conference.name;
			basicInfo.date = conference.date;
			basicInfo.venue = conference.venue;


			return $http.put('/api/conference/' + conference._id, basicInfo).then(function(res){
					return res.data;
				});
		},
		getPresentations: function(conferenceId){
			return $http.get('api/conference?_id=' + conferenceId)
				.then(function (res) {
					var presenters = res.data[0].presenters;
					var promises = presenters.map(function (presenter) {
						return $http.get('/api/presentation?presenter=' + presenter)
						.then(function (res) {
							return res.data;
						});
					});					
					return $q.all(promises).then(function (presentationArr) {
						return flatten(presentationArr);
					});
				});
		},
		convertToTimeLineItem: function (presentations) {
			return presentations.map(function (presentation) {
				return {title: 'presentation', presentation: presentation};
			});
		},
		saveTimeLine: function (conferenceId, timeLine) {

			var newTimeLineObj = timeLine.map(function (timeLineItem) {
				var newTimeLineItem = {title: timeLineItem.title};
				if(timeLineItem.presentation){
					newTimeLineItem.presentation = timeLineItem.presentation._id;

				}
				return newTimeLineItem;
			});

			//console.log(newTimeLineObj);

			return $http.put('/api/conference/'+conferenceId, {timeline: newTimeLineObj})
			.then(function(res){
				return res.data;
			});			
		},
		removeConference: function(conferenceId){
			return $http.delete('api/conference/'+conferenceId).then(function(res){
				return res.data;
			});

		},
		newConference: function(conference){

			return $http.post('/api/conference/', conference).then(function (res) {
				return res.data;
			});
		}
		// removeFromAllConfs: function (presentationIds) {
		// 	// specifically searches & removes a presentation from all conference
		// 	// timelines when that presentation has been deleted from the
		// 	// collection
  //           var promises = [];

  //           presentationIds.forEach(function (id) {
  //               promises.push($http.delete('/api/conferences/removePresentation/' + id));
  //           });
  //           return $q.all(promises).then(function (res) {
  //               return res;
  //           });
		// }
	};
});

function flatten(arr) {
  var arr2 = _.flatten(arr, true);

  return arr2.filter(function(item){
  	return item !== undefined;
  });
}