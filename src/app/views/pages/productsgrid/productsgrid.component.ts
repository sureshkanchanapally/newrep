import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';
import { ProductItems } from './productsgrid'

@Component({
  selector: 'app-productsgrid',
  templateUrl: './productsgrid.component.html',
  styleUrls: ['./productsgrid.component.scss']
})
export class ProductsgridComponent implements OnInit {
  selectedCTY: any = '';
  products: any = [];
  loader = false;

  constructor(
    private router: Router,
    private API: WebService,
    public CF: CommonService,
  ) { }

  ngOnInit() {
    this.products = ProductItems.Products;
    this.get_Products();
    console.log(this.selectedCTY)
  }


  Select_Product(item: any, data: any) {
    // console.log(data);
    // console.log(item);

    item.Orderid = data.Orderid;
    this.selectedCTY = item.productid;
    setTimeout(() => {
      localStorage.setItem('Product_Select', JSON.stringify(item));
      this.router.navigateByUrl('/test');
    }, 500);

  }

  Add_Product() {
    this.router.navigateByUrl('/products');
  }

  PrductsData: any = [];

  get_Products() {
    this.loader = true;
    const body = {
      "procedureName": "AstroSP_ordermaster",
      "input1": "Get_ordermaster",
      "input2": ""
    }
    // console.log(body);
    this.API.Common_API(body).then(((r: any) => {
      this.loader = false;

      console.log(r);
      if (r) {
        if (r.recordset[0].Result == 'True') {

          let data = r.recordset[0].orderdetails ? JSON.parse(r.recordset[0].orderdetails) : [];


          this.PrductsData = data ? data : [];

          this.PrductsData ? this.PrductsData.filter((r: any) => r.moreinfo ? r.moreinfo = JSON.parse(r.moreinfo) : "") : "";
          console.log(this.PrductsData)
          // this.PrductsData = this.PrductsData.filter(r=> r.Orderid != 1001);
        } else { }
      } else { }
    }))
    // this.API.Common_API(body).then((res: any) => {
  }
}
