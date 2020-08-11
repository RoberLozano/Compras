initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var providerData = user.providerData;
        user.getIdToken().then(function(accessToken) {
       
            console.log(user);
            document.getElementById("userImg").src=photoURL;
            document.getElementById('span-usuario').textContent = displayName;
            document.getElementById('span-email').textContent = email;
    
        });
      } else {
        // User is signed out.
console.log("no registrado");
      }
    }, function(error) {
      console.log(error);
    });
  };

  window.addEventListener('load', function() {
    initApp();
  });