import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import { User } from '../shared/user.model';
import {MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule, MatButtonToggleModule } from "@angular/material";
// var allusers=require('../../../../server/models/user.model');

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails;
  allusers;
  fetchedDetails:boolean;
  studentLeaves;
  allStudentsLeaveRecords;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    // this.allusers=this.userService.getAllStudents();
    
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
        console.log(this.userDetails);
      },
      err => { 
        console.log(err);
      }
    );
    this.userService.getStudentLeaveRecord().subscribe(
      res=>{
        this.studentLeaves=res['result'].leaveRecords;
        console.log("leaves are :",this.studentLeaves);
      },
      err=>{
        console.log(err);
      }
    );
  }

  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

  getAllStudentsDetails(){
    this.userService.getAllStudents().subscribe(
      res=>{
        this.allusers=res['result'];
        // console.table(this.allusers);/
      },
      err=>{
        console.log(err);
      }
    );
  }

  postLeave(){
    console.log("Posting leave");
    // this.userService.getUserProfile().subscribe(
    //   res => {
    //     this.userDetails = res['user'];
    //     console.log(this.userDetails);
    //   },
    //   err => { 
    //     console.log(err);
    //   }
    // );
    // console.log(this.userDetails,".....");
    var msg=(document.getElementById("issue") as HTMLInputElement).value;
    this.userService.postYourLeave(this.userDetails,msg).subscribe(
      res=>{
        console.log("succc");
        console.log(res['leaveRecords'])
        this.studentLeaves = res['leaveRecords'];
      },
      err=>{
        console.log(err);
      }
    );
    // console.log(msg);
    alert("Your leave is posted to the Department");
    (document.getElementById("issue") as HTMLInputElement).value="";
  }

  changeStatus(event,student,leave,ind){
    console.log(student.fullName+"--"+leave.reason+"--"+leave.permission);
    

    this.userService.changeLeaveStatus(student,leave,ind).subscribe(
      res=>{
        console.log("succc", res);
        if(leave.permission==true){
          // console.log("yes"+ind);
          student.leaveRecords[ind].permission=false;
          console.log("changed to false");
        }
        else{
          // console.log("no"+ind);
          student.leaveRecords[ind].permission=true;
          console.log("changed to true");
        }
      },
      err=>{
        console.log('érror',err);
      }
    );

  }

}
