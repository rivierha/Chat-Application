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
  timeStamp: Date;
  type: string;
  check = JSON.parse(localStorage.uName);
  constructor(private authService: AuthService) {

  }

  ngOnInit(chatMessage = this.chatMessage) {
    //  console.log(this.chatMessage.msgTime);
    this.userName = chatMessage.name;
    this.messageContent = chatMessage.content;
    this.type = chatMessage.type;
    this.timeStamp = chatMessage.msgTime;
    // console.log(chatMessage.time);

    // console.log(this.timeStamp.toMillis())
    // this.rightTime = this.timeStamp.seconds;
  }

  // renderMensaje() {
  //   let date: Date;
  //   date = (this.chatMessage.time).toDate();
  //   let hours = date.getHours();
  //   let minutes = date.getMinutes();
  //   let res = hours + ":" + minutes;
  //   return res;
  // }

}
