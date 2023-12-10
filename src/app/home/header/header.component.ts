import {Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { isLogin } from 'src/app/Service/website-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  hasLogin: boolean =false;
  user: any;
  @ViewChild('toggler') toggler!: ElementRef;
  isToggle: boolean = false;
  private login!: Subscription;
  constructor(private isLogin: isLogin, private router: Router){}

  ngOnInit(): void {
    if(this.login){
      this.login.unsubscribe();
    }
    this.login = this.isLogin.isLogin$.subscribe((result: any)=>{
      if(result.status === true){
        this.hasLogin = true;
        const user= JSON.parse(result.user);
        this.user= user;
      }
    })
  }
  islogout(islogout: boolean){
    this.hasLogin = islogout;
    this.router.navigate(['']);
  }
  showAndHideToggle(){
    const element= this.toggler.nativeElement;
    this.isToggle = !this.isToggle;
    if(this.isToggle === false){
      element.innerHTML = '<i class="fa-solid fa-bars" style="color: #ffffff;"></i>'
    }else if(this.isToggle === true){
      element.innerHTML = '<i class="fa-solid fa-xmark" style="color: #ffffff;"></i>';
    }
  }
  ngOnDestroy(): void {
    this.login.unsubscribe();
  }
}
