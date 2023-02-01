import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent implements OnInit {
  SizeForm: any = FormGroup;
  Submitted = false;
  validbutton = false;
  Hide_Table = false;
  SizeData: any = [];
  No_Details: boolean = false;


  constructor(
    public CF: CommonService,
    private fb: FormBuilder,
    private API: WebService
  ) { }

  ngOnInit() {
    this.SizeForm = this.fb.group({
      name: ["", Validators.required],
      status: ["", Validators.required],
    })
    this.Get_Lables();
  }

  Get_Lables() {
    this.SizeData = [];
    this.No_Details = true;
    const body = {
      "procedureName": "AstroSP_sizemaster",
      "input1": "Get_sizemaster",
      "input2": JSON.stringify({sizeid:''})
    }
    this.API.Common_API(body).then((r => {
      console.log(r)
      this.No_Details = false;
      if (r) {
        const Main_data = r.recordset;
        if (r.recordset[0].Result == 'True') {
          this.SizeData = Main_data ? Main_data : [];
          console.log(this.SizeData);
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
    this.SizeForm.reset();
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
    this.SizeForm.patchValue({
      name: Item.sizename,
      status: status_drp,
    })
  }

  OnSubmit() {
    this.Submitted = true;
    if (!this.SizeForm.invalid) {
      this.validbutton = true;
      const values = this.SizeForm.value;
      const body = {
        "procedureName": "AstroSP_sizemaster",
        "input1": "Insert_sizemaster",
        "input2": JSON.stringify({
          sizename: values.name,
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
            this.SizeForm.reset();
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
    if (!this.SizeForm.invalid) {
      this.validbutton = true;
      const values = this.SizeForm.value;
      const body = {
        "procedureName": "AstroSP_sizemaster",
        "input1": "Update_sizemaster",
        "input2": JSON.stringify({
          sizeid: this.Edit_Details.sizeid,
          sizename: values.name,
          status: values.status[0].item_id
        })
      }
      this.API.Common_API(body).then((res => {
        this.validbutton = false;
        if (res) {
          const data = res.recordset;
          if (res.recordset[0].Result == 'True') {
            this.CF.ToastSuccess(data[0].msg, '');
            this.SizeForm.reset();
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
    let data = this.SizeForm.get(formkey)!.value;
    if (data.replace(/ /g, '').length > 0) {
      if (data.charAt(0) !== ' ') {
        var myRegExp = new RegExp(event, 'g');
        let name = data ? data.replace(myRegExp, "") : '';
        this.SizeForm.patchValue({
          [formkey]: name
        });
      } else {
        this.SizeForm.patchValue({
          [formkey]: ''
        });
      }
    } else {
      this.SizeForm.patchValue({
        [formkey]: ''
      });
    }
  }

}
