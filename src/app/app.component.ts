import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AF } from "./providers/af";
import { Router } from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public isLoggedIn: boolean;
	public title : string;
  	public userUID : string;
  	public items: FirebaseListObservable<any[]>;

    constructor(private translate: TranslateService, db: AngularFireDatabase, private router: Router, public afService: AF) {
        translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa']);
        translate.setDefaultLang('es');
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr|ur|es|it|fa/) ? browserLang : 'en');

        this.title = "Empro extension";
        console.log(localStorage);
        this.afService.user.subscribe(
				(auth) => {
		      		if(auth == null) {
		 				console.log("from app component Not Logged in.");
		       		    this.router.navigate(['login']);
		          		this.isLoggedIn = false;
		          		localStorage.setItem('isLoggedin', 'false');
		      		}
		      		else{
						console.log(" from app component  Successfully Logged in.");
		     	     	this.isLoggedIn = true;
		       	 	 	localStorage.setItem('isLoggedin', 'true');

		      	    	// UPDATE: I forgot this at first. Without it when a user is logged in and goes directly to /login
		        	  	// the user did not get redirected to the home page.
		       	 	 	this.router.navigate(['dashboard']);
		       	 	 	this.items = db.list('/items');

							console.log("google display name");
				            this.afService.displayName = auth.displayName;
				            this.afService.email = auth.email;


							console.log("displayName "+auth.displayName);
							console.log("email "+auth.email);
				          
		      		}
		      });
    }

    login() {
    this.afService.loginWithGoogle();
  }

  logout() {
    this.afService.logout();
  }
}