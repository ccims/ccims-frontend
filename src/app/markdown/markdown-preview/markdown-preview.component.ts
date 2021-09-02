import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-markdown-preview',
  templateUrl: './markdown-preview.component.html',
  styleUrls: ['./markdown-preview.component.scss'],
  preserveWhitespaces: true
})
/**
 * This component renders and displays markdown
 */
export class MarkdownPreviewComponent implements OnInit {

  @Input() displayedCode: string;

  constructor() { }

  ngOnInit(): void {
  }

}
