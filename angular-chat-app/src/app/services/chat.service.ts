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
    console.log(localStorage.uid)
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
      .then(function () {
        console.log("chatroom created");

      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
    this.router.navigate([`/chat/${this.room}`])
  }

  async sendMessage(msg: string, upload: string) {
    this.db.collection('chatroom').doc(localStorage.room).collection('roomMessages').add({
      content: msg,
      time: Date.now(),
      type: upload,
      name: JSON.parse(localStorage.uName)
    })
      .then(function () {
        console.log("msg added to firestore")
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });

  }

  createGroup(members: Array<any>, group: string) {
    let database1 = this.db;
    this.groupSet = group;
    this.db.collection('groupchat').add({
      members: members,
      groupName: group

    })
      .then(function (data) {
        console.log(data);
        for (let i = 0; i < members.length; i++) {
          database1.collection('users').doc(members[i].id).update({
            subscribedTo: firebase.firestore.FieldValue.arrayUnion(data.id)
          })
        }
        database1.collection('groupchat').doc(data.id).update({
          id: data.id
        })
        console.log(members[0].id)

        console.log("group created with members")
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
    console.log(members, 'this is the group name', group);
    this.router.navigate([`/chat/${group}`]);

  }

  sendGroupMessage(msg: string, upload: string, group: string) {
    console.log(this.groupSet)
    console.log(msg, upload);
    this.db.collection('groupchat').doc(group).collection('roomMessages').add({
      content: msg,
      time: Date.now(),
      type: upload,
      name: JSON.parse(localStorage.uName)
    })
      .then(function () {
        console.log("msg added to firestore")
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
