function logIn(auth0Client, auth0Domain, setupApp, logoUrl)
{
    var options = {
      theme: {
        logo: logoUrl,
        primaryColor: '#31324F'
      },
      languageDictionary: {
          title: "Itsnet Login"
      }
    };
    var lock = new Auth0Lock(auth0Client, auth0Domain, options);
    lock.show(
    {
        focusInput: true,
        popup: false,
        closable: false,
        allowSignUp: false
    });
    lock.on("authenticated", 
    function(authResult) 
    {
//        console.log(authResult);
        lock.hide();
        setupApp();
    });  
}
