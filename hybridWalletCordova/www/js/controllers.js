angular.module('app.controllers', [])

.controller('CardsCtrl', function($scope, cardService, $ionicModal) {
  document.addEventListener('serverConnected', initComplete, false);

  $scope.user = {};
  $scope.errorText = '';
  $scope.displayError = false;

  $scope.loadCards = function () {
    console.log('---> called loadCards');
      var DataRequest = cardService.requestCards();

      DataRequest.then(function(result){
        $scope.cards = result.cards;
        console.log('---> Cards loaded ', $scope.cards);
        $scope.$apply();
      })
  };

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };


  function initComplete() {
    console.log('---> WL init completed');

    var AuthRealmChallengeHandler = WL.Client.createChallengeHandler("AuthRealm");

    AuthRealmChallengeHandler.isCustomResponse = function(response) {
    	if (!response || !response.responseJSON	|| response.responseText === null) {
    		return false;
    	}
    	if (typeof(response.responseJSON.authStatus) !== 'undefined'){
    		return true;
    	} else {
    		return false;
    	}
    };

    AuthRealmChallengeHandler.handleChallenge = function(response){
    	var authStatus = response.responseJSON.authStatus;

    	if (authStatus == "credentialsRequired"){
        $scope.openModal();
        console.log('---> authStatus ', authStatus);

    		if (response.responseJSON.errorMessage) {
            console.log('---> auth error ', response.responseJSON.errorMessage);
    	    	$scope.errorText = response.responseJSON.errorMessage;
            $scope.displayError = true;
            $scope.$apply();
          }
    	} else if (authStatus == "complete"){
        console.log('---> authStatus ', authStatus);
        $scope.user = {};
        $scope.errorText = '';
        $scope.displayError = false;
        $scope.closeModal();
    		AuthRealmChallengeHandler.submitSuccess();
    	}
    };


    $scope.doLogin = function () {
      console.log('---> trying to perform auth with user ', $scope.user.name);
    	var invocationData = {
    		adapter : "AuthAdapter",
    		procedure : "submitAuthentication",
    		parameters : [ $scope.user.name, $scope.user.password ]
    	};

    	AuthRealmChallengeHandler.submitAdapterAuthentication(invocationData, {});
    };


    $scope.loadCards();
  };

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SettingsCtrl', function($scope) {

})

.controller('TabsCtrl', function($scope, $ionicActionSheet) {
    $scope.showSettings = function() {

     // Show the action sheet
     var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: '<b>Share</b> This' },
         { text: 'Move' }
       ],
       destructiveText: 'Delete',
       titleText: 'Modify your album',
       cancelText: 'Logout',
       cancel: function() {
            console.log('---> trying to logout ');
            WL.Client.logout('AuthRealm');
          },
       buttonClicked: function(index) {
         return true;
       }
     });
   };
});
