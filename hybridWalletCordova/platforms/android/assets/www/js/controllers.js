angular.module('app.controllers', [])

.controller('CardsCtrl', function($scope, cardService, $ionicModal) {
  document.addEventListener('serverConnected', initComplete, false);

  $scope.user = {};
  $scope.cardsImages = [];
  $scope.errorText = '';
  $scope.displayError = false;
  $scope.cardIndex = {};
  $scope.cardIndex.id = 1;
  $scope.cardTransactions = {};
  $scope.currentTransactions = {};

  $scope.loadCards = function () {
    console.log('---> called loadCards');
      var DataRequest = cardService.requestCards();

      DataRequest.then(function(result){
        $scope.cards = result.cards;
        var i = 0;
        var n = $scope.cards.length;
        console.log('---> Cards loaded ', $scope.cards);
        angular.forEach($scope.cards, function(value, key) {
          var canvas = document.getElementById("cardCanvas");
          var context = canvas.getContext("2d");
          var imageObj = new Image();
          imageObj.src = "img/card.png";
          imageObj.onload = function() {
            context.drawImage(imageObj, 10, 10);
            context.font = "1.1em Courier New";
            context.fillStyle = "white";
            context.fillText(value.cn, 37, 110);
            context.font = "0.6em Courier New";
            context.fillText(value.name, 37, 137);
            context.fillText(value.date, 133, 137);
            $scope.currentImg = canvas.toDataURL();
            $scope.cardsImages.push({id: value.id, img: $scope.currentImg});
            imageObj = [];
            i++;
            if (i == n) {
              $scope.$watch("cardIndex.id", function() {
                $scope.loadTransactions($scope.cardIndex.id);
              })
              $scope.loadTransactions($scope.cardIndex.id);
            }
          };
        });
      })
  };

  $scope.loadTransactions = function(cindex) {
    console.log('---> called loadTransactions for index ', cindex);

    var cardId = $scope.cards[cindex].id;

    console.log('---> card id is ', cardId);

    if (typeof $scope.cardTransactions[cardId] === 'undefined') {
      console.log('---> requesting transactions from server');
      var DataRequest = cardService.requestTransactions(cardId);

      DataRequest.then(function(result){
        $scope.cardTransactions[cardId] = result;
        console.log('---> card transactions are ', $scope.cardTransactions[cardId]);
        $scope.currentTransactions = $scope.cardTransactions[cardId];
        $scope.$apply();
      });
    } else {
      console.log('---> already have transactions for this card');
      console.log('---> card transactions are ', $scope.cardTransactions[cardId]);
      $scope.currentTransactions = $scope.cardTransactions[cardId];
      $scope.$apply();
    }


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

.controller('SettingsCtrl', function($scope, $state, cardService, $rootScope) {

  $scope.setLimit = function(newLimit) {
    console.log('---> new limit to be set ', newLimit.number);

    var DataRequest = cardService.requestLimit();

    DataRequest.then(function(result){
      console.log('---> limit service responce ', result);
      $state.go('tab.cards');
    });
  };

})

.controller('TabsCtrl', function($scope, $ionicActionSheet, cardService, $state, $rootScope) {
    $rootScope.limit = {};
    $rootScope.selectedLimit = {};

    $scope.showSettings = function() {

     // Show the action sheet
     var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: 'Change limit' }
       ],
       titleText: 'Settings',
       cancelText: 'Logout',
       cancel: function() {
            console.log('---> trying to logout ');
            WL.Client.logout('AuthRealm');
          },
       buttonClicked: function(index) {
         if (index == 0) {

           var DataRequest = cardService.requestLimit();

           DataRequest.then(function(result){
             $rootScope.limit = result.options;
             console.log('---> limit options are ', $rootScope.limit);
             $rootScope.selectedLimit = { number: result.currentLimit};
             console.log('---> current limit is ', $rootScope.selectedLimit);
             $state.go('tab.settings-limits');
           });
         }
         return true;
       }
     });
   };
});
