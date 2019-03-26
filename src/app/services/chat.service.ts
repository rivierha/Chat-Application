import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from 'firebase';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Msg } from '../chatmsg';



@Injectable({
  providedIn: 'root'
})
export class ChatService {
  room: string;
  groupSet: string = '';
  feed: AngularFirestoreCollection<Msg>;
  constructor(private db: AngularFirestore, private authservice: AuthService, public router: Router) {

  }

  async createChat(id1: string) {
    let currentId = JSON.parse(localStorage.uid)

    if (id1 < currentId) {
      this.room = id1 + currentId
    } else {
      this.room = currentId + id1
    }

    localStorage.setItem('room', this.room);

    await this.db.collection('chatroom').doc(this.room).set({
      user1: id1,
      user2: JSON.parse(localStorage.uid)
    })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
    this.router.navigate([`/chat/${this.room}`])
  }

  async sendMessage(msg: string, upload: string) {
    // console.log(firebase.database.ServerValue.TIMESTAMP);
    this.db.collection('chatroom').doc(localStorage.room).collection('roomMessages').add({
      content: msg,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      msgTime: Date.now(),
      type: upload,
      name: JSON.parse(localStorage.uName)
    }).then(() => {
      console.log("message sent")
    })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });

  }

  createGroup(members: Array<any>, group: string) {
    let database1 = this.db;
    this.groupSet = group;
    let Router = this.router;
    this.db.collection('groupchat').add({
      members: members,
      groupName: group

    })
      .then(function (data) {
        for (let i = 0; i < members.length; i++) {
          database1.collection('users').doc(members[i].id).update({
            subscribedTo: firebase.firestore.FieldValue.arrayUnion(data.id)
          })
        }
        database1.collection('groupchat').doc(data.id).update({
          id: data.id
        })
        Router.navigate([`/chat/${data.id}`]);
        console.log("group created")
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
    // this.router.navigate([`/chat/${group}`]);

  }

  updateGroup(members: Array<any>, groupId: string) {
    let database1 = this.db;
    let Router = this.router;
    for (let i = 0; i < members.length; i++) {
      this.db.collection('groupchat').doc(groupId).update({
        members: firebase.firestore.FieldValue.arrayUnion(members[i]),
      })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
    for (let i = 0; i < members.length; i++) {
      database1.collection('users').doc(members[i].id).update({
        subscribedTo: firebase.firestore.FieldValue.arrayUnion(groupId)
      })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
    console.log("users added to group")
    Router.navigate([`/chat/${groupId}`]);
  }

  sendGroupMessage(msg: string, upload: string, group: string) {
    this.db.collection('groupchat').doc(group).collection('roomMessages').add({
      content: msg,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      msgTime: Date.now(),
      type: upload,
      name: JSON.parse(localStorage.uName)
    }).then(() => {
      console.log("message sent")
    })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });

  }

  displayMsg() {
    this.feed = this.db.collection('chatroom').doc(localStorage.room).collection('roomMessages', ref => ref.orderBy('time'));
    return this.feed;
  }
}
