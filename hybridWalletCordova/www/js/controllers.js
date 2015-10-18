angular.module('app.controllers', [])

.controller('CardsCtrl', function($scope, cardService) {
  document.addEventListener('serverConnected', initComplete, false);

  $scope.loadCards = function () {
    console.log('---> called loadCards');
      var DataRequest = cardService.requestCards();

      DataRequest.then(function(result){
        $scope.cards = result.cards;
        console.log('---> Cards loaded ', $scope.cards);
        $scope.$apply();
      })
  };


  function initComplete() {
    console.log('---> WL init completed');

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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
