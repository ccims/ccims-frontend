import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';

@Component({
  selector: 'app-slider-content-item',
  templateUrl: './slider-content-item.component.html',
  styleUrls: ['./slider-content-item.component.css'],
  host: {
    'class': 'slider-content-item'
  },
  animations: [
    trigger('translateSlide', [
      state('center, void', style({ 'transform': 'none'})),
      state('left', style({ 'transform': 'translate3D(-100%, 0, 0)'})),
      state('right', style({ 'transform': 'translate3D(100%, 0, 0)'})),
      transition('* => left, * => right, left => center, right => center',
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')),
    ])
  ]
})
export class SliderContentItemComponent implements OnInit {
  _position;
  _positionIndex;
  _displayContent = false;

  @Input()
  set position(positionValue: number) {
    this._positionIndex = positionValue;
    this.computePosition();
  }

  @HostBinding('class.slider-content-item-active')
  get activeClass() {
    return this._positionIndex === 0;
  }

  constructor() { }

  ngOnInit() {
    this.computePosition()
    console.log("blaaaaaa")
  }

  computePosition() {
    if (this._positionIndex < 0) {
      this._position = 'left';
    } else if (this._positionIndex > 0) {
      this._position = 'right';
    } else {
      this._position = 'center';
    }
  }

  onTranslateSlideStart(event: AnimationEvent) {
    if (event.toState === 'center') {
      this._displayContent = true;
    }
  }

  onTranslateSlideEnd(event: AnimationEvent) {
    if (event.fromState === 'center' && event.toState !== 'center') {
       this._displayContent = false;
    }
  }
}
