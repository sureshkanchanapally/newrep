import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {


  RolessData: any = [];
  No_Details1: boolean = false;
  Hide_Table1: boolean = true;
  Roles_Form:any= FormGroup;
  Submitted1: boolean = false;
  Btn_Loader1: boolean = false;
  Edit_Role_Data: any;

  Roles_Status1 = [
    { item_id: 1, item_text: "Active" },
    { item_id: 0, item_text: "InActive" }
  ]

  constructor(
    public CF: CommonService,
    private fb: FormBuilder,
    private API: WebService
  ) { }


  ngOnInit(): void {
    this.Roles_Form = this.fb.group({
      rolename: ['', Validators.required],
      status: ['', Validators.required],
      Description: ['', Validators.required],
    })
    this.Get_Roles_Data();
  }

   // ======================================  ROLES  =============================================

   menuItems: any = [];
   Get_AstroMenu() {
     const body = {
       "procedureName": "AstroSP_GetData",
       "input1": "GetDisplayMenu",
       "input2": JSON.stringify({role_id:''})
     }
     this.API.Common_API(body).then((r => {
       console.log(r);
       if (r) {
         if (r.recordset[0].Result == 'True') {
           let data = r.recordset[0].Menulist ? JSON.parse(r.recordset[0].Menulist) : [];
           console.log(data)
           data ? this.menuItems = data : this.menuItems = [];
         } else { }
       } else { }
     }))
   }

   Get_Menu_Access(role_id:any) {
    this.menuItems = [];
    const body = {
      "procedureName": "AstroSP_GetData",
      "input1": "Menulist",
      "input2": JSON.stringify({ role_id: role_id })
    }
    this.API.Common_API(body).then((res: any) => {
      console.log(res);
      if (res) {
        if (res.recordset[0].Result == "True") {
          const Main_Data = res.recordset[0] ? JSON.parse(res.recordset[0].roledata) : [];
          Main_Data.map((me: any) => {
            me.label = me.menuname; me.icon = 'home';
            me.link = me.menu_url; me.subItems = me.submenu;
            me.submenu.map((se: any) => {
              se.label = se.menuname;
              se.link = se.menu_url;
            })
          })
          console.log(Main_Data);
          this.menuItems = Main_Data
        }
      }
    })
  }

   Get_Roles_Data() {
     this.RolessData = [];
     this.No_Details1 = true;
     const body = {
       "procedureName": "AstroSP_RoleMaster",
       "input1": "Get_RoleMaster",
       "input2": JSON.stringify({roleid:''})
     }
     this.API.Common_API(body).then((res: any) => {
       console.log(res);
       this.No_Details1 = false;
       if (res.recordset[0].Result == 'True') {
         this.Hide_Table1 = true;
         this.RolessData = res.recordset;
       } else {
         this.CF.ToastError('No data found', 'Error');
       }
     })
   }

   Add_Roles() {
     this.Hide_Table1 = false;
     this.Edit_Role_Data = '';
     this.Submitted1 = false;
     this.Roles_Form.reset();
     this.Get_AstroMenu();

   }

   Back_Roles() {
     this.Hide_Table1 = true;
     this.Edit_Role_Data = '';
   }

   Edit_Roles(Item: any) {
     console.log(Item);
     this.Hide_Table1 = false;
     this.Edit_Role_Data = Item;
     if (Item) {
       const status_drp = this.Roles_Status1.filter((rs: any) => rs.item_id == Item.status);
       this.Roles_Form.patchValue({
         rolename: Item.rolename,
         status: status_drp
       });
      //  this.Get_AstroMenu(Item.roleid);
       this.Get_Menu_Access(Item.roleid)
     }
   }

   ChangeStatus(i: any, k: any, j: any) {
     this.menuItems.filter((re:any, index:any) => {
       if (i == index) {
         re.submenu.filter((ke:any, index1:any) => {
           if (index1 == k) {
             let temp = 0;
             ke.Menuevents.filter((je:any) => { je.status == 1 ? temp = temp + 1 : ""; })
             if (temp != 0) {
               ke.status = 1; re.status = 1;
             } else {
               ke.status = 0;
               let temp2 = 0;
               re.submenu.filter((m:any) => m.status == 1 ? temp2 = temp + 1 : "");
               temp2 != 0 ? re.status = 1 : re.status = 0;
             }
           }
         })
       }
     });
   }

   ChangeStatus1(i: any) {
     this.menuItems.filter((r: any, index: any) => {
       if (index == i) {
         let temp = 0;
         r.Menuevents.filter((k: any) => { k.status == 1 ? temp = temp + 1 : ""; });
         temp != 0 ? r.status = 1 : r.status =0;
       }

     })
   }

   On_Submit1() {
     this.Submitted1 = true;
     if (!this.Roles_Form.invalid) {
       this.Btn_Loader1 = true;
       const values = this.Roles_Form.value;
       const body = {
         "procedureName": "AstroSP_RoleMaster",
         "input1": "Insert_RoleMaster",
         "input2": JSON.stringify({
           rolename: values.rolename,
           createdby: this.CF.user.userid,
           status: values.status[0].item_id,
           description: values.Description,
           roledata: this.menuItems
         })
       }
       this.API.Common_API(body).then((res: any) => {
         this.Btn_Loader1 = false;
         console.log(res);
         if (res) {
          const data = res.recordset;
           if (res.recordset[0].Result == "True") {
             this.CF.ToastSuccess(data[0].msg, "Success");
             this.Get_Roles_Data();
             this.Hide_Table1 = true;
             this.Submitted1 = false;
             this.Roles_Form.reset();
           } else {
             this.CF.ToastError(data[0].msg, "Error");
           }
         }
       })
     }
   }

   On_Update1() {
     this.Submitted1 = true;
     if (!this.Roles_Form.invalid) {
       this.Btn_Loader1 = true;
       const values = this.Roles_Form.value;
       const body = {
         "procedureName": "AstroSP_RoleMaster",
         "input1": "Update_RoleMaster",
         "input2": JSON.stringify({
           roleid: this.Edit_Role_Data.roleid,
           rolename: values.rolename,
           status: values.status[0].item_id,
           roledata: this.menuItems
         })
       }
       this.API.Common_API(body).then((res: any) => {
         this.Btn_Loader1 = false;
         console.log(res);
         if (res) {
          const data = res.recordset;
           if (res.recordset[0].Result == "True") {
             this.CF.ToastSuccess(data[0].msg, "Success");
             this.Get_Roles_Data();
             this.Hide_Table1 = true;
             this.Submitted1 = false;
             this.Roles_Form.reset();
           } else {
             this.CF.ToastError(data[0].msg, "Error");
           }
         }
       })
     }
   }

}
