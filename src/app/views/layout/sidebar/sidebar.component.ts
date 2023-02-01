import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import MetisMenu from 'metismenujs';
import { MenuItem } from './menu.model';
import { Router, NavigationEnd } from '@angular/router';
import { WebService } from '../../Services/Webservice.service';
import { CommonService } from '../../Services/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('sidebarToggler') sidebarToggler: ElementRef;
  @ViewChild('sidebarMenu') sidebarMenu: ElementRef;
  user: any;
  roles_data: any;
  menuItems: any = [];

  constructor(
    @Inject(DOCUMENT)
    private document: Document,
    router: Router,
    private API: WebService,
    public CF: CommonService,
    private ChgRef :ChangeDetectorRef
  ) {
    this.Get_Menu_Access();
    console.log(this.CF.user);
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if (this.menuItems?.length > 0) {
          this._activateMenuDropdown();
          if (window.matchMedia('(max-width: 991px)').matches) {
            this.document.body.classList.remove('sidebar-open');
          }
        }
      }
    });
    let data: any = localStorage.getItem('menu_data')
    this.menuItems = localStorage.getItem('menu_data') ? JSON.parse(data) : [];
  }

  ngOnInit(): void {
    const desktopMedium = window.matchMedia('(min-width:992px) and (max-width: 1199px)');
    desktopMedium.addEventListener('change', () => {
      this.iconSidebar;
    });
    this.iconSidebar(desktopMedium);
  }


  Get_Menu_Access() {
    const body = {
      "procedureName": "AstroSP_GetData",
      "input1": "Menulist",
      "input2": JSON.stringify({ role_id: this.CF.user.roleid })
    }
    this.API.Common_API(body).then((res: any) => {
      if (res) {
        if (res.recordset[0].Result == "True") {
          const Main_Data = res.recordset[0] ? JSON.parse(res.recordset[0].roledata) : [];
         const Sub_Data = Main_Data.filter((m: any) => m.status == 1);
         Sub_Data.map((me: any) => {
            me.label = me.menuname; me.icon = 'home';
            me.link = me.menu_url; me.subItems = me.submenu;
            me.submenu.map((se: any) => {
              se.label = se.menuname;
              se.link = se.menu_url;
            })
          })
          console.log(Sub_Data);
          this.ChgRef.detectChanges()
          localStorage.setItem('menu_data', JSON.stringify(Sub_Data));
        }
      }
    })
  }

  ngAfterViewInit() {
    new MetisMenu(this.sidebarMenu.nativeElement);
    // this._activateMenuDropdown();
  }


  toggleSidebar(e: Event) {
    this.sidebarToggler.nativeElement.classList.toggle('active');
    this.sidebarToggler.nativeElement.classList.toggle('not-active');
    if (window.matchMedia('(min-width: 992px)').matches) {
      e.preventDefault();
      this.document.body.classList.toggle('sidebar-folded');
    } else if (window.matchMedia('(max-width: 991px)').matches) {
      e.preventDefault();
      this.document.body.classList.toggle('sidebar-open');
    }
  }

  toggleSettingsSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('settings-open');
  }

  operSidebarFolded() {
    if (this.document.body.classList.contains('sidebar-folded')) {
      this.document.body.classList.add("open-sidebar-folded");
    }
  }

  closeSidebarFolded() {
    if (this.document.body.classList.contains('sidebar-folded')) {
      this.document.body.classList.remove("open-sidebar-folded");
    }
  }

  iconSidebar(mq: MediaQueryList) {
    if (mq.matches) {
      this.document.body.classList.add('sidebar-folded');
    } else {
      this.document.body.classList.remove('sidebar-folded');
    }
  }

  onSidebarThemeChange(event: Event) {
    this.document.body.classList.remove('sidebar-light', 'sidebar-dark');
    this.document.body.classList.add((<HTMLInputElement>event.target).value);
    this.document.body.classList.remove('settings-open');
  }


  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    // console.log(item)
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }


  /**
   * Reset the menus then hilight current active menu item
   */
  _activateMenuDropdown() {
    this.resetMenuItems();
    this.activateMenuItems();
  }


  /**
   * Resets the menus
   */
  resetMenuItems() {
    const links = document.getElementsByClassName('nav-link-ref');
    for (let i = 0; i < links.length; i++) {
      const menuItemEl = links[i];
      menuItemEl.classList.remove('mm-active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.remove('mm-active');
        const parent2El = parentEl.parentElement;
        if (parent2El) {
          parent2El.classList.remove('mm-show');
        }
        const parent3El = parent2El?.parentElement;
        if (parent3El) {
          parent3El.classList.remove('mm-active');
          if (parent3El.classList.contains('side-nav-item')) {
            const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');
            if (firstAnchor) {
              firstAnchor.classList.remove('mm-active');
            }
          }

          const parent4El = parent3El.parentElement;
          if (parent4El) {
            parent4El.classList.remove('mm-show');

            const parent5El = parent4El.parentElement;
            if (parent5El) {
              parent5El.classList.remove('mm-active');
            }
          }
        }
      }
    }
  };



  activateMenuItems() {
    const links: any = document.getElementsByClassName('nav-link-ref');
    let menuItemEl = null;
    for (let i = 0; i < links.length; i++) {
      if (window.location.pathname === links[i]['pathname']) {
        menuItemEl = links[i];
        break;
      }
    }

    if (menuItemEl) {
      menuItemEl.classList.add('mm-active');
      const parentEl = menuItemEl.parentElement;

      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement;
        if (parent2El) {
          parent2El.classList.add('mm-show');
        }

        const parent3El = parent2El.parentElement;
        if (parent3El) {
          parent3El.classList.add('mm-active');
          if (parent3El.classList.contains('side-nav-item')) {
            const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');
            if (firstAnchor) {
              firstAnchor.classList.add('mm-active');
            }
          }

          const parent4El = parent3El.parentElement;
          if (parent4El) {
            parent4El.classList.add('mm-show');
            const parent5El = parent4El.parentElement;
            if (parent5El) {
              parent5El.classList.add('mm-active');
            }
          }
        }
      }
    }
  };

  public loadRAutocomplete(file: any) {
    const node = document.createElement("script");
    node.src = `${file}`;
    node.type = "text/javascript";
    node.async = true;
    node.defer = true;
    document.getElementsByTagName("head")[0].appendChild(node);
  }
}
