import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss']
})
/**
 * This component contains a monaco markdown editor with syntax highlighting
 */
export class MarkdownEditorComponent implements OnInit {

  editorOptions = {theme: 'vs', language: 'markdown'};
  // This code is displayed in the editor
  @Input() code: string;

  constructor() { }

  ngOnInit(): void {
  }

}
