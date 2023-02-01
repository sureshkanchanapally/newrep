import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../Services/common.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

  constructor(
    private router: Router,
    public CF: CommonService
  ) { }

  ngOnInit() {
  }

  Add_Product() {
    // this.router.navigateByUrl('/products');
  }

}
