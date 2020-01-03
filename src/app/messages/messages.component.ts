import { Message } from '../_models/message';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { AlerifyService } from '../_services/alerify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(private userService: UserService, private authService: AuthService,
              private alertify: AlerifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    const message = 'messages';
    this.route.data.subscribe(data => {
      this.messages = data[message].result;
      this.pagination = data[message].pagination;
    });
  }

  loadMessages() {
    const userId = this.authService.decodedToken.nameid;
    this.userService.getMessages(userId, this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
    .subscribe((res: PaginatedResult<Message[]>) => {
      this.messages = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }

  deleteMessage(id: number) {
    this.alertify.confirm('Are you sure you want to delete this message?', () => {
    const userId = this.authService.decodedToken.nameid;
    this.userService.deleteMessage(userId, id).subscribe(message => {
      this.messages = this.messages.filter(m => m.id !== id);
      this.alertify.success('The message was successfuly deleted');
    }, error => {
      this.alertify.error(error);
    });
  });
}



  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
