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

  constructor(public afAuth: AngularFireAuth, db: AngularFireDatabase,  private app: FirebaseApp) {

    this.user =  afAuth.authState;
    this.messages = db.list('messages');
    this.app.auth().getRedirectResult().then(function(result) {
                // The signed-in user info.
               var user2 = result.user;

              if (result.credential) {
                // This gives you a Google Access Token.
                var token2 = result.credential.accessToken;
               var credential2 = firebase.auth.GoogleAuthProvider.credential(user2.id, token2);

                console.log("credentials **2**");
                console.log(credential2);

               // // Save it using the Chrome extension storage API.
               //  chrome.storage.sync.set({'google-credential': credential2}, function() {
               //    // Notify that we saved.
               //    console.log('Google Settings saved');

               //  });
              }
              
            });

  }


  /**
   * Logs in the user
   * @returns {firebase.Promise<FirebaseAuthState>}
   */
  loginWithGoogle() {

    var provider2 = new firebase.auth.GoogleAuthProvider();
    provider2.addScope('profile');
    provider2.addScope('email');
    provider2.addScope('https://www.googleapis.com/auth/plus.login');
    //firebase.auth().signInWithRedirect(provider2);
   // his.afAuth.auth.signInWithPopup(        


       //this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        this.afAuth.auth.signInWithRedirect(provider2);
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
