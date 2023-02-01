import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrls: ['./industry.component.scss']
})
export class IndustryComponent implements OnInit {
  IndustryForm: FormGroup;
  Submitted = false;
  validbutton = false;
  Hide_Table = false;
  IndustriesData: any = [];
  No_Details: boolean = false;

  constructor(
    public CF: CommonService,
    private fb: FormBuilder,
    private API: WebService
  ) { }

  ngOnInit() {
    this.IndustryForm = this.fb.group({
      nameOfIndustry: ["", Validators.required],
      Description: ["", Validators.required],
      status: ["", Validators.required],
    });
    this.Get_INDUSTRY();
  }

  Get_INDUSTRY() {
    this.IndustriesData = [];
    this.No_Details = true;
    const body = {
      "procedureName": 'AstroSP_Industrymaster',
      "input1": 'Get',
      "input2": JSON.stringify({industryid:''})
    }
    this.API.Common_API(body).then((res => {
      console.log(res);
      this.No_Details = false;
      if (res) {
        if (res.recordset[0].Result == 'True') {
          this.IndustriesData = res.recordset ? res.recordset : [];
          this.Hide_Table = false;
        } else {
          this.CF.ToastError('NO DATA AVAILABLE..!', '');
        }
      } else {
        this.CF.ToastError('Something went wrong', '');
      }
    }))
  }

  Add_INDUSTRY() {
    this.Hide_Table = true;
    this.Edit_Details = '';
    this.Submitted = false;
    this.IndustryForm.reset();
  }

  Back() {
    this.Hide_Table = false;
    this.Edit_Details = '';
  }

  Edit_Details: any;
  Edit_INDUSTRY(Item: any) {
    console.log(Item);
    this.Edit_Details = Item;
    this.Hide_Table = true;
    this.Submitted = false;
   const Status =  this.CF.Status.filter((s:any)=> s.item_id == Item.status);
    this.IndustryForm.patchValue({
      nameOfIndustry: Item.industryname,
      Description: Item.industrydescription,
      status: Status
    })
  }

  OnSubmit() {
    this.Submitted = true;
    if (!this.IndustryForm.invalid) {
      this.validbutton = true;
      const values = this.IndustryForm.value;
      const body = {
        "procedureName": "AstroSP_Industrymaster",
        "input1": "Insert",
        "input2": JSON.stringify({
          industryname: values.nameOfIndustry,
          industrydescription: values.Description,
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
            this.IndustryForm.reset();
            this.Submitted = false;
            this.Hide_Table = false;
            this.Get_INDUSTRY();
          } else {
            this.CF.ToastError(data[0].msg, '');
          }
        } else {
          this.CF.ToastError('Something went wrong', '');
         }
      }))
    }
  }

  OnUpdate() {
    this.Submitted = true;
    if (!this.IndustryForm.invalid) {
      this.validbutton = true;
      const values = this.IndustryForm.value;
      const body = {
        "procedureName": "AstroSP_Industrymaster",
        "input1": "Update",
        "input2": JSON.stringify({
          industryname: values.nameOfIndustry,
          industrydescription: values.Description,
          industryid: this.Edit_Details.industryid,
          status: values.status[0].item_id
        })
      }
      this.API.Common_API(body).then((res => {
        this.validbutton = false;
        if (res) {
          const data = res.recordset;
          if (res.recordset[0].Result == 'True') {
            this.CF.ToastSuccess(data[0].msg, '');
            this.IndustryForm.reset();
            this.Submitted = false;
            this.Hide_Table = false;
            this.Edit_Details = '';
            this.Get_INDUSTRY();
          } else {
            this.CF.ToastError(data[0].msg, '');
          }
        } else {
          this.CF.ToastError('Something went wrong', '');
         }
      }))
    }
  }

  public Allow_Only(event: any, formkey: any) {
    let data = this.IndustryForm.get(formkey)!.value;
    if (data.replace(/ /g, '').length > 0) {
      if (data.charAt(0) !== ' ') {
        var myRegExp = new RegExp(event, 'g');
        let name = data ? data.replace(myRegExp, "") : '';
        this.IndustryForm.patchValue({
          [formkey]: name
        });
      } else {
        this.IndustryForm.patchValue({
          [formkey]: ''
        });
      }
    } else {
      this.IndustryForm.patchValue({
        [formkey]: ''
      });
    }
  }


}
