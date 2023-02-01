import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CommonService } from './common.service';

@Component({
  selector: 'app-spinner',
  template: `
  <!-- <div class="content__loader" *ngIf="CF.isSpinnerVisible"><div><i class="Favicon"></i></div></div> -->
  <div *ngIf="CF.isSpinnerVisible" class="spinner-wrapper">
        <div class="spinner">Loading...</div>
      </div>
  `,
})
export class PreloaderComponent implements OnDestroy {
  constructor(
    private router: Router,
    public CF: CommonService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.CF.isSpinnerVisible = true;
      } else if (event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError) {
        setTimeout(() => {
          this.CF.isSpinnerVisible = false;
        }, 500);
      }
    }, () => { setTimeout(() => {
      this.CF.isSpinnerVisible = false;
    }, 500); });
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.CF.isSpinnerVisible = false;
    }, 200);
  }
}
