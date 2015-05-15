app.controller('ConferencesCtrl',function($q, $scope, ConferenceFactory){
	 $scope.showConferences = false;
     $scope.timeLine = [];

     $scope.controlItems = [{title:'pause'},{title:'loopStart'},{title:'loopEnd'}];
            
    ConferenceFactory.getConferences().then(function(conferences){
        $scope.conferences = conferences;
		
    });
    $scope.controlItemOptions = {

        //restrict move across columns. move only within column.
        /*accept: function (sourceItemHandleScope, destSortableScope) {
         return sourceItemHandleScope.itemScope.sortableScope.$id !== destSortableScope.$id;
         },*/
        dragStart: function(event){

        },
        itemMoved: function (event) {
            $scope.controlItems = [{title:'pause'},{title:'loopStart'},{title:'loopEnd'}];
          
        },
        orderChanged: function (event) {
            
        },
        accept: function (sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        },
        containment: '#board'
    };

    $scope.conferenceOptions = {
        accept: function (sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        }

    };


    $scope.saveTimeLine = function(){
        ConferenceFactory.saveTimeLine($scope.conferenceId, $scope.timeLine);
    };

    $scope.removeCard = function(index){
        //console.log("deleting card at",$scope.timeLine[index]);

        if($scope.timeLine[index].title==='presentation'){
            $scope.conferencePresentations.push($scope.timeLine[index]);
        }
        $scope.timeLine.splice(index,1);
    };

    $scope.setConference = function(id, $index){
        $scope.timeLine = _.find($scope.conferences, {_id: id}).timeline;
        $scope.conferenceId = id;
        $scope.currentPresentationTitle = $scope.conferences[$index].name;
    	ConferenceFactory.getPresentations(id).then(function(presentations){	
            //initailize variable for presentations that can be added to the timeline
            //remove possible conference presentations if they are already existing in the timeline
            $scope.conferencePresentations = removeExistingTimeLineItems(presentations, $scope.timeLine);

            //convert these into same format as the TimeLineItems
            $scope.conferencePresentations = ConferenceFactory.convertToTimeLineItem($scope.conferencePresentations);


    	});
    	
    };

});

function removeExistingTimeLineItems(presentations, timeLine){
    // console.log("PRESENTATIONS");
    // presentations.forEach(function(presentation){console.log(presentation.title)});
    // console.log("TIMELINE");
    // timeLine.forEach(function(timeLine){if(timeLine.presentation)console.log(timeLine.presentation.title)});
    return _.remove(presentations, function(presentation){

        //get the index if the presentation is in the timeLine Item
           var index =  _.findIndex(timeLine, function(timeLineItem){
            if(timeLineItem.presentation)
                return timeLineItem.presentation._id === presentation._id;
            });
           //if the timeline item is not in presentation return true and have it deleted from array
            return index === -1;
        });
}

function flatten(arr) {
  var arr2 = _.flatten(arr, true);

  return arr2.filter(function(item){
  	return item !== undefined;
    		
    	});
}