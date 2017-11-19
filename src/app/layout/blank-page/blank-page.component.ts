import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Injectable} from "@angular/core";
import { AfterViewChecked, ElementRef, ViewChild} from '@angular/core';
import { AngularFireModule,  FirebaseApp  } from 'angularfire2';

// Custom Firebase modules
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AF } from "../../providers/af";

@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.scss']
})
export class BlankPageComponent implements OnInit {

	public newMessage: string;
	public messages: FirebaseListObservable<any>;
	public authorizationDocuments: FirebaseListObservable<any>;

    constructor(public router: Router, db: AngularFireDatabase, public afService: AF) {
    	//this.authorizationDocuments = db.list('/authorizationDocuments/document');
        this.authorizationDocuments = db.list('/authorizationDocuments', {
                query: {
                orderByChild: "action",
                equalTo: "DOCUMENT_APPROVAL_REQUEST",
                }
                });

    }

    ngOnInit() {
    	//if (this.router.url === '/') {
        //    this.router.navigate(['/dashboard']);
        //}
    }
    
  sendMessage(){  }
}
