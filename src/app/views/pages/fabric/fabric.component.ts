import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-fabric',
  templateUrl: './fabric.component.html',
  styleUrls: ['./fabric.component.scss']
})
export class FabricComponent implements OnInit {
  FabricForm: any = FormGroup;
  Submitted = false;
  validbutton = false;
  Hide_Table = false;
  FabricData: any = [];
  No_Details: boolean = false;


  constructor(
    public CF: CommonService,
    private fb: FormBuilder,
    private API: WebService
  ) { }

  ngOnInit() {
    this.FabricForm = this.fb.group({
      name: ["", Validators.required],
      status: ["", Validators.required],
    })
    this.Get_Fabric();
  }

  Get_Fabric() {
    this.FabricData = [];
    this.No_Details = true;
    const body = {
      "procedureName": "AstroSP_FabricMaster",
      "input1": "Get_FabricMaster",
      "input2": JSON.stringify({fabicid:''})
    }
    this.API.Common_API(body).then((r => {
      console.log(r)
      this.No_Details = false;
      if (r) {
        const Main_data = r.recordset;
        if (r.recordset[0].Result == 'True') {
          this.FabricData = Main_data ? Main_data : [];
          console.log(this.FabricData);
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
    this.FabricForm.reset();
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
    const status_drp = this.CF.Status.filter((rs: any) => rs.item_id == Item.status);
    this.FabricForm.patchValue({
      name: Item.fabicname,
      status: status_drp,
    })
  }

  OnSubmit() {
    this.Submitted = true;
    if (!this.FabricForm.invalid) {
      this.validbutton = true;
      const values = this.FabricForm.value;
      const body = {
        "procedureName": "AstroSP_FabricMaster",
        "input1": "Insert_FabricMaster",
        "input2": JSON.stringify({
          fabicname: values.name,
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
            this.FabricForm.reset();
            this.Submitted = false;
            this.Hide_Table = false;
            this.Get_Fabric();
          } else {
            this.CF.ToastError(data[0].msg, 'Success');
          }
        } else { }
      }))
    }
  }

  OnUpdate() {
    this.Submitted = true;
    if (!this.FabricForm.invalid) {
      this.validbutton = true;
      const values = this.FabricForm.value;
      const body = {
        "procedureName": "AstroSP_FabricMaster",
        "input1": "Update_FabricMaster",
        "input2": JSON.stringify({
          fabicid: this.Edit_Details.fabicid,
          fabicname: values.name,
          status: values.status[0].item_id
        })
      }
      this.API.Common_API(body).then((res => {
        this.validbutton = false;
        if (res) {
          const data = res.recordset;
          if (res.recordset[0].Result == 'True') {
            this.CF.ToastSuccess(data[0].msg, '');
            this.FabricForm.reset();
            this.Submitted = false;
            this.Hide_Table = false;
            this.Edit_Details = '';
            this.Get_Fabric();
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
    let data = this.FabricForm.get(formkey)!.value;
    if (data.replace(/ /g, '').length > 0) {
      if (data.charAt(0) !== ' ') {
        var myRegExp = new RegExp(event, 'g');
        let name = data ? data.replace(myRegExp, "") : '';
        this.FabricForm.patchValue({
          [formkey]: name
        });
      } else {
        this.FabricForm.patchValue({
          [formkey]: ''
        });
      }
    } else {
      this.FabricForm.patchValue({
        [formkey]: ''
      });
    }
  }

}
