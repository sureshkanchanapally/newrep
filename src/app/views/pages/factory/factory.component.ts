import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.scss']
})
export class FactoryComponent implements OnInit {
  FactoryForm: FormGroup;
  Submitted = false;
  validbutton = false;
  Hide_Table = false;
  FactoryData: any = [];
  No_Details: boolean = false;
  uploadingloading:boolean=false

  Factory_Images_Info: any = [
    { FactoryImgType: "Front view", FactoryImgUrl: "" },
    { FactoryImgType: "Back view", FactoryImgUrl: "" },
    { FactoryImgType: "Inside out front", FactoryImgUrl: "" },
    { FactoryImgType: "Inside out back", FactoryImgUrl: "" },
    { FactoryImgType: "Add New Pictures", FactoryImgUrl: "" },
  ]

  constructor(
    public CF: CommonService,
    private fb: FormBuilder,
    private API: WebService
  ) { }

  ngOnInit() {
    this.FactoryForm = this.fb.group({
      nameOfFactory: ["", Validators.required],
      Location: ["", Validators.required],
      IndustryName: ["", Validators.required],
      status: ["", Validators.required],
    });
    this.Get_Factory();
    this.Get_Industrys();
  }

  Get_Factory() {
    this.FactoryData = [];
    this.No_Details = true;
    const body = {
      "procedureName": "AstroSP_factorymaster",
      "input1": "Get",
      "input2": JSON.stringify({factoryid:''})
    }
    this.API.Common_API(body).then((r:any) => {
      console.log(r)
      this.No_Details = false;
      if (r) {
        if (r.recordset[0].Result == 'True') {
          this.FactoryData = r.recordset ? r.recordset : [];
          this.Hide_Table = false;
        } else {
          this.CF.ToastError('NO DATA AVAILABLE..!', 'Error')
        }
      } else { }
    })
  }

  Industry_Data:any=[];
  Get_Industrys() {
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
          this.Industry_Data = res.recordset ? res.recordset : [];
          this.Industry_Data.map((ins:any)=>{ins.item_id = ins.industryid, ins.item_text = ins.industryname})
        } else {
          this.CF.ToastError('NO DATA AVAILABLE..!', '');
        }
      } else {
        this.CF.ToastError('Something went wrong', '');
      }
    }))
  }

  Add_Factory() {
    this.Hide_Table = true;
    this.Edit_Details = '';
    this.Submitted = false;
    this.FactoryForm.reset();
  }

  Back() {
    this.Hide_Table = false;
    this.Edit_Details = '';
  }

  Edit_Details: any;
  Edit_Factory(Item: any) {
    console.log(Item);
    this.Edit_Details = Item;
    this.Hide_Table = true;
    this.Submitted = false;
    const Status = this.CF.Status.filter((st:any)=> st.item_id == Item.status);
    this.FactoryForm.patchValue({
      nameOfFactory: Item.name,
      Location: Item.address,
      IndustryName: Item.industryname,
      status: Status
    })
  }

  onClick() {

  }

  OnSubmit() {
    this.Submitted = true;
    if (!this.FactoryForm.invalid) {
      this.validbutton = true;
      const values = this.FactoryForm.value;
      const body = {
        "procedureName": "AstroSP_factorymaster",
        "input1": "Insert",
        "input2": JSON.stringify({
          industryid: values.IndustryName[0].item_id,
          name : values.nameOfFactory,
          factorylogo: '',
          factoryimages: '',
          address: values.Location,
          contactPer_Name : '',
          contactPer_Email: '',
          contactPer_Mobile: '',
          createdby: this.CF.user.userid,
          status: values.status[0].item_id
        })
      }
      this.API.Common_API(body).then(((res:any) => {
        this.validbutton = false;
        if (res) {
          const data = res.recordset;
          if (res.recordset[0].Result == 'True') {
            this.CF.ToastSuccess(data[0].msg, '');
            this.FactoryForm.reset();
            this.Submitted = false;
            this.Hide_Table = false;
            this.Get_Factory();
          } else {
            this.CF.ToastError(data[0].msg, '');
          }
        } else {
          this.CF.ToastError('Something went wrong', '')
         }
      }))
    }
  }

  OnUpdate() {
    this.Submitted = true;
    if (!this.FactoryForm.invalid) {
      this.validbutton = true;
      const values = this.FactoryForm.value;
      const body = {
        "procedureName": "AstroSP_factorymaster",
        "input1": "Update",
        "input2": JSON.stringify({
          factoryid: this.Edit_Details.factoryid,
          industryid: values.IndustryName[0].item_id,
          name : values.nameOfFactory,
          factorylogo: '',
          factoryimages: '',
          address: values.Location,
          contactPer_Name : '',
          contactPer_Email: '',
          contactPer_Mobile: '',
          status: values.status[0].item_id
        })
      }
      this.API.Common_API(body).then(((res:any) => {
        this.validbutton = false;
        if (res) {
          const data = res.recordset;
          if (res.recordset[0].Result == 'True') {
            this.CF.ToastSuccess(data[0].msg, '');
            this.FactoryForm.reset();
            this.Submitted = false;
            this.Hide_Table = false;
            this.Edit_Details = '';
            this.Get_Factory();
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
    let data = this.FactoryForm.get(formkey)!.value;
    if (data.replace(/ /g, '').length > 0) {
      if (data.charAt(0) !== ' ') {
        var myRegExp = new RegExp(event, 'g');
        let name = data ? data.replace(myRegExp, "") : '';
        this.FactoryForm.patchValue({
          [formkey]: name
        });
      } else {
        this.FactoryForm.patchValue({
          [formkey]: ''
        });
      }
    } else {
      this.FactoryForm.patchValue({
        [formkey]: ''
      });
    }
  }
}
