/*
  Displays notifications when events happen in the firebase game queue.
  Requires "notifications" permission in the manifest file.
*/
var authenticated = false;
var userIdent = false;
var fbUrl = 'https://ari-firepoker-reclus.firebaseio.com';
var ref = new window.Firebase(fbUrl);
var userOpts = null;

// Test for notification support, and set up noticifation.
if (window.Notification) {
  init();
  chrome.runtime.onMessage.addListener(function(request, sender) {
   if (request.message === 'UpdateUserSettings'){
     setUserOptions();
   }
  });
}


function init() {

 var watchForUserSettings = setInterval(function() {
    if (!userOpts){
     getSavedUserToken(getUserData);
     getSavedUserOptions();
    }
    else{
      setUserOptions();
      clearInterval(watchForUserSettings);
    }
  }, 10000);
   
  createNotification("Plugin started!");
  
};

function setUserOptions(){
  ref = new window.Firebase(fbUrl);
  if (userOpts.gamePlayed) {
    watchForPlayedGames();
  }
  if (userOpts.gameQueueAdded) {
    watchGameQueueAddedGames();
  }
  if (userOpts.gameQueueModified) {
    watchGameQueueChangedGames();
  }
  if (userOpts.gameQueueDeleted) {
    watchGameQueueDeletedGames();
  }
};

function getSavedUserToken(callback) {
  var authToken = false;
  chrome.storage.sync.get("userData", loadUserDataCallback);
};

function loadUserDataCallback(data) {
  userIdent = data.userData;
};

function getSavedUserOptions() {
  chrome.storage.sync.get("userOptions", loadUserOptionsCallback);
};

function loadUserOptionsCallback(data) {
  userOpts = data.userOptions;
};

function getUserData(userData) {
  if (!userData.authToken) {
    createNotification("Please login!");
  }
  ref.child("users").child(userData.authToken)
    .once("value", function(snapshot) {
      return snapshot.val();
    }, function(error) {
      return error;
    });
};

function watchForPlayedGames() {
  ref.child("games").on("child_changed", function(snapshot) {
    var game = snapshot.val();
    if (game.owner === userIdent.userEmail && game.status === "Played") {
      createNotification("Your game (" + gameInfo.name + ") has been played, please go accept the game!");
    };
  }, function(error) {
    createNotification(error);
  });
};

function watchGameQueueAddedGames() {
  ref.child("gameQueue").on("child_added", function(snapshot) {
    var gameInfo = snapshot.val();
    if (gameInfo.player === userIdent.userEmail) {
      createNotification("Game (" + gameInfo.name + ") has been added to your queue!");
    };
  }, function(error) {
    createNotification(error);
  });
};

function watchGameQueueChangedGames() {
  ref.child("gameQueue").on("child_changed", function(snapshot) {
    var gameInfo = snapshot.val();
    if (gameInfo.player === userIdent.userEmail) {
      createNotification("Game (" + gameInfo.name + ") in your game que has been changed!");
    };
  }, function(error) {
    createNotification(error);
  });
};

function watchGameQueueDeletedGames() {
  ref.child("gameQueue").on("child_removed", function(snapshot) {
    var gameInfo = snapshot.val();
    if (gameInfo.player === userIdent.userEmail) {
      createNotification("Game (" + gameInfo.name + ") has been removed from your queue!");
    };
  }, function(error) {
    createNotification(error);
  });
};

function createNotification(notificationMessage) {
  var opts = {
    tag: '1',
    body: notificationMessage,
    icon: "firePoker85x64.jpg",
  };
  new Notification("ARI Planning Poker Notice", opts); //Using this over chromes notifications because it just works!
};
