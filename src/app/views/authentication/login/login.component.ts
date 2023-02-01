import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxOtpInputConfig } from 'ngx-otp-input';
import Swal from 'sweetalert2';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginform: any = FormGroup;
  Submitted: boolean;
  loginvalid = false;
  recoverform = false;
  hide = true;
  OTP_View = false;
  OTPvalid = false;
  Mobile_Read = false;
  Edit_Mob = false;

  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 4,
    autofocus: true,
    classList: {
      inputBox: "my-super-box-class",
      input: "my-super-class",
      inputFilled: "my-super-filled-class",
      inputDisabled: "my-super-disable-class",
      inputSuccess: "my-super-success-class",
      inputError: "my-super-error-class"
    }
  };

  constructor(
    private router: Router,
    private formbuilder: FormBuilder,
    public CF: CommonService,
    private API: WebService,
  ) {
    this.CF.JS_File();
    localStorage.removeItem('menu_data')
  }

  ngOnInit(): void {
    this.loginform = this.formbuilder.group({
      mobileno: ["", [Validators.required, Validators.pattern(/^[6-9]{1}[0-9]{9}$/)]],
      OTP: ['3345']
    });
    console.log(this.CF.user)
  }

  Otp: any;
  onSubmit() {
    this.Submitted = true;
    if (!this.loginform.invalid) {
      this.loginvalid = true;
      const body = {
        "procedureName": "AstroSP_otpTransactions",
        "input1": "getOTP",
        "input2": JSON.stringify({ MobileNumber: this.loginform.get("mobileno").value })
      }
      console.log(body);
      this.API.Common_API(body).then((res: any) => {
        this.loginvalid = false;
        console.log(res);
        if (res) {
          const data = res.recordset;
          this.Otp = data[0].OTP;
          data.lengh ? this.OTP_View = true : this.OTP_View = false;
          this.OTP_View = true;
          this.Mobile_Read = true;
          this.Edit_Mob = true;
          this.CF.ToastSuccess('OTP send successfully', 'Success');
          this.loginform.patchValue({
            OTP: data[0].OTP
          })
        } else {
          this.CF.ToastError('Something went wrong', 'Error');
        }
      }, (error: any) => {
        this.loginvalid = false;
      })
    } else {
      this.loginform.get('OTP').clearValidators();
      this.loginform.get('OTP').updateValueAndValidity();
    }
  }

  Verify_Otp() {
    console.log(this.loginform);
    if (this.loginform.get('OTP').value) {
      this.OTPvalid = true;
      const body = {
        "procedureName": "AstroSP_otpTransactions",
        "input1": "VerifyOTP",
        "input2": JSON.stringify({
          MobileNumber: this.loginform.get("mobileno").value,
          OTP: this.Otp //this.OTPValue //this.loginform.get("OTP").value
        })
      }
      console.log(body);
      this.API.Common_API(body).then((res: any) => {
        this.OTPvalid = false;
        console.log(res);
        if (res) {
          const data = res.recordset;
          console.log(data);
          if (data[0].Result == "False") {
            this.CF.ToastError(data[0].msg, 'Error');
          } else {
            this.CF.LocalStorageSet(this.CF.tokenname, JSON.stringify(data[0]));
            // localStorage.setItem('User_Details',JSON.stringify(data[0]))
            this.CF.ToastSuccess('OTP Successfully', 'Success');
            this.Get_Menu_Access()

          }
        }
      })
    } else {
      this.loginform.get('OTP').setValidators([Validators.required, Validators.minLength(4)]);
      this.loginform.get('OTP').updateValueAndValidity();
    }
  }

  Edit_Mobile() {
    this.OTP_View = false;
    this.Edit_Mob = false;
    this.Mobile_Read = false;
    this.loginform.patchValue({
      OTP: ''
    })
    this.loginform.get('OTP').clearValidators();
    this.loginform.get('OTP').updateValueAndValidity();
  }

  showRecoverForm() { }


  BacktoHome(Disecode: any) {
    Swal.fire({
      title: Disecode + ' UDISE+ Code is not registered',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Sign Up Now'

    }).then((result: any) => {
      if (result.isDismissed !== true) {
        localStorage.setItem('Login_to_signup', Disecode);
        this.router.navigateByUrl("signup");
      } else {
        localStorage.removeItem('Login_to_signup')
      }
    })
  }

  OTPValue: any = "";

  otpChange(value: any) {
    console.log(value)
    this.OTPValue = '';
  }

  fill(value: any) {
    // this.OTPValue=value;
    this.OTPValue = value;
  }

  public Allow_Only(event: any, formkey: any) {
    let data = this.loginform.get(formkey).value;
    // console.log(data.replace(/ /g, ''))
    if (data.replace(/ /g, '').length > 0) {
      if (data.charAt(0) !== ' ') {
        var myRegExp = new RegExp(event, 'g');
        // console.log(myRegExp)
        let name = data ? data.replace(myRegExp, "") : '';
        //  console.log(name);
        this.loginform.patchValue({
          [formkey]: name
        });
      } else {
        this.loginform.patchValue({
          [formkey]: ''
        });
      }
    } else {
      console.log(2)
      this.loginform.patchValue({
        [formkey]: ''
      });
    }
  }

  // onLoggedin() {
  //   this.CF.ToastSuccess('Login Successfully','Success')
  //   this.router.navigateByUrl('/dashboard');
  //   // e.preventDefault();
  //   // localStorage.setItem('isLoggedin', 'true');
  //   // if (localStorage.getItem('isLoggedin')) {
  //   //   this.router.navigate([this.returnUrl]);
  //   // }
  // }

  Get_Menu_Access() {
    // this.menuItems = [];
    const body = {
      "procedureName": "AstroSP_GetData",
      "input1": "Menulist",
      "input2": JSON.stringify({ role_id: this.CF.user.roleid })
    }
    this.API.Common_API(body).then((res: any) => {
      console.log(res);
      if (res) {
        if (res.recordset[0].Result == "True") {
          const Main_Data = res.recordset[0] ? JSON.parse(res.recordset[0].roledata) : [];
          console.log(Main_Data)
          const Sub_Data = Main_Data.filter((m: any) => m.status == 1);
          Sub_Data.map((me: any) => {
            me.label = me.menuname; me.icon = 'home';
            me.link = me.menu_url; me.subItems = me.submenu;
            me.submenu.map((se: any) => {
              se.label = se.menuname;
              se.link = se.menu_url;
            })
          })
          console.log(Sub_Data);
          localStorage.setItem('menu_data', JSON.stringify(Sub_Data))
          this.router.navigateByUrl("dashboard");
        }
      }
    })
  }

}
