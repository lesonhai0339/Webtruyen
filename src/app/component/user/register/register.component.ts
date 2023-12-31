import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/Service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent{
  registerform: FormGroup;
  isRegister= false;
  error_messages = {
    'name': [
      { type: 'required', message: 'Yêu cầu*' },
      { type: 'pattern', message: 'Tên đăng nhập không được chứa khoảng trắng*' },
    ],
    'email': [
      { type: 'required', message: 'Yêu cầu*' },
      { type: 'email', message: 'Địa chỉ email không đúng*' }
    ],

    'password': [
      { type: 'required', message: 'Yêu cầu' },
      { type: 'minlength', message: 'Tối thiểu 6 ký tự*' },
      { type: 'maxlength', message: 'Tối đa 30 ký tự*' },
      { type: 'pattern', message: 'Mật khẩu phải bao gồm chữ thường,chữ hoa, chữ số và kí tự đặt biệt*' },
    ],
    'confirmpassword': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'Tối thiểu 6 ký tự*' },
      { type: 'maxlength', message: 'Tối đa 30 ký tự*' },
      { type: 'pattern', message: 'Mật khẩu phải bao gồm chữ thường,chữ hoa, chữ số và kí tự đặt biệt*' },
    ],
  }

  constructor(public formBuilder: FormBuilder, private userService: UserService, private toastr: ToastrService, private router: Router,
    private title: Title) {
      this.title.setTitle('Đăng ký');
    this.registerform = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^[^\s]+.*[^\s]+$/),
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email,
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,30}$')
      ])),
      confirmpassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,30}$')
      ])),
    }, { 
      validators: this.password.bind(this)
    });
  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password')!;
    const { value: confirmPassword } = formGroup.get('confirmpassword')!;
    if(password.length> 0 && confirmPassword.length>0){
      return password === confirmPassword ? null : { passwordNotMatch: true };
    }
    return null;
  }
  register(){
    const username= this.registerform.get('username')?.value;
    const password= this.registerform.get('password')?.value == this.registerform.get('confirmpassword')?.value
     ?this.registerform.get('password')?.value: null;
    const email= this.registerform.get('email')?.value;
    if(password !==null){
      this.userService.register(username,password,email).subscribe({
        next: (result: any)=>{
          if(result.status === 'Success' && result.message){
            this.toastr.success(result.message);
            this.isRegister= true;
          }
        },
        error: (error:any)=>{
          if(error.status === 400){
            this.toastr.error('Tạo user thất bại');
          }
        }
      })
    }
  }
}
