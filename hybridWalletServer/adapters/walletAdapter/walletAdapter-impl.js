function getCards() {

	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : '/getCards'
	};


	return WL.Server.invokeHttp(input);
}
