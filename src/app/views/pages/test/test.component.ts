import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  Test_Register_Form:any= FormGroup;
  Submitted: boolean = false;
  Btn_Valid: boolean = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this), // MUST ensure `this` context is maintained
    eventClick: this.handleEventClick.bind(this),
    weekends: true,
    // events: [
    //   { title: 'Test Scheduled', date: '2023-01-01' },
    //   { title: 'Test Completed', date: '2023-01-02' },
    //   { title: 'Test Completed', date: '2023-01-20' }
    // ]
    initialDate: '2023-01-12',
    eventColor: 'green',
    events: [
      {
        title: 'All Day Event',
        start: '2023-01-01'
      },
      {
        title: 'Long Event',
        start: '2023-01-07',
        end: '2023-01-10',
        color: 'purple' // override!
      },
      // {
      //   groupId: '999',
      //   title: 'Repeating Event',
      //   start: '2023-01-09T16:00:00'
      // },
      // {
      //   groupId: '999',
      //   title: 'Repeating Event',
      //   start: '2023-01-16T16:00:00'
      // },
      {
        title: 'Conference',
        start: '2023-01-11',
        end: '2023-01-13',
        color: 'purple' // override!
      },
      {
        title: 'Meeting',
        start: '2023-01-12T10:30:00',
        end: '2023-01-12T12:30:00'
      },
      {
        title: 'Lunch',
        start: '2023-01-12T12:00:00'
      },
      {
        title: 'Meeting',
        start: '2023-01-12T14:30:00'
      },
      // {
      //   title: 'Birthday Party',
      //   start: '2023-01-13T07:00:00'
      // },
      // {
      //   title: 'Click for Google',
      //   url: 'http://google.com/',
      //   start: '2023-01-28'
      // }
    ]
  };

  Testers_Data = [{ item_id: 1004, item_text: "Tester 1" },]

  Product_Select: any;
  products: any = [];
  user: any;

  constructor(

    private router: Router,
    private fb: FormBuilder,
    public CF: CommonService,
    private ActivateRoute: ActivatedRoute,
    private API: WebService

  ) {

    const data1 = localStorage.getItem('User_Details');
    if(data1) {
      this.user = JSON.parse(data1);
      console.log(this.user);
    }
    const data = localStorage.getItem('Product_Select')
    this.Product_Select = data ? JSON.parse(data) : '';
    this.Product_Select ? this.getCustomers() : ""
  }

  ngOnInit() {
    this.Test_Register_Form = this.fb.group({
      Tester_Name: ['', Validators.required],
      Tester_date: ['', Validators.required],
      Tester_comments: ['', Validators.required],
    })
  }

  handleDateClick(arg:any) {
    // alert('date click! ' + arg.dateStr);
    // this.router.navigateByUrl('/products-details');
    this.router.navigateByUrl('/orders');
  }

  handleEventClick(arg:any) {
    // alert('date click! ' + arg.dateStr);
  }

  Tester_Details: any = '';
  On_Ticket_Submit(type: any) {
    if (type == 'Test_Submit') {
      console.log(this.Test_Register_Form)
      this.Submitted = true;
      if (!this.Test_Register_Form.invalid) {
        const values = this.Test_Register_Form.value;
        this.Btn_Valid = true;
        let a = {
          "orderid": this.Product_Select.Orderid,
          "productid": this.Product_Select.productid,
          "userid": values.Tester_Name[0].item_id.toString(),
          "testdatetime": values.Tester_date.replace(/T/g, " ") + ":44.773",
          "additionalcomments": values.Tester_comments,
          "createdby": this.user.userid//"100"
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

  ngOnDestroy() {
    localStorage.removeItem('Product_Select');
  }

  public Allow_Only(event: any, formkey: any) {
    let data = this.Test_Register_Form.get(formkey).value;
    console.log(data.replace(/ /g, ''))
    if (data.replace(/ /g, '').length > 0) {
      console.log(1);
      if (data.charAt(0) !== ' ') {
        var myRegExp = new RegExp(event, 'g');
        let name = data ? data.replace(myRegExp, "") : '';
        this.Test_Register_Form.patchValue({
          [formkey]: name
        });
      } else {
        this.Test_Register_Form.patchValue({
          [formkey]: ''
        });
      }
    } else {
      console.log(2)
      this.Test_Register_Form.patchValue({
        [formkey]: ''
      });
    }
  }

  loader = false;
  Customers_Data = [];
  getCustomers() {
    this.loader = true;

    const body = {
      "procedureName": "AstroSP_TestTransaction_Operations",
      "input1": "GetData",
      "input2": "{\"userid\":\"1003\"}"
    }

    return

    this.API.Common_API(body).then((r:any) => {
      this.loader = false;

      console.log(r);
      if (r) {
        console.log(r);

        return
        if (r.recordset[0].Result == 'True') {
          let data = r.recordset[0].Menudata ? JSON.parse(r.recordset[0].Menudata) : [];
          console.log(data)

          data ? this.Customers_Data = data : this.Customers_Data = [];
          this.Customers_Data.filter((r:any) => r.selected == 1 ? r.selected = true : r.selected = false);
          console.log(this.Customers_Data);
          // this.PrductsData ? this.PrductsData.filter(r=> r.moreinfo ? r.moreinfo = JSON.parse(r.moreinfo) : ""):"";
          // console.log(this.PrductsData)
        } else { }
      } else { }
    })
  }

}
