import {Component, Input} from '@angular/core';
import {Label} from 'src/generated/graphql-dgql';

const colorTestCanvas = document.createElement('canvas');
colorTestCanvas.width = colorTestCanvas.height = 1;
const colorTestCtx = colorTestCanvas.getContext('2d');

/**
 * Reads a CSS color into an RGB tuple.
 * Undefined behavior if the string is not a valid color.
 *
 * @param color a CSS color string
 * @return RGB tuple in the 0..255 range
 */
function readCssColor(color: string): [number, number, number] {
  try {
    colorTestCtx.fillStyle = color;
    colorTestCtx.fillRect(0, 0, 1, 1);
    const imageData = colorTestCtx.getImageData(0, 0, 1, 1);
    return [imageData.data[0], imageData.data[1], imageData.data[2]];
  } catch {
    // getImageData may fail in rare cases(?) so we'll simply return garbage
    return [NaN, NaN, NaN];
  }
}

/**
 * Renders an issue label.
 */
@Component({
  selector: 'app-issue-label',
  templateUrl: './issue-label.component.html',
  styleUrls: ['./issue-label.component.scss']
})
export class IssueLabelComponent {
  /** The label to display. Nullable. Should have properties `name` and `color`. */
  @Input() label: Label;

  /**
   * Determines whether the color is light or dark.
   *
   * @param color label color - any CSS color string
   */
  public isColorDark(color?: string): boolean {
    if (!color) {
      return false;
    }

    const [r, g, b] = readCssColor(color);

    // HSP (Hue-Sat-Perceived-brightness) equation from http://alienryderflex.com/hsp.html
    const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    // Using the HSP value, determine whether the color is light or dark
    // Compare against gamma-adjusted tipping point
    return hsp > Math.sqrt(0.5) * 255;
  }
}
