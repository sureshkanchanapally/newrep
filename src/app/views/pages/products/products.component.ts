import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CommonService } from '../../Services/common.service';
import { CompressImageService } from '../../Services/compress-image.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  loader = false;
  ProductStatus = true;
  PackStatus = false;
  CartonStatus = false;
  Step1 = true;
  Step1Regform = true;
  Step1Products = false;
  Step1ProductsDetails = false;
  Step1ProductInfo = false;
  Step2 = false;
  Step2Packing = false;
  Step2Carton = false;
  selected_P: any;
  OrderRegistrationForm: FormGroup;
  Submitted = false;
  ProductInfoForm: FormGroup;
  ProductInfoSubmitted = false;
  CartonForm: FormGroup;
  CartonSubmitted = false;
  PackingForm: FormGroup;
  PackingSubmitted = false;
  InsertDisabled = true;
  Reg_Info: any;
  Products: any = [];

  Customer_Data: any = [];

  products_Info: any = [
    { id: 1, name: "Shirt", selected: false },
    { id: 2, name: "Pillow Case", selected: false },
    { id: 3, name: "Rugs", selected: false },
    { id: 4, name: "Dress", selected: false },
    { id: 5, name: "T-Shirt", selected: false },
    { id: 6, name: "Jeans", selected: false },
  ]

  a = 'assets/images/540-540.jpg'

  Product_Images_Info: any = [
    { productimgtype: "Front view", productimgurl: this.a },
    { productimgtype: "Back view", productimgurl: this.a },
    { productimgtype: "Inside out front", productimgurl: this.a },
    { productimgtype: "Inside out back", productimgurl: this.a },
    { productimgtype: "Sticker", productimgurl: this.a },
    { productimgtype: "Add New Parameter", productimgurl: this.a },
  ]

  Packing_Images_Info: any = [
    { packingimgtype: "Front view", packingimgurl: this.a },
    { packingimgtype: "Back view", packingimgurl: this.a },
    { packingimgtype: "Inside out front", packingimgurl: this.a },
    { packingimgtype: "Inside out back", packingimgurl: this.a },
    { packingimgtype: "Sticker", packingimgurl: this.a },
    { packingimgtype: "Add New Parameter", packingimgurl: this.a },
  ]

  Carton_Images_Info: any = [
    { cartonimgtype: "Front view", cartonimgurl: this.a },
    { cartonimgtype: "Back view", cartonimgurl: this.a },
    { cartonimgtype: "Inside out front", cartonimgurl: this.a },
    { cartonimgtype: "Inside out back", cartonimgurl: this.a },
    { cartonimgtype: "Sticker", cartonimgurl: this.a },
    { cartonimgtype: "Add New Parameter", cartonimgurl: this.a },
  ]

  constructor(
    private fb: FormBuilder,
    private compressImage: CompressImageService,
    private router: Router,
    private API: WebService,
    public CF: CommonService,
  ) {
    this.Get_Customers()

  }

  ngOnInit() {
    this.OrderRegistrationForm = this.fb.group({
      PO_Number: ["", Validators.required],
      Customer: ["", Validators.required],
      Issue_date: ["", Validators.required],
      Ship_date: ["", Validators.required],
      No_of_Products: ["", Validators.required],
    });

    this.ProductInfoForm = this.fb.group({
      Name: ["", Validators.required],
      SKU: ["", Validators.required],
      Size: ["", Validators.required],
      Fabric: ["", Validators.required],
      Color: ["", Validators.required],
      Lotsize: ["", Validators.required],
      AQL: ["", Validators.required],
    });

    this.PackingForm = this.fb.group({
      Packingmaterial: ["", Validators.required],
      Dimension: ["", Validators.required],
    });

    this.CartonForm = this.fb.group({
      Cartontype: ["", Validators.required],
      CartonDimension: ["", Validators.required],
      Numberofpackages: ["", Validators.required]
    });
  }

  Get_Customers() {
    this.Customer_Data = [];
    const body = {
      // "procedureName": "AstroSP_CustomerOperations",
      // "input1": "Get_CustData",
      // "input2": ""
      "procedureName": "AstroSP_usermaster",
      "input1": "GetUsers",
      "input2": ""
    }
    this.API.Common_API(body).then((r => {
      console.log(r);
      if (r) {
        if (r.recordset[0].Result == 'True') {
          this.Customer_Data = r.recordset;
          // this.Customer_Data.map((cu: any) => { cu.item_id = cu.CustId, cu.item_text = cu.CustName });
          const main_data = r.recordset ? JSON.parse(r.recordset.data) : []
          this.Customer_Data = main_data.map((cu: any) => { cu.item_id = cu.userid, cu.item_text = cu.username });
          this.LocalStorageGetFunction('Step1Regform');
          // this.StepperStatusChecker();
        } else {
          this.CF.ToastError('No customer available', 'Error');
          this.LocalStorageGetFunction('Step1Regform');
        }
      } else {
        this.CF.ToastError('Something went wrong', 'Error');
        this.LocalStorageGetFunction('Step1Regform');
      }
    }))
  }

  ngOnDestroy(): any {
    localStorage.removeItem('Step1Regform');
    localStorage.removeItem('Step1Products');
  }

  // ================================== Submit Functions ==========================

  on_SubRegistration() {
    this.Submitted = true;
    if (this.OrderRegistrationForm.invalid) {
      return
    } else {
      this.Reg_Info = this.OrderRegistrationForm.value;
      let Object = localStorage.getItem('Step1Products');
      let a = Object ? JSON.parse(Object) : "";
      if (a) {
        if (a.length == this.Reg_Info.No_of_Products) {
          this.Products = a;
          this.Step1Regform = false;
          this.Step1Products = true;
          this.Step1ProductInfo = false;
          this.Step1ProductsDetails = false;
        } else {
          let count = this.Reg_Info.No_of_Products - a.length;
          this.Products = a;
          for (let i = 0; count > 0 ? i < count : i > count; count > 0 ? i++ : i--) {
            let a = { id: (this.Products.length) + 1, Product: [] }
            count > 0 ? this.Products.push(a) : this.Products.pop();
          }
          this.Step1Regform = false;
          this.Step1Products = true;
          this.Step1ProductInfo = false;
          this.Step1ProductsDetails = false;
        }
      } else {
        this.Step1Regform = false;
        this.Step1Products = true;
        this.Step1ProductInfo = false;
        this.Step1ProductsDetails = false;
        this.Products = [];
        for (let i = 0; i < this.Reg_Info.No_of_Products; i++) {
          let a = { id: i + 1, Product: [] }
          this.Products.push(a);
        }
      }
      this.LocalStorageSetFunction('Step1Regform', JSON.stringify(this.Reg_Info));
      this.LocalStorageSetFunction('Step1Products', JSON.stringify(this.Products));
      this.MakeInsertActive();
      // console.log(this.Products);
    }
  }

  on_SubAddProduct(position: any) {
    this.Step1Regform = false;
    this.Step1Products = false;
    this.Step1ProductInfo = false;
    this.Step1ProductsDetails = true;
    this.Make_Step2_Inactive();
    this.selected_P = "";
    this.Products.filter((r: any, index: any) => index == position ? r.ActiveStatus = 1 : r.ActiveStatus = 0);
    this.LocalStorageSetFunction('Step1Products', JSON.stringify(this.Products));
    this.LocalStorageGetFunction('Step1ProductsDetails');
  }

  on_SelectProduct() {
    let obj = this.products_Info.filter((k: any) => k.id == this.selected_P);
    this.Products.filter((r: any, index: any) => r.ActiveStatus == 1 ? r.Product = obj : "");
    this.Step1ProductsDetails = false;
    this.Step1ProductInfo = true;
    this.Step1Regform = false;
    this.Step1Products = false;
    this.LocalStorageSetFunction('Step1Products', JSON.stringify(this.Products));
    this.LocalStorageGetFunction('Step1ProductInfo');
  }

  on_SubProductinfo() {
    this.ProductInfoSubmitted = true;
    if (this.ProductInfoForm.invalid) {
      return;
    } else {
      let Data = this.ProductInfoForm.value;
      this.Products.filter((r: any) => r.ActiveStatus == 1 ? r.Products_Info = Data : "");
      this.LocalStorageSetFunction('Step1Products', JSON.stringify(this.Products));
      console.log(this.Products);
      this.LocalStorageGetFunction('Step2Packing')
      this.Make_Step1_Inactive();
      this.Step2Packing = true;
      this.Step2Carton = false;
    }
  }

  on_SubPacking() {
    this.PackingSubmitted = true;
    if (this.PackingForm.invalid) {
      return;
    } else {
      let Data = this.PackingForm.value;
      this.Products.filter((r: any) => r.ActiveStatus == 1 ? r.Packing_Info = Data : "");
      this.LocalStorageSetFunction('Step1Products', JSON.stringify(this.Products));
      this.LocalStorageGetFunction('Step2Carton')
      this.Step2Packing = false;
      this.Step2Carton = true;
    }
  }

  on_SubCarton() {
    this.CartonSubmitted = true;
    if (this.CartonForm.invalid) {
      return;
    } else {
      let Data = this.CartonForm.value;
      this.Products.filter((r: any) => r.ActiveStatus == 1 ? (r.Carton_Info = Data, r.completedStatus = 1) : "");
      this.LocalStorageSetFunction('Step1Products', JSON.stringify(this.Products));
      console.log(this.Products);
      this.Step1Regform = false;
      this.Step1Products = true;
      this.Step1ProductsDetails = false;
      this.Step1ProductInfo = false;
      this.Make_Step2_Inactive();
      this.MakeInsertActive()
    }
  }

  MakeInsertActive() {
    let temp = 0;
    this.Products.filter((r: any) => r.completedStatus == 1 ? temp = temp + 1 : "");
    // console.log(this.Products.length);
    // console.log(temp)
    if (this.Products.length == temp) {
      this.InsertDisabled = false;
    } else {
      this.InsertDisabled = true;
    }
  }

  insert_Order() {
    // let a = {
    //   "Orderid": "",
    //   "Poordernumber": "",
    //   "customer": "",
    //   "issueDatetime": "",
    //   "shipdatetime": "",
    //   "noofproducts": "",
    //   "createdby": "",
    //   "status": 1,

    //   "OrderDetails": [
    //     {
    //       "productid": 1,
    //       "productname": "Test ",
    //       "productdiscription": "Testing",
    //       "productbrand": "TestBrand",
    //       "sku": "Sku123",
    //       "size": 10,
    //       "fabric": "Cotton",
    //       "color": "White",
    //       "lotsize": 10,
    //       "AQL": 4,
    //       "createdby": "12",
    //       "status": 1,
    //       "ProductImages": [{ "productimgtype": "Test ", "productimgurl": "Testing" }],
    //       "PackingDetails": [{
    //         "packingmaterial": "TestPackMaterial ", "dimension": "TestPackdimension",
    //         "PackingImages": [{ "packingimgtype": "Test_packingimgtype", "packingimgurl": "Test_packingimgurl" }]
    //       }],
    //       "Cartondetails": [{
    //         "cartontype": "Testcartontype ", "dimension": "Testcartdimension", "noofpackages": 2,
    //         "CartonImages": [{ "cartonimgtype": "Test_cartonimgtype", "cartonimgurl": "Test_cartonimgurl" }]
    //       }]
    //     }
    //   ]
    // }

    let Object = localStorage.getItem('Step1Regform');
    let Object1 = localStorage.getItem('Step1Products');
    let OrderInfo = Object ? JSON.parse(Object) : "";
    let ProductInfo = Object1 ? JSON.parse(Object1) : [];
    console.log(OrderInfo);
    console.log(ProductInfo);

    if (OrderInfo && ProductInfo.length) {
      let Temp: any = [];
      ProductInfo.filter((r: any) => {
        let PRODUCT_IMG = [];
        let PACKING_IMG = [];
        let CARTON_IMG = [];
        PRODUCT_IMG = this.Product_Images_Info;
        PACKING_IMG = this.Packing_Images_Info;
        CARTON_IMG = this.Carton_Images_Info;
        let OBJ = {
          "productid": r.id,
          "productname": r.Products_Info.Name,
          "productdiscription": "Testing",
          "productbrand": "TestBrand",
          "sku": r.Products_Info.SKU,
          "size": r.Products_Info.Size,
          "fabric": r.Products_Info.Fabric,
          "color": r.Products_Info.Color,
          "lotsize": r.Products_Info.Lotsize,
          "AQL": r.Products_Info.AQL,
          "createdby": "12",
          "status": 1,
          "ProductImages": PRODUCT_IMG,
          "PackingDetails": [{
            "packingmaterial": r.Packing_Info.Packingmaterial,
            "dimension": r.Packing_Info.Dimension,
            "PackingImages": PACKING_IMG
          }],
          "Cartondetails": [{
            "cartontype": r.Carton_Info.Cartontype,
            "dimension": r.Carton_Info.CartonDimension,
            "noofpackages": r.Carton_Info.Numberofpackages,
            "CartonImages": CARTON_IMG
          }]
        }
        Temp.push(OBJ);
      })
      const Json = {
        "Orderid": "",
        "Poordernumber": OrderInfo.PO_Number,
        "customer": OrderInfo.Customer[0].item_id,
        "issueDatetime": OrderInfo.Issue_date,
        "shipdatetime": OrderInfo.Ship_date,
        "noofproducts": OrderInfo.No_of_Products,
        "createdby": "",
        "status": 1,
        "OrderDetails": Temp
      }
      console.log(Json);
      const body = {
        "procedureName": "AstroSP_OrderProcess",
        "input1": "Insert",
        "input2": JSON.stringify(Json)
      }
      console.log(body);
      this.API.Common_API(body).then((r => {
        console.log(r);
        if (r) {
          if (r.recordset[0].Result == 'True') {
            this.CF.ToastSuccess(r.recordset[0].msg, 'Success');
            localStorage.removeItem('Step1Regform');
            localStorage.removeItem('Step1Products');
            this.router.navigateByUrl('/products-details')
          } else {
            this.CF.ToastSuccess('something went wrong', 'Success')
          }
        } else { }
      }))
    }
  }

  // ================================== Back Functions ==========================

  onBack(flag: any) {
    if (flag == 'Step1Products') {
      this.Step1Regform = true;
      this.Step1Products = false;
      this.Step1ProductsDetails = false;
      this.Step1ProductInfo = false;
    } else if (flag == 'Step1ProductsDetails') {
      this.Step1Regform = false;
      this.Step1Products = true;
      this.Step1ProductsDetails = false;
      this.Step1ProductInfo = false;
    } else if (flag == 'Step1ProductInfo') {
      this.Step1Regform = false;
      this.Step1Products = false;
      this.Step1ProductsDetails = true;
      this.Step1ProductInfo = false;
    } else if (flag == 'Step2Packing') {
      this.Make_Step2_Inactive();
      this.Step1Regform = false;
      this.Step1Products = false;
      this.Step1ProductsDetails = false;
      this.Step1ProductInfo = true;
    } else if (flag == 'Step2Carton') {
      this.Make_Step1_Inactive();
      this.Step2Packing = true;
      this.Step2Carton = false;
    }
    this.StepperStatusChecker();
  }

  Make_Step1_Inactive() {
    this.Step1 = false;
    this.Step1Regform = false;
    this.Step1Products = false;
    this.Step1ProductInfo = false;
    this.Step1ProductsDetails = false;
    this.Step2 = true;
  }

  Make_Step2_Inactive() {
    this.Step2 = false;
    this.Step2Packing = false;
    this.Step2Carton = false;
    this.Step1 = true;
  }

  // ================================== Image Functions ==========================

  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  progress: Observable<any>;

  // onClick(qid: any = 1) {

  //   const fileUpload = this.fileUpload.nativeElement;
  //   fileUpload.onchange = () => {

  //     if ((fileUpload.files[0].type).includes('image')) {
  //       if (fileUpload.files[0].size < 1100000) {
  //         // console.log(`Image size after compressed: ${fileUpload.files[0].size} bytes.`)
  //         // console.log(fileUpload.files[0])
  //         this.count = 0;
  //         this.compress1(fileUpload.files[0]);
  //       } else {
  //         this.CF.ToastError('Image size should be less then 1 MB', 'Error')
  //       }

  //     } else {
  //       this.CF.ToastError('Accept only image', 'Error')
  //     }
  //   };
  //   fileUpload.click();


  // }

  uploadingloading: boolean = false;
  onClick() {

  }
  // count = 0;
  // compress1(file: any) {


  //   this.uploadingloading = true;
  //   this.compressImage.compress(file)
  //     .pipe(take(1))
  //     .subscribe(compressedImage => {
  //       // console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
  //       // now you can do upload the compressed image
  //       if (compressedImage.size < 200000) {
  //         // console.log(compressedImage)
  //         this.fileUpload.nativeElement.value = ""
  //         this.uploadFile1({ data: compressedImage, inProgress: false, progress: 0 });
  //         // this.uploadfiles.push({ data: file, inProgress: false, progress: 0 });
  //         // return compressedImage
  //       } else {
  //         this.count = this.count + 1;
  //         if (this.count > 50) {
  //           // console.log(compressedImage)
  //           this.fileUpload.nativeElement.value = "";
  //           // this.uploadfiles.push({ data: file, inProgress: false, progress: 0 });
  //           this.uploadFile1({ data: compressedImage, inProgress: false, progress: 0 });
  //         } else {
  //           this.compress1(compressedImage);
  //         }
  //       }
  //     })
  // }

  // progress: Observable<any>;

  // uploadFile1(file: any) {
  //   const formData = new FormData();
  //   formData.append("file", file.data);
  //   this.API.Image(formData).pipe(map((event: any) => {
  //     switch (event.type) {
  //       case HttpEventType.UploadProgress:
  //         this.progress = of(
  //           Math.round((event.loaded * 100) / event.total));
  //         break;
  //       case HttpEventType.Response:
  //         this.progress = of(0);
  //         return event;
  //     }
  //   }),
  //     catchError((error: HttpErrorResponse) => {
  //       file.inProgress = false;
  //       return of(`${file.data.name} upload failed.`);
  //     })
  //   ).subscribe((event: any) => {
  //     console.log(event)
  //     if (typeof event === "object") {
  //       return

  //       const Url = event.body.document;
  //       console.log(Url);
  //       let ke = Object.keys(Url)[0];
  //       console.log(ke[0]);
  //       // this.fileurl = Url[ke];
  //       // console.log(this.fileurl);
  //     }
  //   });
  // }

  onClick_img() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      const file = fileUpload.files;
      console.log(file);
      const formData = new FormData();
      formData.append("image", file[0]);
      console.log(formData);
      // return;
      // this.fileUpload.nativeElement.value = "";
      // { responseType: 'text' }
      this.API.Image_Uploade(formData).pipe(map((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress = of(
              Math.round((event.loaded * 100) / event.total));
            break;
          case HttpEventType.Response:
            this.progress = of(0);
            return event;
        }
      }),
        catchError((error: HttpErrorResponse) => {
          console.log(error)
          console.log(file)
          file.inProgress = false;
          return of(`${file[0].name} upload failed.`);
        })).subscribe((res: any) => {
          console.log(res);
        });
    };
    fileUpload.click();

  }

  // ======================================== LOCAL STOTAGE FUNCTIONS =======================================


  LocalStorageSetFunction(key: any, value: any) {
    if (key == 'Step1Regform') {
      localStorage.setItem('Step1Regform', value);
    } else if (key == 'Step1Products') {
      localStorage.setItem('Step1Products', value);
    }
  }

  LocalStorageGetFunction(key: any) {
    if (key == 'Step1Regform') {
      let Object = localStorage.getItem('Step1Regform');
      let data = Object ? JSON.parse(Object) : "";
      if (data) {
        console.log(data);
        console.log(this.Customer_Data)
        let Cust_Id = this.Customer_Data ? this.Customer_Data.filter((cu: any) => cu.CustId == data.Customer[0].CustId) : [];
        console.log(Cust_Id);
        this.OrderRegistrationForm.patchValue({
          PO_Number: data.PO_Number,
          Customer: Cust_Id,
          Issue_date: data.Issue_date,
          Ship_date: data.Ship_date,
          No_of_Products: data.No_of_Products,
        });
      } else { this.OrderRegistrationForm.reset(); }
    } else if (key == 'Step1Products') {
      let Object = localStorage.getItem('Step1Products');
      let data = Object ? JSON.parse(Object) : "";
      this.Products = data;
    } else if (key == 'Step1ProductsDetails') {
      let Object = localStorage.getItem('Step1Products');
      let data = Object ? JSON.parse(Object) : "";
      this.Products = data;
      if (this.Products) {
        let SelectedProd: any;
        this.Products.filter((r: any) => r.ActiveStatus == 1 ? SelectedProd = r : "");
        // console.log(SelectedProd);
        SelectedProd.Product ? SelectedProd.Product.length ? this.selected_P = SelectedProd.Product[0].id : "" : "";
      }
    } else if (key == 'Step1ProductInfo') {
      let Object = localStorage.getItem('Step1Products');
      let data = Object ? JSON.parse(Object) : "";
      this.Products = data;
      if (this.Products) {
        let SelectedProd: any;
        this.Products.filter((r: any) => r.ActiveStatus == 1 ? SelectedProd = r : "");
        // console.log(SelectedProd);
        if (SelectedProd.Products_Info) {
          this.ProductInfoForm.patchValue({
            Name: SelectedProd.Products_Info.Name,
            SKU: SelectedProd.Products_Info.SKU,
            Size: SelectedProd.Products_Info.Size,
            Fabric: SelectedProd.Products_Info.Fabric,
            Color: SelectedProd.Products_Info.Color,
            Lotsize: SelectedProd.Products_Info.Lotsize,
            AQL: SelectedProd.Products_Info.AQL,
          });
        } else { this.ProductInfoForm.reset(); this.ProductInfoSubmitted = false; }
      }
    } else if (key == 'Step2Packing') {
      let Object = localStorage.getItem('Step1Products');
      let data = Object ? JSON.parse(Object) : "";
      this.Products = data;
      if (this.Products) {
        let SelectedProd: any;
        this.Products.filter((r: any) => r.ActiveStatus == 1 ? SelectedProd = r : "");
        // console.log(SelectedProd);
        if (SelectedProd.Packing_Info) {
          this.PackingForm.patchValue({
            Packingmaterial: SelectedProd.Packing_Info.Packingmaterial,
            Dimension: SelectedProd.Packing_Info.Dimension
          });
        } else { this.PackingForm.reset(); this.PackingSubmitted = false; }
      }
    } else if (key == 'Step2Carton') {
      let Object = localStorage.getItem('Step1Products');
      let data = Object ? JSON.parse(Object) : "";
      this.Products = data;
      if (this.Products) {
        let SelectedProd: any;
        this.Products.filter((r: any) => r.ActiveStatus == 1 ? SelectedProd = r : "");
        // console.log(SelectedProd);
        if (SelectedProd.Carton_Info) {
          this.CartonForm.patchValue({
            Cartontype: SelectedProd.Carton_Info.Cartontype,
            CartonDimension: SelectedProd.Carton_Info.CartonDimension,
            Numberofpackages: SelectedProd.Carton_Info.Numberofpackages,
          });
        } else { this.CartonForm.reset(); this.CartonSubmitted = false; }
      }
    }
  }

  StepperStatusChecker() {
    this.ProductCheck() == true ? this.ProductStatus = true : "";
    this.PackCheck() == true ? this.PackStatus = true : this.PackStatus = false;
    this.CartonCheck() == true ? this.CartonStatus = true : this.CartonStatus = false;
  }

  ProductCheck() {
    if (this.OrderRegistrationForm.valid || this.ProductInfoForm.valid) {
      this.LocalStorageGetFunction('Step1Regform');
      this.LocalStorageGetFunction('Step1Products');
      this.LocalStorageGetFunction('Step1ProductInfo');
      return true;
    } else {
      return false;
    }
  }

  PackCheck() {
    this.LocalStorageGetFunction('Step2Packing');
    if (this.PackingForm.valid || (this.Step2Packing == true && this.Step2 == true)) {
      return true
    } else {
      return false
    }
  }

  CartonCheck() {
    this.LocalStorageGetFunction('Step2Carton');
    if (this.CartonForm.valid || (this.Step2Carton == true && this.Step2 == true)) {
      return true
    } else {
      return false
    }
  }

  onNavigate(type: any) {
    if (type == 'ProductStatus') {
      this.StepperStatusChecker();
      this.Make_Step2_Inactive();
      this.Step1Regform = false;
      this.Step1Products = false;
      this.Step1ProductInfo = false;
      this.Step1ProductsDetails = true;
    } else if (type == 'PackStatus') {
      this.StepperStatusChecker();
      if (this.OrderRegistrationForm.valid && this.ProductInfoForm.valid) {
        this.Make_Step1_Inactive();
        this.Step2Packing = true;
        this.Step2Carton = false;
        this.PackStatus = true;
      }
    } else if (type == 'CartonStatus') {
      this.StepperStatusChecker();
      if (this.PackingForm.valid) {
        this.Make_Step1_Inactive();
        this.Step2Packing = false;
        this.Step2Carton = true;
      }
    }
  }

}
