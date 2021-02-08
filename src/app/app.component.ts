import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Gropius';

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    // add the svg icon used for the edge slide toggle above the graph
    this.matIconRegistry.addSvgIcon(
      'relation-edge',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/relation-edge.svg')
    );
  }

}
