import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-productsnew',
  templateUrl: './productsnew.component.html',
  styleUrls: ['./productsnew.component.scss']
})
export class ProductsnewComponent implements OnInit {
  validbutton = false;
  uploadingloading = false;

  FactoryForm: FormGroup;
  factorySubmitted = false;


  Categ_Info: any = [
    // { id: 1, name: "Shirt", selected: false },
    // { id: 2, name: "Pillow Case", selected: false },
    // { id: 3, name: "Rugs", selected: false },
    // { id: 4, name: "Dress", selected: false },
    // { id: 5, name: "T-Shirt", selected: false },
    // { id: 6, name: "Jeans", selected: false },
  ]
  selected_CategID = '';



  prodDetailsForm: any = FormGroup;
  ProdDetailsSub = false;
  Product_Images_Info: any = [
    { item_id: "Upload video", item_text: "Upload video" },
    { item_id: "Front view", item_text: "Front view" },
    { item_id: "Back view", item_text: "Back view" },
    { item_id: "Inside out front", item_text: "Inside out front" },
    { item_id: "Inside out back", item_text: "Inside out back" },
    { item_id: "Sticker", item_text: "Sticker" },
    { item_id: "Add New Parameter", item_text: "Add New Parameter" },
  ];

  Upload_Type=[  { item_id: "Image", item_text: "Image" },
  { item_id: "Video", item_text: "Video" },];

  // Fabric_Data: any = [{ item_id: 'Wool', item_text: 'Wool' }];


  PackDetailsForm: any = FormGroup;
  PackDetailsSub = false;
  Packing_Data: any = [{ item_id: 'Paper', item_text: 'Paper' }];

  Dimension_Data: any = [{ item_id: 'Custom', item_text: 'Custom' }];


  Packing_Images_Info: any = [
    { productimgtype: "Upload video", productimgurl: "" },
    { packingimgtype: "Front view", packingimgurl: "" },
    { packingimgtype: "Back view", packingimgurl: "" },
    { packingimgtype: "Inside out front", packingimgurl: "" },
    { packingimgtype: "Inside out back", packingimgurl: "" },
    { packingimgtype: "Sticker", packingimgurl: "" },
    { packingimgtype: "Add New Parameter", packingimgurl: "" },
  ]

  Carton_Images_Info: any = [
    { productimgtype: "Upload video", productimgurl: "" },
    { cartonimgtype: "Front view", cartonimgurl: "" },
    { cartonimgtype: "Back view", cartonimgurl: "" },
    { cartonimgtype: "Inside out front", cartonimgurl: "" },
    { cartonimgtype: "Inside out back", cartonimgurl: "" },
    { cartonimgtype: "Sticker", cartonimgurl: "" },
    { cartonimgtype: "Add New Parameter", cartonimgurl: "" },
  ]

  ProductsGrid = false;



  CategSelection = false;
  ProductDetails = false;
  FactorySelection = false;
  // PackingDetails = false;
  // CartonDetails = false;

  constructor(private fb: FormBuilder, public CF: CommonService, public API: WebService) { }


  ngOnInit() {

    this.FactoryForm = this.fb.group({
      Factory: ['', Validators.required]
    })

    this.prodDetailsForm = this.fb.group({
      ProductName: ['', Validators.required],
      StyleNo: ['', Validators.required],
      StyleName: ['', Validators.required],
      UPCNumber: ['', Validators.required],
      AvailableQuantity: ['', Validators.required],
      LedgerQuantity: ['', Validators.required],
      FabricType: ['', Validators.required],
      StoneWash: [''],
    });

    this.PackDetailsForm = this.fb.group({
      PackingMaterial: ['', Validators.required],
      Dimension: ['', Validators.required]
    });
    this.Get_Products();
    this.Get_Fabric();
    localStorage.removeItem('FactorySelection');
    localStorage.removeItem('CategSelection');
  }

  Add() {
    this.ProductsGrid = false;
    this.FactorySelection = true;
    this.Get_Factories();
    this.localStrorageGetFunction('FactorySelection');
  }



  onSelecteFactory() {

    let value:any = this.FactoryForm.value;

    this.localStrorageSetFunction('FactorySelection', JSON.stringify(value.Factory[0].item_id));
    this.CategSelection = true;
    this.ProductDetails = false;
    this.FactorySelection = false;

    this.selected_CategID = '';
    this.Get_Categories(value.Factory[0].item_id);
    this.localStrorageGetFunction('CategSelection');
    this.localStrorageGetFunction('FactorySelection');


  }

