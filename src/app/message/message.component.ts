import { Component, OnInit, Input } from '@angular/core';
import { Msg } from '../chatmsg';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent implements OnInit {

  @Input() chatMessage: Msg;
  userName: string;
  messageContent: string;
  timeStamp: Date = new Date();
  isOwnMessage: boolean;
  ownEmail: string;
  type: string;
  check = JSON.parse(localStorage.uName);
  constructor(private authService: AuthService) {}

  ngOnInit(chatMessage = this.chatMessage) {
    this.messageContent = chatMessage.content;
    this.timeStamp = chatMessage.time;
    this.type = chatMessage.type;
    this.userName = chatMessage.name;
  }

}
