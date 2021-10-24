import { Component, Input } from '@angular/core';
import { Label } from 'src/generated/graphql-dgql';
import { LabelStoreService } from '@app/data/label/label-store.service';

@Component({
  selector: 'app-issue-label',
  templateUrl: './issue-label.component.html',
  styleUrls: ['./issue-label.component.scss']
})
export class IssueLabelComponent {
  @Input() label: Label;

  constructor(private labelStoreService: LabelStoreService) {}

  /**
   * Determines whether the background color is light or dark.
   *
   * @param color - Background color of a label.
   */
  public textIsDark(color) {
    if (!color) {
      return false;
    }
    return this.labelStoreService.lightOrDark(color) === 'black';
  }
}
