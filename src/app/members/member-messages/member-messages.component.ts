import { Message } from 'src/app/_models/message';
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlerifyService } from 'src/app/_services/alerify.service';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};
  userId: number;

  constructor(private userService: UserService, private authService: AuthService,
              private alertify: AlerifyService) {
                this.userId = this.authService.decodedToken.nameid;
               }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(this.userId, this.recipientId)
    .pipe(
      tap(messages => {
        for (const message of messages) {
         if (message.isRead === false && message.recipientId === currentUserId) {
            this.userService.markAsRead(currentUserId, message.id);
         }
        }
      })
    )
    .subscribe(messages => {
      this.messages = messages;
    }, error => {
      this.alertify.error(error);
    });
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.userId, this.newMessage).subscribe((message: Message) => {
      this.messages.unshift(message);
      this.newMessage.content = '';
    }, error => {
      this.alertify.error(error);
    });
  }
}
