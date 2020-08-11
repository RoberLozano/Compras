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
          console.log( 'Hola '+displayName);
          console.log( `Registrado como ${uid} correo ${email}`);

          document.getElementById("serImg").src=photoURL;

      });
    } else {
      // User is signed out.
        console.log("No estás registrado");
    }
  }, function(error) {
    console.log(error);
  });