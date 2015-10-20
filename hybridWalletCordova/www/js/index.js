var Messages = {
  // Add here your messages for the default language.
  // Generate a similar file with a language suffix containing the translated messages.
  // key1 : message1,
};

var wlInitOptions = {
  // Options to initialize with the WL.Client object.
  // For initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center.
};

// Called automatically after MFP framework initialization by WL.Client.init(wlInitOptions).
function wlCommonInit(){
  WL.Client.connect({
    onSuccess: function() {
      console.log('---> connected to MFP server');
      var wlevent = new CustomEvent('serverConnected');
      console.log('---> dispatching serverConnected event');
      document.dispatchEvent(wlevent);
      MQA.startNewSession(
        {
          mode: "QA",
          // or mode: "MARKET" for production mode.
          android: {
            appKey: "1g701fbc620e77f7b6d8f3897b7d7ea15da4a8797cg0g1g3cca0d6b" ,
            notificationsEnabled: true
          }
        },
        {
          success: function () {console.log("Session Started successfully");},
          error: function (string) { console.log("Session error" + string);}
        }
      );
    },
    onFailure: function() {
      console.log('---> Failed to connect to MFP server');
    }
  });
}
