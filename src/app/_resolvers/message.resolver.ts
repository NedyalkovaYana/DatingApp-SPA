import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { AlerifyService } from '../_services/alerify.service';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class MessageResolver implements Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';

    constructor(private authService: AuthService, private userService: UserService,
                private router: Router, private alertify: AlerifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        const userId = this.authService.decodedToken.nameid;
        return this.userService.getMessages(userId, this.pageNumber, this.pageSize, this.messageContainer)
        .pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving messages');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}

