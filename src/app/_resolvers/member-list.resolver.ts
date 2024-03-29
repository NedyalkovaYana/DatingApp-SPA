import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlerifyService } from '../_services/alerify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 5;
    constructor(private userService: UserService, private router: Router, private alertify: AlerifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        const userId = 'id';
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe (
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}

