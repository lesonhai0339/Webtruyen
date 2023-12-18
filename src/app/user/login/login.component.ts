import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/Service/user.service';
import { WebsiteServiceService } from 'src/app/Service/website-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginform: FormGroup;
  status: boolean = false; // Biến để lưu trạng thái lỗi

  constructor(public formBuilder: FormBuilder, private userService: UserService, private toastr: ToastrService, private router:Router
    ,private websiteService: WebsiteServiceService, private title: Title) {
      this.title.setTitle('Đăng nhập');
    this.loginform = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  login(){
    let status= false;
    const username= this.loginform.get('username')?.value;
    const password= this.loginform.get('password')?.value;
    this.userService.login(username, password).subscribe({
      next: (result: any)=>{
        const token= result.token;
        const user= result.userdata;
        if(token.length> 0 && user){
          this.toastr.success('Đăng nhập thành công');
          this.websiteService.SetCookie(token, user);
          this.websiteService.Getcookie();
          setTimeout(() => {
            this.router.navigate(['']);
          }, 0);
        }
      },
      error:(err: any)=> {
        if(err && err.status === 401){
          this.toastr.error("Đăng nhập thất bại");
        }
        if(err && err.status === 0){
          this.toastr.warning("Kết nối đén máy chủ bị gián đoạn");
        }
      },
    });
  }
}
