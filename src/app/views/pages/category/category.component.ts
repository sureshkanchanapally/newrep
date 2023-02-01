import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  CategoryRegForm: FormGroup;
  SubmittedCateg = false;
  Factory_Data: any = [];

  validbutton = false;

  AddCategForm = false;
  CategLoader = false;

  Categ_Data:any = [];

  constructor(private fb: FormBuilder, public CF: CommonService, public API: WebService) { }

  ngOnInit(): void {
    this.CategoryRegForm = this.fb.group({
      CategoryName: ['', Validators.required],
      FactoryName: ['', Validators.required]
    });

    this.Get_Categories();
  }

  Back() {
    this.Get_Categories();

  }

  Add() {
    this.Get_Factories();
    this.CategoryRegForm.reset();
    this.SubmittedCateg = false;
    this.AddCategForm = true;
  }

  Get_Factories() {
    this.CF.isSpinnerVisible = true;

    const body = {
      "procedureName": "AstroSP_factorymaster",
      "input1": "Get",
      "input2": "{\"factoryid\":\"\"}"
    }
    this.API.Common_API(body).then((r => {
      this.CF.isSpinnerVisible = false;

      // console.log(r);
      if (r) {
        if (r.recordset[0].Result == 'True') {
          let data = r.recordset;
          // console.log(data);
          this.Factory_Data = data.map((s: any) => ({
            item_id: s.factoryid,
            item_text: s.name,
          }));
          // console.log(this.Factory_Data);
        } else { }
      } else { }
    }))
  }


  Get_Categories() {
    this.Categ_Data=[];
    this.CF.isSpinnerVisible = true;
    this.CategLoader = true;

    const body = {
      "procedureName": "AstroSP_Category",
      "input1": "Get_Category",
      "input2": "{\"factoryid\":\"\"}"
    }
    this.API.Common_API(body).then((r => {
      this.CF.isSpinnerVisible = false;
      this.CategLoader = false;


      // console.log(r);
      if (r) {
        if (r.recordset[0].Result == 'True') {
          let data = r.recordset;
          this.Categ_Data=data;
           console.log(this.Categ_Data);
           this.AddCategForm=false;
        } else { }
      } else { }
    }))

  }

  OnSubmitCateg() {
    this.SubmittedCateg = true;
    if (this.CategoryRegForm.invalid) {
      return;
    }
    else {
      let value = this.CategoryRegForm.value;
      console.log(value);

      let json = {
        factoryid: value.FactoryName.length > 0 ? value.FactoryName[0].item_id : "",
        categoryname: value.CategoryName,
        craetedby: this.CF.user.userid,
        parentid: "1",
        categoryImg: "",
        status: 1
      }

      console.log(json);

      const body = {
        "procedureName": "AstroSP_Category",
        "input1": "Insert_Category",
        "input2": JSON.stringify(json)
      }

      this.API.Common_API(body).then(r => {
        console.log(r);
        if (r) {
          if (r.recordset[0].Result == 'True') {
            this.CF.ToastSuccess(r.recordset[0].msg, 'Success');
            this.CategoryRegForm.reset();
            this.SubmittedCateg = false;
            this.Get_Categories();
          } else {
            this.CF.ToastError('Something Went Wrong', '');
          }
        }
        else {
          this.CF.ToastError('Something Went Wrong', '');
        }
      })
    }
  }


  public Allow_OnlyCateg(event: any, formkey: any) {
    let data = this.CategoryRegForm.get(formkey)!.value;
    if (data.replace(/ /g, '').length > 0) {
      if (data.charAt(0) !== ' ') {
        var myRegExp = new RegExp(event, 'g');
        let name = data ? data.replace(myRegExp, "") : '';
        this.CategoryRegForm.patchValue({
          [formkey]: name
        });
      } else {
        this.CategoryRegForm.patchValue({
          [formkey]: ''
        });
      }
    } else {
      this.CategoryRegForm.patchValue({
        [formkey]: ''
      });
    }
  }


}
