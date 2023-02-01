import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-schedule-qc',
  templateUrl: './schedule-qc.component.html',
  styleUrls: ['./schedule-qc.component.scss']
})
export class ScheduleQcComponent implements OnInit {
  Schedule_Form:any= FormGroup;
  Submitted: boolean = false;
  Btn_Valid: boolean = false;

  Product_Select: any;
  SOP_Data:any=[];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public CF: CommonService,
    private API: WebService
  ) { }

  ngOnInit(): void {
    this.Schedule_Form = this.fb.group({
      sopname: ['', Validators.required],
      qcname: ['', Validators.required],
      sc_date: ['', Validators.required],
      comments: ['', Validators.required],
    })

    const data = localStorage.getItem('Product_Select')
    this.Product_Select = data ? JSON.parse(data) : '';
    console.log(this.Product_Select);
    this.Product_Select ? this.getCustomers() : ""
  }

  Tester_Details: any = '';
  On_Ticket_Submit(type: any) {
    if (type == 'Test_Submit') {
      console.log(this.Schedule_Form)
      this.Submitted = true;
      if (!this.Schedule_Form.invalid) {
        const values = this.Schedule_Form.value;
        this.Btn_Valid = true;
        let a = {
          "orderid": this.Product_Select.Orderid,
          "productid": this.Product_Select.productid,
          "userid": values.Tester_Name[0].item_id.toString(),
          "testdatetime": values.Tester_date.replace(/T/g, " ") + ": 44.773",
          "additionalcomments": values.Tester_comments,
          "createdby": this.CF.user.userid
        }
        console.log(a);
        const body = {
          "procedureName": "AstroSP_TestTransaction_Operations",
          "input1": "Assign_Test",
          "input2": JSON.stringify(a),
        }
        console.log(body);
        this.API.Common_API(body).then((r:any) => {
          console.log(r);
          if (r) {
            if (r.recordset[0].Result == 'True') {
              this.CF.ToastSuccess(r.recordset[0].msg, 'Success');
              this.Submitted = false;
              localStorage.removeItem('Product_Select');
              setTimeout(() => {
                location.reload();
              }, 100);
            } else {
              this.Submitted = false;
              this.CF.ToastError('something went wrong', 'Success');
            }
          } else { }
        })
      } else {
        return
      }
    }
  }

  getCustomers() {

  }

  ngOnDestroy() {
    localStorage.removeItem('Product_Select');
  }

}
