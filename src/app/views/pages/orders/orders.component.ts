import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  selectedCTY: any = '';
  products: any = [];
  loader = false;
  ProductsData: any = [];

  constructor(
    private router: Router,
    private API: WebService,
    public CF: CommonService,
  ) { }

  ngOnInit(): void {
    this.get_Products();
  }

  get_Products() {
    this.loader = true;
    const body = {
      "procedureName": "AstroSP_ordermaster",
      "input1": "Get_ordermaster",
      "input2": JSON.stringify({ orderid: '' })
    }
    this.API.Common_API(body).then(((r: any) => {
      this.loader = false;
      console.log(r);
      if (r) {
        if (r.recordset[0].Result == 'True') {
          let Main_Data = r.recordset ? r.recordset : [];
          Main_Data.map((m: any) => m.Orderitems = (m.Orderitems ? JSON.parse(m.Orderitems) : ''));
          this.ProductsData = Main_Data
          console.log(this.ProductsData);
        } else {
          this.CF.ToastError('No data Avilable', '');
        }
      } else { }
    }))
  }

  Select_Product(item: any, data: any) {
    // console.log(data);
    // console.log(item);
    item.Orderid = data.Orderid;
    this.selectedCTY = item.productid;
    setTimeout(() => {
      localStorage.setItem('Product_Select', JSON.stringify(item));
      this.router.navigateByUrl('/schedule');
    }, 500);

  }

}
