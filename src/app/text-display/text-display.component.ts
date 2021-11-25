import { Component, Input } from '@angular/core';

/**
 * A callback function that is called once the user finishes editing the text.
 * @param saved true if the user clicked save, false if the user cancelled the editing
 */
export type TextDisplayEditCallbackFn = (saved: boolean) => void;

/**
 * The text display component shows text in a labeled box, and if desired, allows the user to edit and save the
 * text
 */
@Component({
  selector: 'app-text-display',
  templateUrl: './text-display.component.html',
  styleUrls: ['./text-display.component.scss']
})
export class TextDisplayComponent {
  /** A callback function. */
  @Input() onEditFinished: TextDisplayEditCallbackFn;
  /** The title text. */
  @Input() labelText: string;
  /** Sets the content of the text display, and shows the placeholder if the text is empty */
  @Input() set text(value: string) {
    this.value = value;
    this.showPlaceholder = !value || value.length === 0;
  }

  get text() {
    return this.value;
  }

  /** If true, the edit button is not shown */
  @Input() readonly: boolean;
  /** The placeholder will be shown if the content is empty */
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