  onSelectCateg() {
    let DATA = this.Categ_Info.filter((r: any) => r.id == this.selected_CategID);
    console.log(DATA);
    this.localStrorageSetFunction('CategSelection', DATA);
    this.CategSelection = false;
    this.ProductDetails = true;
    this.FactorySelection = false;

    this.ProdDetailsSub=false;

    // this.PackingDetails = false;
    // this.CartonDetails = false;
  }

  ImageUploadFlag=false;
  OnSubmitProdInfo() {
    this.ProdDetailsSub = true;
    if (this.prodDetailsForm.invalid || this.Product_Images.length == 0) {
      this.ImageUploadFlag=true;
      return
    }
    else {
      let value = this.prodDetailsForm.value;
      let factoryvalue = this.FactoryForm.value;
      console.log(value);
      let Category: any = this.AllCategInfo.filter((r: any) => r.categoryid == this.selected_CategID);
      console.log(Category);
      let json = {
        categoryid: Category[0].categoryid,
        factoryid: factoryvalue.Factory.length > 0 ? factoryvalue.Factory[0].item_id :'' ,
        productname: value.ProductName,
        styleno: value.StyleNo,
        stylename: value.StyleName,
        upcnumber: value.UPCNumber,
        availableqty: value.AvailableQuantity,
        fabricid: value.FabricType.length > 0 ? Number(value.FabricType[0].item_id) : "",
        fabrictype: value.FabricType.length > 0 ? value.FabricType[0].item_text : "",
        stonewash: value.StoneWash ? value.StoneWash == true ? 1 : 0 : 0,
        createdby: this.CF.user.userid,
        status: 1,
        ImgDetails:this.Product_Images
      }
      console.log(json);
      const body = {
        "procedureName": "AstroSP_ProductMaster",
        "input1": "Insert_ProductMaster",
        "input2": JSON.stringify(json)
      }
      this.API.Common_API(body).then(r => {
        console.log(r);
        if (r) {
          if (r.recordset[0].Result == 'True') {
            this.CF.ToastSuccess(r.recordset[0].msg, 'Success');
            this.ResetProdInfo();
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


  OnSubmitPackInfo() {
    this.PackDetailsSub = true;
    if (this.PackDetailsForm.invalid) {
      this.CategSelection = false;
      this.ProductDetails = false;
      // this.PackingDetails = false;
      // this.CartonDetails = true;
      return
    }
    else {
      console.log(this.PackDetailsForm.value);
    }

  }

  BackProduct(type: any) {
    if (type == 'CategorySelection') {

      this.CategSelection = false;
      this.ProductDetails = false;
      this.FactorySelection = true;

      this.localStrorageGetFunction('FactorySelection')



      // this.PackingDetails = false;
      // this.CartonDetails = false;
    }
    else if (type == 'ProductDetails') {
      this.CategSelection = true;
      this.ProductDetails = false;
      this.FactorySelection = false;

      // this.PackingDetails = false;
      // this.CartonDetails = false;

    }
    else if (type == 'FactorySelection') {
      this.FactorySelection = false;
      this.CategSelection = false;
      this.ProductDetails = false;
      this.FactorySelection = false;
      this.Get_Products();
    }
  }

  ResetProdInfo() {
    this.CategSelection = false;
    this.ProductDetails = false;
    this.prodDetailsForm.reset();
    this.ProdDetailsSub = false;
    this.selected_CategID = '';
    localStorage.removeItem('CategSelection');
    localStorage.removeItem('FactorySelection');
    this.FactoryForm.reset();
    this.factorySubmitted=false;
    this.Get_Products();
    this.Product_Images=[];
    this.FileType='';
    this.ImageType='';
    this.UploadKey='';

  }

  public Allow_Only(event: any, formkey: any) {
    let data = this.prodDetailsForm.get(formkey)!.value;
    if (data.replace(/ /g, '').length > 0) {
      if (data.charAt(0) !== ' ') {
        var myRegExp = new RegExp(event, 'g');
        let name = data ? data.replace(myRegExp, "") : '';
        this.prodDetailsForm.patchValue({
          [formkey]: name
        });
      } else {
        this.prodDetailsForm.patchValue({
          [formkey]: ''
        });
      }
    } else {
      this.prodDetailsForm.patchValue({
        [formkey]: ''
      });
    }
  }

  onClick() { }


  localStrorageSetFunction(type: any, data: any) {
    if (type == 'CategSelection') {
      localStorage.setItem('CategSelection', JSON.stringify(data));
    }
    else if (type == 'FactorySelection') {
      localStorage.setItem('FactorySelection', JSON.stringify(data));


    }
  }

  localStrorageGetFunction(type: any) {
    if (type == 'CategSelection') {
      let Object = localStorage.getItem('CategSelection');
      let data = Object ? JSON.parse(Object) : "";
      // console.log(data,'Category');
      if (data) {
        this.selected_CategID = data.length ? data[0].id : "";
      }
      else {
        this.selected_CategID = "";
      }
    }
    else if(type == 'FactorySelection'){
      let Object:any = localStorage.getItem('FactorySelection');
      let data:any = Object ? JSON.parse(Object) : "";
      console.log(data);

      if (data != '') {
        let temp = this.FactoryData.filter((r:any)=> r.item_id == data );
        console.log(temp)
        this.FactoryForm.patchValue({
          Factory:temp
        })
      }
      else {
        this.factorySubmitted=false;
        this.FactoryForm.reset();
      }

    }
  }

  // ========================== Get Methods ==========================

  AllCategInfo = [];
  Get_Categories(id:any) {
    this.CF.isSpinnerVisible = true;
    const body = {
      "procedureName": "AstroSP_Category",
      "input1": "Get_Category",
      "input2": JSON.stringify({'factoryid':id})
    }
    this.API.Common_API(body).then((r => {
      this.CF.isSpinnerVisible = false;

      // console.log(r);
      if (r) {
        if (r.recordset[0].Result == 'True') {
          let data = r.recordset;
          this.AllCategInfo = data;
          this.Categ_Info = data.map((s: any) => ({
            id: s.categoryid,
            name: s.categoryname,
          }));
          // console.log(this.Categ_Info);
        } else { }
      } else { }
    }))
  }

  Products_Data: any = [];
  ProdLoader = false;

  Get_Products() {
    this.ProductsGrid = true;

    this.CF.isSpinnerVisible = true;
    this.ProdLoader = true;

    const body = {
      "procedureName": "AstroSP_ProductMaster",
      "input1": "Get_ProductMaster",
      "input2": "{\"productid\":\"\"}"
    }
    this.API.Common_API(body).then((r => {
      this.CF.isSpinnerVisible = false;
      this.ProdLoader = false;

      // console.log(r);
      if (r) {
        if (r.recordset[0].Result == 'True') {
          let data = r.recordset;
          this.Products_Data = data;
          console.log(this.Products_Data);
        } else { }
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

  Fabric_Data:any=[];
  Get_Fabric() {
    this.Fabric_Data = [];
    const body = {
      "procedureName": "AstroSP_FabricMaster",
      "input1": "Get_FabricMaster",
      "input2": JSON.stringify({fabicid:''})
    }
    this.API.Common_API(body).then((r => {
      console.log(r)
      if (r) {
        const Main_data = r.recordset;
        if (r.recordset[0].Result == 'True') {
          this.Fabric_Data = Main_data ? Main_data : [];
          this.Fabric_Data.map((f:any)=>{f.item_id = f.fabicid, f.item_text = f.fabicname })
          console.log(this.Fabric_Data);
        } else {
          this.CF.ToastError('NO DATA AVAILABLE..!', 'Error')
        }
      } else { }
    }))
  }

  // ==================================== Image Upload =================================

  Temp_ImgUrl: any;
  upload_Loader = false;
  Btn_Success = false;


  Product_Images:any=[];
  FileType:any='';
  ImageType:any='';
  UploadKey:any='';



  img_upload(data:any) {
    let files=data.target.files
    this.upload_Loader = true;
    this.Btn_Success = true;
    this.Temp_ImgUrl = "";
    let fileToUpload:any = files.item(0);
    var formData = new FormData();
    formData.append('fileKey', fileToUpload);
    this.API.uploadFile(formData).then((r:any) => {
      this.upload_Loader = false;
      this.Btn_Success = false;
      let Uploaded_Image = r.document;
      let data = JSON.stringify(Uploaded_Image).split(":")[1].split('}')[0].split('"').join('');
      let url = "https://vantaapi.meanhost.in/Uploadimage/" + data;
      this.Temp_ImgUrl = url;

      console.log(this.prodDetailsForm.value);

      let a:any = {
        "producttype":this.FileType[0].item_id,"producttypename":this.ImageType[0].item_id,"productimage_videourl":this.Temp_ImgUrl
      }
      this.Product_Images.push(a);

      setTimeout(() => {
        this.FileType='';
        this.ImageType='';
        this.UploadKey='';
      }, 100);

      console.log(this.Product_Images);
    })
  }

  RemoveImg(position:any){

  }

  onTypeDeSelect(){
    this.ImageType='';
    this.UploadKey='';
  }

  onImgTypeDeSelect(){
    this.UploadKey='';

  }

}
