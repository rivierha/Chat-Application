import { Component, OnInit, OnChanges } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable } from 'rxjs';
import { Msg } from '../chatmsg';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnChanges {
  feed : AngularFirestoreCollection<Msg>;
  feeds : Observable<Msg[]>
  paramid : string = '';
  cName = JSON.parse(localStorage.uName);

  constructor(private chat: ChatService,private route: ActivatedRoute, private db : AngularFirestore) { 
    this.paramid = this.route.snapshot.paramMap.get("id")
  }

  ngOnInit() {
    if(this.paramid == localStorage.room){
    this.feed = this.db.collection('chatroom').doc(localStorage.room).collection('roomMessages', ref => ref.orderBy('time'));
    this.feeds = this.feed.valueChanges();
    console.log(this.feed);
    }
    else {
    this.feed = this.db.collection('groupchat').doc(this.route.snapshot.paramMap.get("id")).collection('roomMessages', ref => ref.orderBy('time'));
    this.feeds = this.feed.valueChanges();
    console.log(this.feed);
    }    
  }

  ngOnChanges() {
    if(this.paramid == localStorage.room){
    this.feed = this.chat.displayMsg();
    this.feeds = this.feed.valueChanges();
    console.log(this.feed);
    }else {
    this.feed = this.db.collection('groupchat').doc(this.route.snapshot.paramMap.get("id")).collection('roomMessages', ref => ref.orderBy('time'));
    this.feeds = this.feed.valueChanges();
    console.log(this.feed);
    }
  }

}
