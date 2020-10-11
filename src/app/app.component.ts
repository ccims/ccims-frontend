import { Component } from '@angular/core';
import { StateService } from './state.service';
import { slideInAnimation } from './route-animation';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation]
})
export class AppComponent {
  title = 'CCIMS';

  constructor(private state: StateService) { }

}
