import { Component, Input } from '@angular/core';
import { DataList } from '@app/data-dgql/query';

/**
 * This component controls the cursor in a {@link DataList} using arrows and a page size selector.
 */
@Component({
  selector: 'app-cursor-paginator',
  templateUrl: './cursor-paginator.component.html',
  styleUrls: ['./cursor-paginator.component.scss'],
})
export class CursorPaginatorComponent {
  /** The DataList that will be controlled. */
  @Input() list: DataList<unknown, unknown>;
  /** Available page sizes; e.g. [10, 25, 100] */
  @Input() pageSizes: number[];
}
