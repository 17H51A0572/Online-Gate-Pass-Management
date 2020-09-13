import { Component, OnInit } from '@angular/core';
import { NgForm,FormsModule,ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { UserService } from '../../shared/user.service'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  // favoriteSeason: string;
  // seasons: string[] = ['Admin', 'Student'];
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean;
  serverErrorMessages: string;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log(form);
    this.userService.postUser(form.value).subscribe(
      res => {
        console.log("success");
        this.showSucessMessage = true;
        setTimeout(() => this.showSucessMessage = false, 4000);
        this.resetForm(form);
      },
      err => {
        console.log("unsuccess");
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        }
        else
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
      }
    );
  }

  resetForm(form: NgForm) {
    this.userService.selectedUser = {
      fullName: '',
      email: '',
      password: '',
      role:'',
      msg:''
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }

}
