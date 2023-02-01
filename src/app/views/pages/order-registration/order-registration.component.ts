import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-order-registration',
  templateUrl: './order-registration.component.html',
  styleUrls: ['./order-registration.component.scss']
})
export class OrderRegistrationComponent implements OnInit {

  OrderRegistartionForm: any = FormGroup;
  validbutton = false;
  submitted = false;

  Buyers_Data: any = [];

  Prodcuts = [{
    categoryid: "",
    Factoryid: "",
    productid: "",
    qty: "",
    AQL: "",
    ValidationStatus: false,
    Categ_Info: []
  }];



  constructor(private fb: FormBuilder, public CF: CommonService, public API: WebService) { }



  ngOnInit(): void {
    this.OrderRegistartionForm = this.fb.group({
      ordernumber: ['', Validators.required],
      buyer: ['', Validators.required],
      orderdate: ['', Validators.required],
      shipdate: ['', Validators.required],
    });

    this.Get_Users();

    this.Get_Products();
    // this.Get_Categories();
    this.Get_Factories();
  }

  public Allow_Only(event: any, formkey: any) {
    let data = this.OrderRegistartionForm.get(formkey)!.value;
    if (data.replace(/ /g, '').length > 0) {
      if (data.charAt(0) !== ' ') {
        var myRegExp = new RegExp(event, 'g');
        let name = data ? data.replace(myRegExp, "") : '';
        this.OrderRegistartionForm.patchValue({
          [formkey]: name
        });
      } else {
        this.OrderRegistartionForm.patchValue({
          [formkey]: ''
        });
      }
    } else {
      this.OrderRegistartionForm.patchValue({
        [formkey]: ''
      });
    }
  }

  OnSubmit() {
    this.submitted = true;
    this.check_Validation();
    let a = this.ValidationFlag();
    if (this.OrderRegistartionForm.invalid || a == false) {
      return
    }
    else {
      let value = this.OrderRegistartionForm.value;
      // console.log(value);
      // console.log(this.Prodcuts);
      let Items: any = [];
      this.Prodcuts.filter((r: any) => {
        let a = {
          categoryid: r.categoryid ? r.categoryid[0].item_id : "",
          productid: r.productid ? r.productid[0].item_id : "",
          productname: r.productid ? r.productid[0].item_text : "",
          qty: Number(r.qty),
          AQL: Number(r.AQL),
          factoryid: r.Factoryid ? r.Factoryid[0].item_id : ""
        }
        Items.push(a);
      })

      let json = {
        ordernumber: value.ordernumber,
        buyerid: value.buyer[0].item_id,
        buyername: value.buyer[0].item_text,
        orderdate: value.orderdate,
        shipdate: value.shipdate,
        Orderitems: Items
      }
      const body = {
        "procedureName": "AstroSP_ordermaster",
        "input1": "Insert_ordermaster",
        "input2": JSON.stringify(json)
      }
      this.API.Common_API(body).then(r => {
        // console.log(r);
        if (r) {
          if (r.recordset[0].Result == 'True') {
            this.OrderRegistartionForm.reset();
            this.submitted = false;
            this.Prodcuts = [{
              categoryid: "",
              Factoryid: "",
              productid: "",
              qty: "",
              AQL: "",
              ValidationStatus: false,
              Categ_Info: []
            }];
            this.CF.ToastSuccess(r.recordset[0].msg, '');
            this.OrderRegistartionForm.reset();
          } else {
            this.CF.ToastError(r.recordset[0].msg, '');
          }
        }  else {
          this.CF.ToastError('Something Went Wrong', '');
        }
      })
    }
  }


  ResetSteps() {

  }

  check_Validation() {
    this.Prodcuts.filter((r: any) => {
      if (r.categoryid != '' && r.Factoryid != '' && r.productid != '' && r.qty != '' && r.AQL != '') {
        r.ValidationStatus = false;
      }
      else { r.ValidationStatus = true; }
    });
    this.ValidationFlag();

  }

  ValidationFlag() {
    let temp = 0;
    this.Prodcuts.filter((r: any) => r.ValidationStatus == false ? temp = temp + 1 : "");
    if (temp == this.Prodcuts.length) { return true; }
    else { return false; }
  }


  Get_Users() {
    this.CF.isSpinnerVisible = true;

    const body = {
      "procedureName": "AstroSP_usermaster",
      "input1": "GetUsers",
      "input2": ""
    }
    this.API.Common_API(body).then((r => {
      this.CF.isSpinnerVisible = false;

      console.log(r);

      const Main_data = r.recordset;

      if (r) {
        if (r.recordset[0].Result == 'True') {
          let data = Main_data ? JSON.parse(Main_data[0].data) : [];
          console.log(data);
          this.Buyers_Data = data.map((s: any) => ({
            item_id: s.userid,
            item_text: s.username,
          }));

        }
        else { }
      } else { }



    }))
  }


  AddProd() {

    let Prod: any = {
      categoryid: "",
      Factoryid: "",
      productid: "",
      qty: "",
      AQL: "",
      ValidationStatus: false,
      Categ_Info: []

    };

    this.Prodcuts.push(Prod);

    console.log(this.Prodcuts);




  }

  DelProd(position: any) {
    this.Prodcuts.splice(position, 1)
  }

  onFactorySelect(data: any, position: any) {

    console.log(data, position);

    this.Get_Categories(data.item_id, position);
  }

  Products_Data: any = [];

  Get_Products() {

    this.CF.isSpinnerVisible = true;

    const body = {
      "procedureName": "AstroSP_ProductMaster",
      "input1": "Get_ProductMaster",
      "input2": "{\"productid\":\"\"}"
    }
    this.API.Common_API(body).then((r => {
      this.CF.isSpinnerVisible = false;

      // console.log(r);
      if (r) {
        if (r.recordset[0].Result == 'True') {
          let data = r.recordset;
          this.Products_Data = data.map((s: any) => ({
            item_id: s.productid,
            item_text: s.productname,
          }));
        } else { }
      } else { }
    }))

  }


  Get_Categories(Id: any, position: any) {
    this.CF.isSpinnerVisible = true;
    const body = {
      "procedureName": "AstroSP_Category",
      "input1": "Get_Category",
      "input2": JSON.stringify({ factoryid: Id })
    }
    this.API.Common_API(body).then((r => {
      this.CF.isSpinnerVisible = false;

      console.log(r);
      if (r) {
        if (r.recordset[0].Result == 'True') {
          let data = r.recordset;
          console.log(data)
          this.Prodcuts[position].Categ_Info = data.map((s: any) => ({
            item_id: s.categoryid,
            item_text: s.categoryname,
          }));
          console.log(this.Prodcuts);
        } else {
          this.Prodcuts[position].Categ_Info = [];
        }
      } else { }
    }))
  }
  FactoryData = [];
  Get_Factories() {
    const body = {
      "procedureName": "AstroSP_factorymaster",
      "input1": "Get",
      "input2": JSON.stringify({ factoryid: '' })
    }
    this.API.Common_API(body).then((r: any) => {
      console.log(r)
      if (r) {
        if (r.recordset[0].Result == 'True') {
          let data = r.recordset;

          this.FactoryData = data.map((s: any) => ({
            item_id: s.factoryid,
            item_text: s.name,
          }));
          console.log(this.FactoryData);
        } else {
        }
      } else { }
    })
  }


}



