import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss']
})
/**
 * This component contains a monaco markdown editor with syntax highlighting
 */
export class MarkdownEditorComponent implements OnInit {

  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  code = 'function x() {\nconsole.log("Hello world!");\n}';


  constructor() { }

  ngOnInit(): void {
  }

}
