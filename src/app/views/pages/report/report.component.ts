import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  general_data: any = [
    {
      VendorName: "test",
      FactoryName: "test",
      VendorNumber: 1234,
      FactoryBusiness_License: "test",
      agent: "test",
      FactoryID: 808990,
      BrandName: "test",
      approvedSample: "NO",
      Sku: 12234,
      ReferenceSample: "YES",
      ProductDescription: "test",
      CombinedSampling: "YES",
      Upc: 9999,
      PreviousInspction: "test",
      VendorStyle: "test",
      ProtocolNumber: 9898,
      ProductPO: "test",
      InspctionDate: "test",
      IFIversion: 900.7,
      InspectionLocation: "test",
      Inspection_Name: "test",
    }
  ]

  hidetable:boolean = false
  GeneralForm:any= FormGroup;
  Submitted:boolean = false;

  Reports = [
    { ReportName: "System A Report", Date: 13 / 4 / 23, Reports: "pass" },
    { ReportName: "System A Report", Date: 13 / 4 / 23, Reports: "fail" },
    { ReportName: "System A Report", Date: 13 / 4 / 23, Reports: "pass" },
    { ReportName: "System A Report", Date: 13 / 4 / 23, Reports: "fail" },
    { ReportName: "System A Report", Date: 13 / 4 / 23, Reports: "fail" },
    { ReportName: "System A Report", Date: 13 / 4 / 23, Reports: "pass" },
    { ReportName: "System A Report", Date: 13 / 4 / 23, Reports: "pass" },
    { ReportName: "System A Report", Date: 13 / 4 / 23, Reports: "pass" },
    { ReportName: "System A Report", Date: 13 / 4 / 23, Reports: "fail" },
    { ReportName: "System A Report", Date: 13 / 4 / 23, Reports: "pass" },
    { ReportName: "System A Report", Date: 13 / 4 / 23, Reports: "fail" },
    { ReportName: "System A Report", Date: 13 / 4 / 23, Reports: "pass" },
  ]

  constructor(
    public CF: CommonService,
    private fb: FormBuilder) {
  }

  ngOnInit() {


    this.GeneralForm = this.fb.group({
      VendorName: ["", Validators.required],
      FactoryName: ["", Validators.required],
      VendorNumber: ["", Validators.required],
      FactoryBusinessLicense: ["", Validators.required],
      agent: ["", Validators.required],
      FactoryID: ["", Validators.required],
      BrandName: ["", Validators.required],
      approvedSample: ["", Validators.required],
      SKU: ["", Validators.required],
      ReferenceSample: ["", Validators.required],
      ProductDescription: ["", Validators.required],
      CombinedSampling: ["", Validators.required],
      UPC: ["", Validators.required],
      PreviousInspction: ["", Validators.required],
      ProductPO: ["", Validators.required],
      ServicePerformed: ["", Validators.required],
      VendorStyle: ["", Validators.required],
      ProtocolNumber: ["", Validators.required],
      InspctionDate: ["", Validators.required],
      IFIversion: ["", Validators.required],
      InspectionLocation: ["", Validators.required],
      InspectionName: ["", Validators.required],
    })
    console.log(this.general_data[0])
    this.GeneralForm.patchValue({
      VendorName: this.general_data[0].Vendor_Name,
      FactoryName: this.general_data[0].FactoryName,
      VendorNumber: this.general_data[0].VendorNumber,
      FactoryBusinessLicense: this.general_data[0].FactoryBusinessLicense,
      agent: this.general_data[0].agent,
      FactoryID: this.general_data[0].FactoryID,
      BrandName: this.general_data[0].BrandName,
      approvedSample: this.general_data[0].approvedSample,
      SKU: this.general_data[0].Sku,
      ReferenceSample: this.general_data[0].ReferenceSample,
      ProductDescription: this.general_data[0].ProductDescription,
      CombinedSampling: this.general_data[0].CombinedSampling,
      UPC: this.general_data[0].Upc,
      PreviousInspction: this.general_data[0].PreviousInspction,
      ProductPO: this.general_data[0].ProductPO,
      ServicePerformed: this.general_data[0].ServicePerformed,
      VendorStyle: this.general_data[0].VendorStyle,
      ProtocolNumber: this.general_data[0].ProtocolNumber,
      InspctionDate: this.general_data[0].InspctionDate,
      IFIversion: this.general_data[0].IFIversion,
      InspectionLocation: this.general_data[0].InspectionLocation,
      InspectionName: this.general_data[0].Inspection_Name,

    })



  }
  general() {
    this.hidetable = true
  }

  BindTable_desc(name: any) {
    const t = $(name).DataTable();
    t.on("order.dt search.dt", function () {
      t.column(0, { search: "applied", order: "applied" })
        .nodes().each(function (cell, i: any) {
          cell.innerHTML = i + 1;
        });
    }).draw();
  }
  hideform = false
  next() {
    console.log(this.GeneralForm.value)
    this.hidetable = true
    this.hideform = true
  }
  public Allow_Only(event: any, formkey: any) {
    let data = this.GeneralForm.get(formkey).value;
    console.log(data.replace(/ /g, ''))
    if (data.replace(/ /g, '').length > 0) {
      console.log(1)
      if (data.charAt(0) !== ' ') {
        var myRegExp = new RegExp(event, 'g');
        // console.log(myRegExp)
        let name = data ? data.replace(myRegExp, "") : '';
        //  console.log(name);
        this.GeneralForm.patchValue({
          [formkey]: name
        });
      } else {
        this.GeneralForm.patchValue({
          [formkey]: ''
        });
      }
    } else {
      console.log(2)
      this.GeneralForm.patchValue({
        [formkey]: ''
      });
    }
  }

}
