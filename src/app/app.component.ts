import {Component, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnDestroy {

  ngOnDestroy(): void {
    console.log('APP ngOnDestroy');
  }

}
