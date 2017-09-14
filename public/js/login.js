function logIn(auth0Client, auth0Domain, setupApp)
{
    var options = {
      theme: {
        logo: 'https://itsnet-basic-app.herokuapp.com/images/itsLogo.jpg',
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
        popup: true,
        closable: false,
        allowSignUp: false,
    });
    lock.on("authenticated", 
    function(authResult) 
    {
//        console.log(authResult);
        lock.hide();
        setupApp();
    });  
}
