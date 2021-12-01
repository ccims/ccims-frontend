import {Component, Input} from '@angular/core';

/**
 * This component renders and displays markdown
 */
@Component({
  selector: 'app-markdown-preview',
  templateUrl: './markdown-preview.component.html',
  styleUrls: ['./markdown-preview.component.scss'],
  preserveWhitespaces: true
})
export class MarkdownPreviewComponent {
  /**
   * The markdown code as a string which will be rendered
   */
  @Input() displayedCode: string;
}
