import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AuthGuard } from '../../_guards/auth.guard';
import { AlerifyService } from '../../_services/alerify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];

  constructor(private userService: UserService, private alertify: AlerifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    const dataUsers = 'users';
    this.route.data.subscribe(data => {
      this.users = data[dataUsers];
    });
  }

/*   loadUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    }, error => {
      this.alertify.error(error);
    });
  } */
}
