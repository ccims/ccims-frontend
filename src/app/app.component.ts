import { Component } from '@angular/core';
import { fader } from './route-animations';
import { StateService } from './state.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CCIMS';

  constructor(private state: StateService) { }

}
