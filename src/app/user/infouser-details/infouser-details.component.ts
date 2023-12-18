import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/Service/user.service';
import { isLogin } from 'src/app/Service/website-service.service';

@Component({
  selector: 'app-infouser-details',
  templateUrl: './infouser-details.component.html',
  styleUrls: ['./infouser-details.component.scss']
})
export class InfouserDetailsComponent implements OnInit{
  user: any;
  Id: any;
  constructor(private userService: UserService, private isLogin: isLogin, private title: Title){}
  ngOnInit(): void {
    this.isLogin.isLogin$.subscribe((item:any)=>{
      const a= JSON.parse(item.user);
      this.Id = a.id;
      this.title.setTitle(`${a.name}`);
    })
    this.userService.infouser(this.Id).subscribe((result: any)=>{
      this.user = result;
      //console.log(this.user);
    })
  }

}
