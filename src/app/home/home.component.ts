import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../user';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  private userCollection: AngularFirestoreCollection<Item>;
  subscribe: Observable<Item[]>;
  currentUserId: any;
  groupRoute: boolean;
  members: Array<any> = [];
  groupName: string = "";
  groups: Array<any> = [];
  routeId: string;
  groupchat: boolean;

  groupForm = new FormGroup({
    groupname: new FormControl('')
  });


  constructor(private db: AngularFirestore, private router: Router, private route: ActivatedRoute, private authservice: AuthService, private chatservice: ChatService) {
    this.routeId = this.route.snapshot.paramMap.get("id");
    if (this.routeId == 'group') {
      this.groupRoute = true;
      this.members = [];
    } else
      this.groupRoute = false;

    if (this.routeId != 'group' && this.routeId != null) {
      this.groupchat = true;
      this.members = [];
    } else
      this.groupchat = false;

    this.currentUserId = JSON.parse(localStorage.uid);

    this.userCollection = db.collection('users');
    this.subscribe = this.userCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Item;

        const uid = a.payload.doc.id;
        return { uid, ...data };

      }))
    );

    this.db.collection('users').doc(this.currentUserId).valueChanges().subscribe((data) => {
      let subbedTo = [];
      let groups = [];
      subbedTo = data.subscribedTo;
      if (data.subscribedTo) {
        for (let i = 0; i < subbedTo.length; i++) {
          this.db.collection('groupchat').doc(subbedTo[i]).valueChanges().subscribe(group => {
            groups.push(group)
          })
        }
      }
      this.groups = groups;
    })

  }

  chat(val1) {
    this.chatservice.createChat(val1);
  }

  chatGroup(val) {
    this.router.navigate([`chat/${val}`])
  }

  gotoGroup() {
    this.chatservice.updateGroup(this.members, this.routeId);
    this.router.navigate([`chat/${this.routeId}`])
  }


  addUser(id, name) {
    let alreadyExists = false;
    if (this.members.length > 0) {
      for (let i = 0; i < this.members.length; i++) {
        if (this.members[i].id == id) {
          alreadyExists = true;
          break;
        }
      }
      if (!alreadyExists) {
        this.members.push({
          id: id,
          name: name
        });
      }
    }
    else {
      this.members.push({
        id: id,
        name: name
      });
    }
  }

  create() {
    this.members.push({
      id: JSON.parse(localStorage.uid),
      name: JSON.parse(localStorage.uName)
    });
    this.groupName = this.groupForm.value.groupname;
    this.chatservice.createGroup(this.members, this.groupName);

  }

  ngOnInit() {
    if (this.router.url == '/home/group') {
      this.groupRoute = true;
      this.members = [];
    }
    else
      this.groupRoute = false;

  }

}
