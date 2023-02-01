import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  UserForm: any = FormGroup;
  Submitted = false;
  validbutton = false;
  Hide_Table = false;
  UsersData: any = [];
  Roles_Data: any = [];
  No_Details: boolean = false;

  Roles_Status = [
    { item_id: 1, item_text: "Active" },
    { item_id: 0, item_text: "InActive" }
  ]


  constructor(
    public CF: CommonService,
    private fb: FormBuilder,
    private API: WebService
  ) { }

  ngOnInit() {
    this.UserForm = this.fb.group({
      roles: ["", Validators.required],
      name: ["", Validators.required],
      EMPID: ["", Validators.required],
      Emailid: ['', [Validators.required, Validators.compose([Validators.pattern(/^[\w-\.\']{1,}\@([\da-zA-Z-]{1,}\.){1,}[\da-zA-Z-]{2,3}$/),]),]],
      phoneno: ["", [Validators.required, Validators.pattern(/^[6-9]{1}[0-9]{9}$/)]],
      status: ["", Validators.required],
      address: [''],
    })
    this.Get_Users();
    this.Get_Roles();
  }

  Get_Roles() {
    const body = {
      "procedureName": "AstroSP_RoleMaster",
      "input1": "Get_RoleMaster",
      "input2": JSON.stringify({roleid:''})
    }
    this.API.Common_API(body).then((r => {
      if (r) {
        if (r.recordset[0].Result == 'True') {
          this.Roles_Data = r.recordset ? r.recordset : [];
          this.Roles_Data.map((rs: any) => { rs.item_id = rs.roleid, rs.item_text = rs.rolename })
        } else { }
      } else { }
    }))
  }

  Get_Users() {
    this.UsersData = [];
    this.No_Details = true;
    const body = {
      "procedureName": "AstroSP_usermaster",
      "input1": "GetUsers",
      "input2": ""
    }
    this.API.Common_API(body).then((r => {
      this.No_Details = false;
      if (r) {
        const Main_data = r.recordset;
        if (r.recordset[0].Result == 'True') {
          this.UsersData = Main_data ? JSON.parse(Main_data[0].data) : [];
          console.log(this.UsersData);
          this.Hide_Table = false;
        } else {
          this.CF.ToastError('NO DATA AVAILABLE..!', 'Error')
        }
      } else { }
    }))
  }

  Add_Users() {
    this.Hide_Table = true;
    this.Edit_Details = '';
    this.Submitted = false;
    this.UserForm.reset();
  }

  Back() {
    this.Hide_Table = false;
    this.Edit_Details = '';
  }

  Edit_Details: any;
  Edit_User(Item: any) {
    console.log(Item);
    this.Edit_Details = Item;
    this.Hide_Table = true;
    const role_drp = this.Roles_Data.filter((rs: any) => rs.roleid == Item.roleid);
    const status_drp = this.Roles_Status.filter((rs: any) => rs.item_id == Item.status);
    this.UserForm.patchValue({
      roles: role_drp,
      name: Item.username,
      // employID: Item.username,
      Emailid: Item.emailid,
      phoneno: Item.mobileno,
      status: status_drp,
      address: Item.address,
    })
  }

  OnSubmit() {
    this.Submitted = true;
    if (!this.UserForm.invalid) {
      this.validbutton = true;
      const values = this.UserForm.value;
      const body = {
        "procedureName": "AstroSP_usermaster",
        "input1": "Insert_usermaster",
        "input2": JSON.stringify({
          roleid: values.roles[0].item_id,
          username: values.name,
          mobileno: values.phoneno,
          emailid: values.Emailid,
          address: values.address,
          createdby: this.CF.user.userid,
          status: values.status[0].item_id
        })
      }
      this.API.Common_API(body).then((res => {
        this.validbutton = false;
        if (res) {
          const data = res.recordset;
          if (res.recordset[0].Result == 'True') {
            this.CF.ToastSuccess(data[0].msg, 'Success');
            this.UserForm.reset();
            this.Submitted = false;
            this.Hide_Table = false;
            this.Get_Users();
          } else {
            this.CF.ToastError(data[0].msg, 'Success');
          }
        } else { }
      }))
    }
  }

  OnUpdate() {
    this.Submitted = true;
    if (!this.UserForm.invalid) {
      this.validbutton = true;
      const values = this.UserForm.value;
      const body = {
        "procedureName": "AstroSP_usermaster",
        "input1": "Update_usermaster",
        "input2": JSON.stringify({
          userid: this.Edit_Details.userid,
          roleid: values.roles[0].item_id,
          username: values.name,
          mobileno: values.phoneno,
          emailid: values.Emailid,
          address: values.address,
          status: values.status[0].item_id
        })
      }
      this.API.Common_API(body).then((res => {
        this.validbutton = false;
        if (res) {
          const data = res.recordset;
          if (res.recordset[0].Result == 'True') {
            this.CF.ToastSuccess(data[0].msg, '');
            this.UserForm.reset();
            this.Submitted = false;
            this.Hide_Table = false;
            this.Edit_Details = '';
            this.Get_Users();
          } else {
            this.CF.ToastError(data[0].msg, '');
          }
        } else {
          this.CF.ToastError('something wen wrong', '');
        }
      }))
    }
  }

  public Allow_Only(event: any, formkey: any) {
    let data = this.UserForm.get(formkey)!.value;
    if (data.replace(/ /g, '').length > 0) {
      if (data.charAt(0) !== ' ') {
        var myRegExp = new RegExp(event, 'g');
        let name = data ? data.replace(myRegExp, "") : '';
        this.UserForm.patchValue({
          [formkey]: name
        });
      } else {
        this.UserForm.patchValue({
          [formkey]: ''
        });
      }
    } else {
      this.UserForm.patchValue({
        [formkey]: ''
      });
    }
  }

}
