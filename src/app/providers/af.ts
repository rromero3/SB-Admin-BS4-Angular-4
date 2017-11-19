// src/app/providers/af.ts
import {Injectable} from "@angular/core";

import { AngularFireModule,  FirebaseApp  } from 'angularfire2';

// Custom Firebase modules
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from "firebase/app"

@Injectable()
export class AF {
  
  /**
   * Observable of authentication state
   */
  public user: Observable<firebase.User>;
  public messages: FirebaseListObservable<any>;
  public displayName : string;
  public email : string;
  //public redirectUser: object;

  constructor(public afAuth: AngularFireAuth, db: AngularFireDatabase,  private app: FirebaseApp) {
    this.displayName = "";
    this.email = "";
    this.user =  afAuth.authState;
    this.messages = db.list('messages');
    this.app.auth().getRedirectResult().then(function(result) {
              console.log('got redirect result')
              if (result.user == null || result.user == 'undefined')
              {
                console.log('not authenticated')
                return;
              }

              localStorage.setItem('isLoggedin', 'true');
              localStorage.setItem('uid', result.user.uid);
              localStorage.setItem('displayName', result.user.displayName);
              localStorage.setItem('email', result.user.email);
              localStorage.setItem('photoURL', result.user.photoURL);
              localStorage.setItem('userJson', JSON.stringify(user2, null, '  '));

                // The signed-in user info.
               var user2 = result.user;
               // this.redirectUser = result.user;
               console.log("user details *******************")
               console.log(JSON.stringify(user2, null, '  '))

              if (result.credential) {
                // This gives you a Google Access Token.
                var token2 = result.credential.accessToken;
                
               //var credential2 = firebase.auth.GoogleAuthProvider.credential(user2.id, token2);

               // console.log("credentials **2**");
               // console.log(credential2);

               // // Save it using the Chrome extension storage API.
               //  chrome.storage.sync.set({'google-credential': credential2}, function() {
               //    // Notify that we saved.
               //    console.log('Google Settings saved');

               //  });
              }
              
            });

  }

  /**
 * Starts the sign-in process.
 */
 startSignInWithGoogle() 
{
 console.log("entry startSignInWithGoogle");

   
    // document.getElementById('quickstart-button').disabled = true;
    if (firebase.auth().currentUser) {
      console.log("current user already present");
    } else {
      console.log("startAuth");
      // startAuth(true);
    }

    if (chrome == undefined || chrome.identity == undefined )
    {
             // Start a sign in process for an unauthenticated user.
              var provider2 = new firebase.auth.GoogleAuthProvider();
              provider2.addScope('https://www.googleapis.com/auth/userinfo.email');
              provider2.addScope('https://www.googleapis.com/auth/userinfo.profile');
              provider2.addScope('https://www.googleapis.com/auth/plus.login');
              firebase.auth().signInWithRedirect(provider2);
              return;
    }

    chrome.identity.getProfileUserInfo(function(userInfo) {
   /* Use userInfo.email, or better (for privacy) userInfo.id
   They will be empty if user is not signed in in Chrome */
       var interactive = true;
      console.log("response get profile user info respone");
      console.log(userInfo);
      localStorage.setItem('profile-user-email', userInfo.email);
      console.log('user email:'+userInfo.email);
      localStorage.setItem('profile-user-id', userInfo.email);
      console.log('user id:'+userInfo.id);

       

     chrome.identity.getAuthToken({ 'interactive': true }, function(tokena) {
      console.log('chrome.identity.getAuthToken( response');

      if (chrome.runtime.lastError && !interactive) {
        console.error(chrome.runtime.lastError);
        console.log('It was not possible to get a token programmatically.');
      } else if(chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        

      } else if (tokena) {
          console.log('got oauth token '+ tokena);

          // Authrorize Firebase with the OAuth Access Token.
           var credential = firebase.auth.GoogleAuthProvider.credential(null, tokena);

          console.log("credentials ****");
          console.log(credential);
          alert('credential');

          firebase.auth().signInWithCredential(credential).then( function(a){
           // localStorage.setItem('google-credential', credential);
            console.log(credential);
            console.log('Google Settings saved');
            alert('Google Settings saved');
            

          }

            ).catch(function(error) {
              /*
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            if (errorCode === 'auth/account-exists-with-different-credential') {
              alert('Email already associated with another account.');
              // Handle account linking here, if using.
            } 
            if (error.code === 'auth/invalid-credential') {
             // chrome.identity.removeCachedAuthToken({token: tokena}, function() {
                //startAuth(false);
              //});
            }
            else  
            {
                console.error(error);
            }

            */
           });
        } else {
          console.error('The OAuth Token was null');
        }
      });

   });

}



  /**
   * Logs in the user
   * @returns {firebase.Promise<FirebaseAuthState>}
   */
  loginWithGoogle() {
    console.log("entry loginWithGoogle");
    const interactive = true;

    if (chrome.identity == null)
    {
       var provider2 = new firebase.auth.GoogleAuthProvider();
        provider2.addScope('https://www.googleapis.com/auth/userinfo.profile');
        provider2.addScope('https://www.googleapis.com/auth/userinfo.email');
        provider2.addScope('https://www.googleapis.com/auth/plus.login');
        firebase.auth().signInWithRedirect(provider2);
    }
    else
    {
        chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
          if (chrome.runtime.lastError && !interactive) {
            console.log('It was not possible to get a token programmatically.');
          } else if(chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else if (token) {
            // Authrorize Firebase with the OAuth Access Token.
            var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
            firebase.auth().signInWithCredential(credential).catch(function(error) {
              localStorage.setItem('token', token);
              // The OAuth token might have been invalidated. Lets' remove it from cache.
              //if (error.code === 'auth/invalid-credential') {
              //  chrome.identity.removeCachedAuthToken({token: token}, function() {
              //  startAuth(interactive);
             //   });
              });
        
          } else {
            console.error('The OAuth Token was null');
          }
        });
    }

    /**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
// function startAuth(interactive) {
  // Request an OAuth token from the Chrome Identity API.
  



   
   // his.afAuth.auth.signInWithPopup(        


    //this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    //this.afAuth.auth.signInWithRedirect(provider2);
  }

  /**
   * Logs out the current user
   */
  logout() {
    this.afAuth.auth.signOut();
    /* return this.af.auth.logout(); */
  }

  /**
   * Saves a message to the Firebase Realtime Database
   * @param text
   */
  sendMessage(text) {
    var message = {
      message: text,
      displayName: this.displayName,
      email: this.email,
      timestamp: Date.now()
    };
    this.messages.push(message);
  }
}
