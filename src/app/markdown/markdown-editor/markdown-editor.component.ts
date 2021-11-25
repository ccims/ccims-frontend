import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * This component contains a monaco markdown editor with syntax highlighting
 */
@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss']
})
export class MarkdownEditorComponent {
  /**
   * necessary options for usage of ngx-monaco-editor
   */
  editorOptions = { theme: 'vs', language: 'markdown' };
  /**
   * This code is initially displayed in the editor
   */
  @Input() code: string;
  /**
   * Necessary for communicating changes to the parent when changes have been made to the code in the editor.
   */
  @Output() codeChange = new EventEmitter<string>();

  /**
   * Send changes in the editor to the parent component over the EventEmitter
   */
  codeDidChange() {
    this.codeChange.emit(this.code);
  }
}
