import { Injectable, PLATFORM_ID, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

declare let LazyLoad: any;

@Injectable({ providedIn: 'root' })
export class CommonService {
  public tokenname = 'Login_Details';
  public isSpinnerVisible: boolean = false;
  sitepath = '';
  isBrowser: any;
  public renderer: Renderer2;
  public updateDashboard = new BehaviorSubject<any>(false);

  constructor(
    public rendererFactory: RendererFactory2,
    public router: Router,
    public toastr: ToastrService,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) platformId: string,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public SDDL = {
    singleSelection: true,
    idField: 'item_id',
    textField: 'item_text',
    enableCheckAll: false,
    itemsShowLimit: 1,
    allowSearchFilter: true,
    lazyLoading: true,
    closeDropDownOnSelection: true,
  };

  public dtOption = {
    scrollY: '45vh',
    scrollX: true,
    scrollCollapse: true,
    ordering: false,
    // order: [0, 'desc'],
    displayLength: 10,
    dom: 'liBfrtp',
    buttons: [
      { extend: 'copy', text: 'Copy' },
      { extend: 'print', text: 'Print' },
      { extend: 'excel', text: 'Download Excel' }
    ],
    responsive: true,
    language: {
      search: '',
      searchPlaceholder: 'Search here',
    },
  }

  public dtOption_Excel = {
    scrollY: '45vh',
    scrollX: true,
    scrollCollapse: true,
    ordering: false,
    // order: [0, 'desc'],
    displayLength: 10,
    dom: 'liBfrtip',
    buttons: [
      // { extend: 'copy', text: 'Copy' },
      // { extend: 'print', text: 'Print' },
      { extend: 'excel', text: 'Download Excel' }
    ],
    responsive: true,
    language: {
      search: '',
      searchPlaceholder: 'Search here',
    },
  }

  Status = [
    { item_id: 1, item_text: "Active" },
    { item_id: 0, item_text: "InActive" }
  ]

  public GenerateTags(tags: any) {
    tags = {
      title: 'projectname | Your Prosperity Our Business',
      description: 'projectname',
      keywords: 'projectname',
      image: 'https://projectname.info/assets/images/png/logo.png',
      path: '',
      ...tags
    };
    this.title.setTitle(tags.title);
    this.meta.updateTag({ name: 'Description', content: tags.description });
    this.meta.updateTag({ name: 'Keywords', content: tags.keywords });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:site', content: '@projectname' });
    this.meta.updateTag({ name: 'twitter:title', content: tags.title });
    this.meta.updateTag({ name: 'twitter:description', content: tags.description });
    this.meta.updateTag({ name: 'twitter:image', content: tags.image });
    this.meta.updateTag({ property: 'og:type', content: 'product' });
    this.meta.updateTag({ property: 'og:site_name', content: 'projectname' });
    this.meta.updateTag({ property: 'og:title', content: tags.title });
    this.meta.updateTag({ property: 'og:description', content: tags.description });
    this.meta.updateTag({ property: 'og:image', content: tags.image });
    this.meta.updateTag({ property: 'og:url', content: this.sitepath + '/' + tags.path });
  }
  public lazyload() {
    if (this.isBrowser) {
      setTimeout(() => new LazyLoad({ elements_selector: ".lazy" }), 100);
    }
  }
  public get isLoggedin(): any {
    if (this.isBrowser) {
      const TKN = localStorage.getItem(this.tokenname)
      if (TKN && TKN !== null) {

        const ANO = JSON.parse(this.Decrypt(TKN, this.tokenname)).AccountNo;
        return (ANO > 0) ? true : false
      }
      return false;
    }
  }
  public ProductUrl(str: string) {
    return str.toLowerCase().replace(/[^A-Z0-9]/ig, "-").replace(/[-]+/g, '-').trim()
  }

  //  -------------------------------------------------- Local Storages ------------------------------------------------------------

  public get user() {
    const TKN: any = localStorage.getItem(this.tokenname);
    return (TKN) ? JSON.parse(JSON.parse(this.Decrypt(TKN, this.tokenname))) : '';
  }

  public LocalStorageSet(name: string, data: any) {
    if (this.isBrowser) {
      return localStorage.setItem(name, this.Encrypt(JSON.stringify(data), name));
    }
  }
  public LocalStorageGet(name: string) {
    if (this.isBrowser) {
      return JSON.parse(this.Decrypt(localStorage.getItem(name), name));
    }
  }
  public SessionStorageSet(name: string, data: any) {
    if (this.isBrowser) {
      return sessionStorage.setItem(name, this.Encrypt(JSON.stringify(data), name));
    }
  }
  public SessionStorageGet(name: string) {
    if (this.isBrowser) {
      const Data = sessionStorage.getItem(name);
      if (Data && Data !== null) {
        return JSON.parse(this.Decrypt(Data, name));
      }
    }
  }

  public ConvertDropDown(array: []) {
    return array.map((o: any, i = 1) => ({ id: i + 1, itemName: o }))
  }

  public RemoveNull(data: any) {
    return new Set([].concat(...data.map(Object.keys)))
      .forEach(key => data.filter((obj: any) => obj[key] === 'no' || obj[key] === 'undefined' || obj[key] === undefined || obj[key] === null || obj[key] === 'No').forEach((obj: any) => obj[key] = 'NA'));
  }

  public Encrypt(o: any, salt: any) {
    o = JSON.stringify(o).split('');
    for (let i = 0, l = o.length; i < l; i++) {
      if (o[i] === '{') {
        o[i] = '}';
      } else if (o[i] === '}') {
        o[i] = '{';
      }
    }
    return btoa(encodeURI(salt + o.join('')));
  }
  public Decrypt(o: any, salt: any) {
    o = decodeURI(atob(o));
    if (salt && o.indexOf(salt) !== 0) {
      throw new Error('object cannot be decrypted');
    }
    o = o.substring(salt.length).split('');
    for (let i = 0, l = o.length; i < l; i++) {
      if (o[i] === '{') {
        o[i] = '}';
      } else if (o[i] === '}') {
        o[i] = '{';
      }
    }
    return JSON.parse(o.join(''));
  }
  public GotoURL(url: string) {
    this.router.navigate([url]);
  }
  public GotoURLParam(url: string) {
    this.router.navigateByUrl(url);
  }
  public AlphabetsOnly(event: any) {
    const charCode = event.keyCode;
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8 || charCode === 32) {
      event.target.value = event.target.value.replace(/[^A-Za-z0-9-,.;'&/.() ]|^ /g, '');
      return true;
    } else {
      return false;
    }
  }
  public numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  public Percentage(number: any, target: any) {
    return number / target * 100
  }
  // public NoSpace(event: any) {
  //   if (event.keyCode === 32) {
  //     return false;
  //   }
  // }
  public RemoveDash(str: any) {
    return str.replace(/-/g, ' ').toLowerCase()
  }
  public RemUC(text: any) {
    const str = text.replace(/_/g, " ").toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
  }
  public UpperCase($event: any) {
    return $event.target.value.toUpperCase();
  }
  public LowerCase($event: any) {
    return $event.target.value.toLowerCase();
  }
  public DisDate(date: any) {
    return moment(new Date(date)).format('D MMM');
  }
  public Date(date: any) {
    return moment(new Date(date)).format('M-DD-YYYY');
  }
  public lastweek(date: any) {
    return moment(new Date(date)).add(-7, 'days').format('M-DD-YYYY');
  }
  public Day(date: any) {
    return moment(new Date(date)).format('DD');
  }
  public Month(date: any) {
    return moment(new Date(date)).format('MM');
  }
  public Year(date: any) {
    return moment(new Date(date)).format('YYYY');
  }
  public Time(date: any) {
    return moment(new Date(date)).format('hh:mm:ss');
  }
  public GoTo($element: any): void {
    $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
  public ToastClear() {
    this.toastr.clear();
  }
  public ToastSuccess(msg: any, heading = 'Success') {
    this.toastr.success(msg, heading, {
      enableHtml: true,
      closeButton: true
    });
  }
  public ToastWarning(msg: any, heading = 'Warning') {
    this.toastr.warning(msg, heading, {
      enableHtml: true,
      closeButton: true
    });
  }
  ToastError(msg: any, heading = 'Error') {
    this.toastr.error(msg, heading, {
      enableHtml: true,
      closeButton: true
    });
  }
  public SwalSuccess(msg: string, heading = 'Success!') {
    Swal.fire({
      title: heading,
      text: msg,
      icon: 'success',
      confirmButtonColor: '#0f4a21'
    })
  }
  public SwalWarning(msg: any, heading = 'Warning') {
    Swal.fire(msg, heading, 'warning');
  }
  public SwalError(msg: any, heading = 'Error') {
    Swal.fire(msg, heading, 'error');
  }

  public loadFile(file: any) {
    const node = window.document.createElement('script');
    node.src = `${file}`;
    node.type = 'text/javascript';
    node.async = true;
    node.defer = true;
    node.charset = 'utf-8';
    window.document.getElementsByTagName('head')[0].appendChild(node);
  }

  public JS_File() {
    let file = 'assets/js/particles.js'
    const node = document.createElement("script");
    node.src = `${file}`;
    node.type = "text/javascript";
    node.async = true;
    node.defer = true;
    node.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node);
  }

}
