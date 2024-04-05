import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { User } from 'src/app/services/auth/user';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent  {
  errorMessage:String="";
  user?:User;
  userLoginOn:boolean=false;
  editMode:boolean=false;

  registerForm=this.formBuilder.group({
    id:[''],
    nombres:['',Validators.required],
    apellidos:['', Validators.required],
    identificacion:['',Validators.required],
    fechaNcimiento:['',Validators.required]
  })

  constructor(private userService:UserService, private formBuilder:FormBuilder, private loginService:LoginService  ){
    console.log(environment.userId);
    this.userService.getUser(environment.userId).subscribe({
      next: (userData) => {
        this.user=userData;
        this.registerForm.controls.id.setValue(userData.id.toString());
        this.registerForm.controls.nombres.setValue( userData.nombres);
        this.registerForm.controls.apellidos.setValue( userData.apellidos);
        this.registerForm.controls.identificacion.setValue( userData.identificacion);
        this.registerForm.controls.fechaNcimiento.setValue( userData.fechaNcimiento);
      },
      error: (errorData) => {
        this.errorMessage=errorData
      },
      complete: () => {
        console.info("User Data ok");
      }
    })

    this.loginService.userLoginOn.subscribe({
      next:(userLoginOn) => {
        this.userLoginOn=userLoginOn;
      }
    })
    
  }

  get nombres()
  {
    return this.registerForm.controls.nombres;
  }

  get apellidos()
  {
    return this.registerForm.controls.apellidos;
  }

  get identificacion()
  {
    return this.registerForm.controls.identificacion;
  }

  get fechaNcimiento()
  {
    return this.registerForm.controls.fechaNcimiento;
  }
  savePersonalDetailsData()
  {
    if (this.registerForm.valid)
    {
      this.userService.updateUser(this.registerForm.value as unknown as User).subscribe({
        next:() => {
          this.editMode=false;
          this.user=this.registerForm.value as unknown as User;
        },
        error:(errorData)=> console.error(errorData)
      })
    }
  }

}
