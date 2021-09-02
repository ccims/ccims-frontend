import {Component, Input} from '@angular/core';

export type TextDisplayEditCallbackFn = (saved: boolean) => void;

@Component({
  selector: 'app-text-display',
  templateUrl: './text-display.component.html',
  styleUrls: ['./text-display.component.scss']
})
export class TextDisplayComponent {
  @Input() onEditFinished: TextDisplayEditCallbackFn;
  @Input() labelText: string;

  @Input() set text(value: string) {
    this.value = value;
    this.showPlaceholder = !value || value.length === 0;
  }

  get text() {
    return this.value;
  }

  @Input() readonly: boolean;
  @Input() placeholder = '';

  private value;
  editMode = false;
  editText = '';
  showPlaceholder = false;

  finishEditing(saved: boolean): void {
    this.editMode = false;
    if (saved) {
      this.text = this.editText;
    }

    if (this.onEditFinished) {
      this.onEditFinished(saved);
    }
  }

  startEditing() {
    this.editText = this.text;
    this.editMode = true;
  }
}
