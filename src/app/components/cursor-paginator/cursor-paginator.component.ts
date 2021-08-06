import { Component, Input } from '@angular/core';
import { DataList } from '@app/data-dgql/query';

@Component({
  selector: 'app-cursor-paginator',
  templateUrl: './cursor-paginator.component.html',
  styleUrls: ['./cursor-paginator.component.scss']
})
export class CursorPaginatorComponent {
  @Input() list: DataList<unknown, unknown>;
  @Input() pageSizes: number[];
}
