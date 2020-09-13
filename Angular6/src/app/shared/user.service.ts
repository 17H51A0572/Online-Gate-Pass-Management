import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from './user.model';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    fullName: '',
    email:'',
    password:'',
    role:'',
    msg:''
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  //HttpMethods

  postUser(user: User){
    console.log("posting data");
    return this.http.post(environment.apiBaseUrl+'/register',user,this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(environment.apiBaseUrl + '/authenticate', authCredentials,this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/userProfile');
  }
  postYourLeave(userr:any,msg:string){
    // var userr;
    // this.getUserProfile().subscribe(
    //   res => {
    //     userr = res['user'];
    //   },
    //   err => { 
    //     console.log(err);
    //   }
    // );
    console.log("UUUUUser is : ",userr);
    userr.msg=msg;
    return this.http.post(environment.apiBaseUrl+'/postleave',userr,this.noAuthHeader);
  }

  getStudentLeaveRecord(){
    return this.http.get(environment.apiBaseUrl+'/leaveRecordOfStudent');
  }

  getAllStudentsLeaveRecords(){
    return this.http.get(environment.apiBaseUrl+'/getAllStudentsLeaveRecords');  
  }

  getAllStudents(){
    console.log(environment.apiBaseUrl+'/getStudent');
    return this.http.get(environment.apiBaseUrl+'/getStudent');
    // console.log("sample:\n"+temp);
    // return temp;
  }
  //Helper Methods

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }
}
