import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { AngularFireStorage } from "@angular/fire/storage";
import { URL } from 'url';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent implements OnInit {
  message: string;
  type: string;
  selectedFiles: FileList;
  file: File;
  color: string = 'primary';
  mode: 'determinate';
  progressBarValue;

  constructor(private chat: ChatService, private route: ActivatedRoute, private storage: AngularFireStorage) {

      console.log(this.route.snapshot.paramMap.get("id") == localStorage.room)
  }

  ngOnInit() {
  }

  clicked(event) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.item(0))
      this.uploadpic();
  }

  uploadpic() {
    let file = this.selectedFiles.item(0);
    let uniqkey = 'pic-' + file.name;
    const uploadTask = this.storage.upload('/chat_uploads/' + uniqkey, file).then(
      () => {
        const ref = this.storage.ref('/chat_uploads/' + uniqkey);
        let downloadUrl = ref.getDownloadURL().subscribe(url => {
          const URL = url;
          this.message = URL;
          if (this.route.snapshot.paramMap.get("id") == localStorage.room)
          this.chat.sendMessage(URL, "file"); 
          else
            this.chat.sendGroupMessage(URL, "file", this.route.snapshot.paramMap.get("id"));
          this.message = '';
        })
      }
    );

  }

  send() {
    this.message = this.message.trim();
    if(this.message !== ''){
    if (this.route.snapshot.paramMap.get("id") == localStorage.room) {
      this.chat.sendMessage(this.message, "text");
      this.message = '';
    }
    else {   
      this.chat.sendGroupMessage(this.message, "text", this.route.snapshot.paramMap.get("id"));
      this.message = '';
    }
  }
  }

  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }
}
