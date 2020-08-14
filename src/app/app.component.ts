import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-my-app',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  constructor(public _router: Router) {
  }

  ngOnInit() {
    // this._router.navigate(['pages/register']);
    this._router.navigate(['']);

  }
}
