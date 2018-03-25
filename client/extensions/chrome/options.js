/*
  Logs user into ARI Planning Poker App
*/
document.addEventListener('DOMContentLoaded', init);

function init() {
  getSavedUserToken();
  getSavedUserOptions();
  addEvents();
};

function addEvents() {
  var loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', login, false);
  }
  var saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveOptions, false);
  }
};

function login() {
  var fb = new Firebase('https://ari-firepoker-reclus.firebaseio.com');
  fb.authWithPassword({
    email: loginForm.userEmail.value,
    password: loginForm.password.value
  }, function(error, authData) {
    if (error) {
      new Notification("Login", {
      tag: '1',
      body: "Login error! " + error
    });
    } else {
      chrome.storage.sync.set({
        userData: {
          isAuthenticated: true,
          authToken: authData.uid,
          userEmail: loginForm.userEmail.value
        }
      }, function() {
        //User Auth Token Saved
        chrome.extension.getBackgroundPage().window.location.reload();
      });
     new Notification("Login", {
      tag: '1',
      body: "Login was a success!"
    });
    }
  });
};

function saveOptions() {
  var optForm = document.getElementById('optForm');
  chrome.storage.sync.set({
    userOptions: {
      gameQueueAdded: optForm.gqAdd.checked,
      gameQueueDeleted: optForm.gqDel.checked,
      gameQueueModified: optForm.gqMod.checked,
      gamePlayed: optForm.gPlayed.checked
    }
  });
  debugger;
  
  chrome.runtime.sendMessage({message: 'UpdateUserSettings'});
  
  new Notification("Options Updated", {
    tag: '1',
    body: "Options have been saved!"
  });
}

function getSavedUserToken() {
  var authToken = false;
  chrome.storage.sync.get("userData", loadUserDataCallback);
};

function loadUserDataCallback(data) {
  var userIdent = data.userData;
  var userEmail = document.getElementById('loginForm');
  loginForm.userEmail.value = userIdent.userEmail;
};

function getSavedUserOptions() {
  chrome.storage.sync.get("userOptions", loadUserOptionsCallback);
};

function loadUserOptionsCallback(data) {
  var userOptions = data.userOptions;
  var optForm = document.getElementById('optForm');
  optForm.gqAdd.checked = userOptions.gameQueueAdded;
  optForm.gqDel.checked = userOptions.gameQueueDeleted;
  optForm.gqMod.checked = userOptions.gameQueueModified;
  optForm.gPlayed.checked = userOptions.gamePlayed;
};