import {Component} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Gropius';

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    const ccimsIcons = {
      'relation-edge': 'relation-edge.svg',
      'resize-corner': 'resize-corner.svg'
    };

    for (const [key, value] of Object.entries(ccimsIcons)) {
      console.log('register', key, 'as', '../assets/icons/svg/' + value);
      this.matIconRegistry.addSvgIcon(key, this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/' + value));
    }

    // add all issue icons
    for (const type of ['normal', 'assigned']) {
      for (const category of ['bug', 'feature', 'uncategorized']) {
        for (const isClosed of [false, true]) {
          for (const edgeType of [null, 'in', 'out', 'inout']) {
            const assetUrl = [
              '../assets/icons/issues/',
              type,
              '/',
              category,
              isClosed ? '-closed' : null,
              edgeType && '-',
              edgeType,
              '.svg'
            ]
              .filter((part) => !!part)
              .join('');
            const iconName = ['issue', type === 'assigned' ? 'assigned' : null, category, isClosed ? 'closed' : null, edgeType]
              .filter((part) => !!part)
              .join('-');
            this.matIconRegistry.addSvgIcon(iconName, this.domSanitizer.bypassSecurityTrustResourceUrl(assetUrl));
          }
        }
      }
    }
  }
}
