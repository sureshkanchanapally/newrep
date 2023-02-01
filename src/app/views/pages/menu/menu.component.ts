import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../Services/common.service';
import { WebService } from '../../Services/Webservice.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  user: any;
  Roles_Data: any = [];

  constructor(
    public CF: CommonService,
    private API: WebService
  ) {
    const data = localStorage.getItem('User_Details');
    if (data) {
      this.user = JSON.parse(data);
      console.log(this.user);
    }
  }

  ngOnInit() {
    // this.Get_Menu();
    // this.get();
    this.Get_Roles();
  }

  Get_Roles() {
    const body = {
      "procedureName": "AstroSP_RoleMaster",
      "input1": "get",
      "input2": "{}"
    }
    this.API.Common_API(body).then((res => {
      if (res) {
        if (res.recordset[0].Result == 'True') {
          this.Roles_Data = res.recordset ? res.recordset : [];
          this.Roles_Data.map((rs: any) => { rs.item_id = rs.roleid, rs.item_text = rs.rolename })
        } else {
          this.CF.ToastError('No data found', 'Error');
        }
      } else {
        this.CF.ToastError('Something wen wrong', 'Error');
      }
    }))
  }


  onItemSelect(Item:any) {
    this.Get_AstroMenu(Item.item_id)
  }

  loader = false;
  Menu_Data:any = [];
  Get_AstroMenu(role_id:any) {
    this.loader = true;
    const body = {
      "procedureName": "AstroSP_GetData",
      "input1": "GetDisplayMenu",
      "input2": JSON.stringify({ role_id: role_id })
    }
    this.API.Common_API(body).then((r => {
      this.loader = false;
      if (r) {
        if (r.recordset[0].Result == 'True') {
          let data = r.recordset[0].Menudata ? JSON.parse(r.recordset[0].Menudata) : [];
          console.log(data)
          data ? this.Menu_Data = data : this.Menu_Data = [];
          // this.Menu_Data.filter(r => r.selected == 1 ? r.selected = true : r.selected = false);


          this.Menu_Data.forEach((element:any) => {
            element.selected == 1 ? element.selected = true : element.selected = false
            element['Show'] = true;
            // element.submenu = [];
            // if (element.submenu.length > 0) {
            //   element.submenu.forEach(elm => {
            //     elm['Show'] = true;
            //     if (elm.submenu.length > 0) {
            //       elm.submenu.forEach(el => {
            //         el['Show'] = true;
            //       });
            //     }
            //   });
            // }
          });
        } else { }
      } else { }
    }))
  }

  Check(itm:any) {
    itm.Show = !itm.Show;
  }


  onUpdate() {
    let temp:any = [];
    this.Menu_Data.filter((r:any) => {
      let a = {
        "value": r.menuid,
        "label": r.menuname,
        "selected": r.selected,
        // "children": []
      }
      temp.push(a);
    })
    console.log(temp);
    setTimeout(() => {
      if (temp.length != 0) {
        const body = {
          "procedureName": "AstroSP_GetData",
          "input1": "UpdateMenuManagement",
          "input2": JSON.stringify({
            "role_id": this.user.roleid,
            "menujson": temp
          })
        }
        console.log(body);
        console.log(JSON.parse(body.input2));
        this.API.Common_API(body).then((r => {
          console.log(r);
          if (r) {
            if (r.recordset[0].Result == 'True') {
              this.CF.ToastSuccess(r.recordset[0].msg, 'Success');
            } else {
              this.CF.ToastSuccess('something went wrong', 'Success')
            }
          } else { }
        }))
      } else {
        this.CF.ToastSuccess('something went wrong', 'Success')
      }
    }, 200);
  }





  // ---------------------------------------------------- Old Menu -------------------------------------
  // data: any;
  // get() {
  //   this.data = {
  //     "Status_cd": "1", "Data":
  //       [
  //         {
  //           "id": "108",
  //           "path": "/dashboard",
  //           "title": "Stock Counting",
  //           "icon": "icon-Notepad",
  //           "type": "collapsable",
  //           "extralink": false,
  //           "actions": null,
  //           "submenu": [{
  //             "id": "111",
  //             "path": "/dashboard",
  //             "title": "Dashboard",
  //             "icon": "dashboard",
  //             "type": "item",
  //             "extralink": false,
  //             "actions": null,
  //             "submenu": []
  //           },
  //           {
  //             "id": "112",
  //             "path": "/auditdetailsNew",
  //             "title": "Audit Details",
  //             "icon": "class",
  //             "type": "item",
  //             "extralink": false,
  //             "actions": {
  //               "formAccess": true,
  //               "btnAdd": true,
  //               "btnEdit": true,
  //               "btnView": true,
  //               "btnPrint": true,
  //               "btnExportExcel": true,
  //               "btnDelete": true,
  //               "btnApproval": true
  //             }, "submenu": []
  //           }, { "id": "130", "path": "/teamcreation", "title": "Add Team Details", "icon": "group", "type": "item", "extralink": false, "actions": { "formAccess": true, "btnAdd": true, "btnEdit": true, "btnView": true, "btnPrint": true, "btnExportExcel": true, "btnDelete": true, "btnApproval": true }, "submenu": [] }, { "id": "132", "path": "/teamview", "title": "View Team Details", "icon": "commute", "type": "item", "extralink": false, "actions": { "formAccess": true, "btnAdd": true, "btnEdit": true, "btnView": true, "btnPrint": true, "btnExportExcel": true, "btnDelete": true, "btnApproval": true }, "submenu": [] }, { "id": "114", "path": "", "title": "Reports", "icon": "recent_actors", "type": "collapsable", "extralink": false, "actions": null, "submenu": [{ "id": "170", "path": "/variancereport", "title": "Variance Report", "icon": "recent_actors", "type": "", "extralink": false, "actions": { "formAccess": true, "btnAdd": true, "btnEdit": true, "btnView": true, "btnPrint": true, "btnExportExcel": true, "btnDelete": true, "btnApproval": true }, "submenu": null }, { "id": "115", "path": "/textsumary", "title": "Summary", "icon": "check_circle_outline", "type": "item", "extralink": false, "actions": { "formAccess": true, "btnAdd": false, "btnEdit": true, "btnView": true, "btnPrint": false, "btnExportExcel": false, "btnDelete": false, "btnApproval": false }, "submenu": null }, { "id": "116", "path": "/matched", "title": "Matched Part Nos", "icon": "restore", "type": "item", "extralink": false, "actions": { "formAccess": false, "btnAdd": false, "btnEdit": false, "btnView": false, "btnPrint": false, "btnExportExcel": false, "btnDelete": false, "btnApproval": false }, "submenu": null }, { "id": "117", "path": "/unmatched", "title": "Unmatched Part Nos", "icon": "schedule", "type": "item", "extralink": false, "actions": { "formAccess": false, "btnAdd": false, "btnEdit": false, "btnView": false, "btnPrint": false, "btnExportExcel": false, "btnDelete": false, "btnApproval": false }, "submenu": null }, { "id": "131", "path": "/pending", "title": "Pending List", "icon": "assignment", "type": "item", "extralink": false, "actions": { "formAccess": false, "btnAdd": false, "btnEdit": false, "btnView": false, "btnPrint": false, "btnExportExcel": false, "btnDelete": false, "btnApproval": false }, "submenu": null }, { "id": "147", "path": "/auditreport", "title": "Autit Reports", "icon": "check_circle_outline", "type": "", "extralink": false, "actions": { "formAccess": true, "btnAdd": true, "btnEdit": true, "btnView": true, "btnPrint": true, "btnExportExcel": true, "btnDelete": true, "btnApproval": true }, "submenu": null }, { "id": "148", "path": "/damagedempty", "title": "Damaged/Empty", "icon": "check_circle_outline", "type": "", "extralink": false, "actions": { "formAccess": true, "btnAdd": true, "btnEdit": true, "btnView": true, "btnPrint": true, "btnExportExcel": true, "btnDelete": true, "btnApproval": true }, "submenu": null }, { "id": "149", "path": "/Breakopartion", "title": "Break Reports", "icon": "assignment", "type": "", "extralink": false, "actions": { "formAccess": false, "btnAdd": false, "btnEdit": false, "btnView": false, "btnPrint": false, "btnExportExcel": false, "btnDelete": false, "btnApproval": false }, "submenu": null }, { "id": "172", "path": "/auditviewreport", "title": "Audit View Report", "icon": "", "type": "", "extralink": false, "actions": { "formAccess": true, "btnAdd": true, "btnEdit": true, "btnView": true, "btnPrint": true, "btnExportExcel": true, "btnDelete": true, "btnApproval": true }, "submenu": null }, { "id": "176", "path": "/vreport", "title": "Variance Summary Report", "icon": "", "type": "", "extralink": false, "actions": { "formAccess": true, "btnAdd": true, "btnEdit": true, "btnView": true, "btnPrint": true, "btnExportExcel": true, "btnDelete": true, "btnApproval": true }, "submenu": null }, { "id": "181", "path": "/teamPerformance", "title": "Team Performance", "icon": "", "type": "", "extralink": false, "actions": { "formAccess": true, "btnAdd": true, "btnEdit": true, "btnView": true, "btnPrint": true, "btnExportExcel": true, "btnDelete": true, "btnApproval": true }, "submenu": null }] }, { "id": "150", "path": "/unformatedbins", "title": "UnFormatted BIN Items", "icon": "commute", "type": "item", "extralink": false, "actions": { "formAccess": true, "btnAdd": true, "btnEdit": true, "btnView": true, "btnPrint": true, "btnExportExcel": true, "btnDelete": true, "btnApproval": true }, "submenu": [] }, { "id": "143", "path": "/controlsheet", "title": "Control Sheet", "icon": "", "type": "item", "extralink": false, "actions": { "formAccess": true, "btnAdd": false, "btnEdit": true, "btnView": false, "btnPrint": true, "btnExportExcel": true, "btnDelete": false, "btnApproval": false }, "submenu": [] }, { "id": "144", "path": "/analysisgraphs", "title": "Analysis", "icon": "", "type": "item", "extralink": false, "actions": { "formAccess": true, "btnAdd": false, "btnEdit": true, "btnView": false, "btnPrint": true, "btnExportExcel": true, "btnDelete": false, "btnApproval": false }, "submenu": [] }, { "id": "145", "path": "/stockupdatefile", "title": "Stock Update file", "icon": "", "type": "item", "extralink": false, "actions": { "formAccess": false, "btnAdd": false, "btnEdit": false, "btnView": false, "btnPrint": false, "btnExportExcel": false, "btnDelete": false, "btnApproval": false }, "submenu": [] }, { "id": "168", "path": "", "title": "Audit Team Control Sheet", "icon": "recent_actors", "type": "", "extralink": false, "actions": { "formAccess": true, "btnAdd": true, "btnEdit": true, "btnView": true, "btnPrint": true, "btnExportExcel": true, "btnDelete": true, "btnApproval": true }, "submenu": [{ "id": "169", "path": "/auditvariancereport", "title": "Variance Report", "icon": "recent_actors", "type": "", "extralink": false, "actions": { "formAccess": true, "btnAdd": true, "btnEdit": true, "btnView": true, "btnPrint": true, "btnExportExcel": true, "btnDelete": true, "btnApproval": true }, "submenu": null }, { "id": "154", "path": "/auditteamassign", "title": "Audit Team Assign", "icon": "commute", "type": "item", "extralink": false, "actions": { "formAccess": true, "btnAdd": true, "btnEdit": true, "btnView": true, "btnPrint": true, "btnExportExcel": true, "btnDelete": true, "btnApproval": true }, "submenu": null }] }, { "id": "171", "path": "/searchpartnumber", "title": "Task Reassign", "icon": "icon-Data-Network", "type": "", "extralink": false, "actions": { "formAccess": true, "btnAdd": true, "btnEdit": true, "btnView": true, "btnPrint": true, "btnExportExcel": true, "btnDelete": true, "btnApproval": true }, "submenu": [] }]
  //         }], "ErrorMsg": "", "Headers": null
  //   }
  //   console.log(this.data)
  //   this.data.Data.forEach(element => {
  //     element['Show'] = false;
  //     if (element.submenu.length > 0) {
  //       element.submenu.forEach(elm => {
  //         elm['Show'] = true;
  //         if (elm.submenu.length > 0) {
  //           elm.submenu.forEach(el => {
  //             el['Show'] = true;
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

  // Get_Menu() {
  //   const json = {
  //     actions: null,
  //     extralink: false,
  //     id: "108",
  //     path: "/dashboard",
  //     submenu: [{
  //       actions: null,
  //       extralink: false,
  //       id: "111",
  //       path: "/dashboard",
  //       submenu: [],
  //       title: "Dashboard",
  //       type: "item",
  //     }],
  //     title: "Stock Counting",
  //   }
  //   const body = {
  //     "procedureName": "AstroSP_GetData",
  //     "input1": "Menulist",
  //     "input2": "{\"role_id\":\"1001\"}"
  //   }
  //   this.API.Common_API(body).then((res: any) => {
  //     console.log(res);
  //     if (res) {
  //       if (res.recordset[0].Result == "True") {
  //         const Main_Data = res.recordset ? JSON.parse(res.recordset[0].Menudata) : [];
  //         console.log(Main_Data)
  //       } else {
  //         this.CF.ToastError('No data available', 'Error');
  //       }
  //     }
  //   })
  // }


}
