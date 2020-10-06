import { Component, OnInit, ViewEncapsulation, ContentChildren, QueryList, AfterContentChecked } from '@angular/core';
import { SliderContentItemComponent } from '../slider-content-item/slider-content-item.component';
import { Injectable } from '@angular/core';
@Component({
  selector: 'app-slider-content',
  templateUrl: './slider-content.component.html',
  styleUrls: ['./slider-content.component.css'],
  encapsulation: ViewEncapsulation.None
})

/*
@Injectable({
  providedIn: 'root',
})*/
export class SliderContentComponent implements AfterContentChecked {

  @ContentChildren(SliderContentItemComponent)
  _items: QueryList<SliderContentItemComponent>;
  selectedIndex = 1;

  ngAfterContentChecked() {
    this._items.forEach((item: SliderContentItemComponent, index: number) => {
      item.position = index - this.selectedIndex;
      console.log(this._items);

    });
  }
}
