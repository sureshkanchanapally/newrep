import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent implements OnInit {
  LableForm: any = FormGroup;
  Submitted = false;
  validbutton = false;
  Hide_Table = false;
  LabelsData: any = [];
  No_Details: boolean = false;


  constructor(
    public CF: CommonService,
    private fb: FormBuilder,
    private API: WebService
  ) { }

  ngOnInit() {
    this.LableForm = this.fb.group({
      Labelname: ["", Validators.required],
      status: ["", Validators.required],
    })
    this.Get_Lables();
  }

  Get_Lables() {
    this.LabelsData = [];
    this.No_Details = true;
    const body = {
      "procedureName": "AstroSP_LabelMaster",
      "input1": "Get_LabelMaster",
      "input2": JSON.stringify({labelid:''})
    }
    this.API.Common_API(body).then((r => {
      console.log(r)
      this.No_Details = false;
      if (r) {
        const Main_data = r.recordset;
        if (r.recordset[0].Result == 'True') {
          this.LabelsData = Main_data ? Main_data : [];
          console.log(this.LabelsData);
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
    this.LableForm.reset();
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
    this.LableForm.patchValue({
      Labelname: Item.username,
      status: status_drp,
    })
  }

  OnSubmit() {
    this.Submitted = true;
    if (!this.LableForm.invalid) {
      this.validbutton = true;
      const values = this.LableForm.value;
      const body = {
        "procedureName": "AstroSP_LabelMaster",
        "input1": "Insert_LabelMaster",
        "input2": JSON.stringify({
          labelname: values.Labelname,
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
            this.LableForm.reset();
            this.Submitted = false;
            this.Hide_Table = false;
            this.Get_Lables();
          } else {
            this.CF.ToastError(data[0].msg, 'Success');
          }
        } else { }
      }))
    }
  }

  OnUpdate() {
    this.Submitted = true;
    if (!this.LableForm.invalid) {
      this.validbutton = true;
      const values = this.LableForm.value;
      const body = {
        "procedureName": "AstroSP_usermaster",
        "input1": "Update_LabelMaster",
        "input2": JSON.stringify({
          labelid: this.Edit_Details.labelid,
          labelname: values.Labelname,
          createdby: this.CF.user.userid,
          status: values.status[0].item_id
        })
      }
      this.API.Common_API(body).then((res => {
        this.validbutton = false;
        if (res) {
          const data = res.recordset;
          if (res.recordset[0].Result == 'True') {
            this.CF.ToastSuccess(data[0].msg, '');
            this.LableForm.reset();
            this.Submitted = false;
            this.Hide_Table = false;
            this.Edit_Details = '';
            this.Get_Lables();
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
    let data = this.LableForm.get(formkey)!.value;
    if (data.replace(/ /g, '').length > 0) {
      if (data.charAt(0) !== ' ') {
        var myRegExp = new RegExp(event, 'g');
        let name = data ? data.replace(myRegExp, "") : '';
        this.LableForm.patchValue({
          [formkey]: name
        });
      } else {
        this.LableForm.patchValue({
          [formkey]: ''
        });
      }
    } else {
      this.LableForm.patchValue({
        [formkey]: ''
      });
    }
  }

}
