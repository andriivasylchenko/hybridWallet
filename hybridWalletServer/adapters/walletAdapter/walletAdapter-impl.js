function getCards() {

	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : '/getCards'
	};


	return WL.Server.invokeHttp(input);
}

function getLimit() {

	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : '/getLimit'
	};


	return WL.Server.invokeHttp(input);
}

function getMessages() {

	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : '/getMessages'
	};


	return WL.Server.invokeHttp(input);
}

function getCardTransactions(cardId) {

	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : '/getCardTransactions/' + cardId
	};


	return WL.Server.invokeHttp(input);
}

function setLimit(limit) {

	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : '/setLimit'
	};


	return WL.Server.invokeHttp(input);
}

WL.Server.createEventSource({
	name: 'PushEventSource',
	onDeviceSubscribe: 'deviceSubscribeFunc',
	onDeviceUnsubscribe: 'deviceUnsubscribeFunc',
	securityTest:'AuthSecurityTest'
});

function deviceSubscribeFunc(userSubscription, deviceSubscription){
	WL.Logger.debug(">> deviceSubscribeFunc");
	WL.Logger.debug(userSubscription);
	WL.Logger.debug(deviceSubscription);
}

function deviceUnsubscribeFunc(userSubscription, deviceSubscription){
	WL.Logger.debug(">> deviceUnsubscribeFunc");
	WL.Logger.debug(userSubscription);
	WL.Logger.debug(deviceSubscription);
}

function submitNotification(userId, notificationText){
	var userSubscription = WL.Server.getUserNotificationSubscription('walletAdapter.PushEventSource', userId);

	if (userSubscription==null){
		return { result: "No subscription found for user :: " + userId };
	}

	var badgeDigit = 1;

	var notification={};
	notification.MPNS={};

	notification = WL.Server.createDefaultNotification(notificationText, badgeDigit, {custom:"data"});

	//Set Toast notification for MPNS
	notification.MPNS.toast={};
	notification.MPNS.toast.text1 = "Toast title";
	notification.MPNS.toast.text2 = "Toast content";

	WL.Logger.debug("submitNotification >> userId :: " + userId + ", text :: " + notificationText);

	WL.Server.notifyAllDevices(userSubscription, notification);

	return {
		result: "Notification sent to user :: " + userId
	};
}
