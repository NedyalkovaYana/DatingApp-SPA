import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlerifyService } from '../_services/alerify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};

  constructor(private authService: AuthService, private alertify: AlerifyService) { }

  ngOnInit() {
  }
  
  register() {
   this.authService.register(this.model).subscribe(() => {
     this.alertify.success('Registration is successful');
   }, error => {
     this.alertify.error(error);
   });
  }
   
  cancel() {
    this.cancelRegister.emit(false);
  }
}
