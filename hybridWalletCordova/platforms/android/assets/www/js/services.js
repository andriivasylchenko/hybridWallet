angular.module('app.services', [])

.service('cardService', function() {
    this.requestCards = function() {
      var cardsRequest = new WLResourceRequest(
        "/adapters/walletAdapter/getCards",
        WLResourceRequest.GET
      );

      cardsRequest.setQueryParameters("params", "[]");

      return cardsRequest.send().then(function(result){
        return result.responseJSON;
      })
    },
    this.requestTransactions = function(cardId) {
      var cardsRequest = new WLResourceRequest(
        "/adapters/walletAdapter/getCardTransactions",
        WLResourceRequest.GET
      );

      cardsRequest.setQueryParameter("params", "['" + cardId + "']");

      return cardsRequest.send().then(function(result){
        return result.responseJSON;
      })
    },
    this.setLimit = function(limit) {
      var cardsRequest = new WLResourceRequest(
        "/adapters/walletAdapter/setLimit",
        WLResourceRequest.GET
      );

      cardsRequest.setQueryParameter("params", "['" + limit + "']");

      return cardsRequest.send().then(function(result){
        return result.responseJSON;
      })
    },
    this.requestLimit = function() {
      var cardsRequest = new WLResourceRequest(
        "/adapters/walletAdapter/getLimit",
        WLResourceRequest.GET
      );

      cardsRequest.setQueryParameter("params", "[]");

      return cardsRequest.send().then(function(result){
        return result.responseJSON;
      })
    },
    this.requestMessages = function() {
      var cardsRequest = new WLResourceRequest(
        "/adapters/walletAdapter/getMessages",
        WLResourceRequest.GET
      );

      cardsRequest.setQueryParameter("params", "[]");

      return cardsRequest.send().then(function(result){
        return result.responseJSON;
      })
    }
})
