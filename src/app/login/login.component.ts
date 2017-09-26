import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AF } from "../providers/af";
import { Routes, RouterModule, Router} from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    constructor(db: AngularFireDatabase, public router: Router, public afService: AF) {
    }

    ngOnInit() {
    }

    onLoggedin() {
        this.afService.loginWithGoogle();
        this.afService.user.subscribe(
                (auth) => {
                    if(auth == null) {
                    }
                    else
                    {
                        if (this.router.url === '/') {
                            this.router.navigate(['/dashboard']);
                         }
                    }
            });
    }

}
