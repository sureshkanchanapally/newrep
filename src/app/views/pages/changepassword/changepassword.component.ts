import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  changepasswordnewform:any= FormGroup;
  submitted: boolean;
  validbutton: boolean = false;
  hide: boolean = true;
  oldhide: boolean = true;
  newhide: boolean = true;
  chide: boolean = true;
  ANO: any;
  udiscode: any;

  constructor(private builder: FormBuilder,
    private service: WebService,
    public CommonService: CommonService
  ) { }

  ngOnInit() {
    this.changepasswordnewform = this.builder.group({
      oldpass: ["", Validators.required],
      newpass: ["", Validators.required],
      confirmpass: [""]
    }, { validator: this.checkPasswords })

    // const TKN = localStorage.getItem(this.CommonService.tokenname_ev);
    // // console.log(TKN)
    // if (TKN && TKN !== null) {
    //   this.user_data = JSON.parse(this.CommonService.Decrypt(TKN, this.CommonService.tokenname_ev));
    //   console.log(this.user_data)
    // }
  }

  checkPasswords(daa:any) {
    const pass = daa.get('newpass').value;
    const confirmPass = daa.get('confirmpass').value;
    return pass === confirmPass ? null : { notSamePass: true };
  }

  ChangePassword() {
    this.submitted = true;
    if (this.changepasswordnewform.invalid) {
      return;
    } else {
      // this.validbutton = true;
    }
  }

}
