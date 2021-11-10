import { Component, Input } from '@angular/core';
import { Label } from 'src/generated/graphql-dgql';

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
   * Determines the label color for a given background color.
   * @param color the background color string in hex or rgb(...)
   */
  public static labelColorForBackground(color) {
    // Variables for red, green, blue values
    let r, g, b, hsp;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

      // If RGB --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      r = color[1];
      g = color[2];
      b = color[3];
    } else {

      // If hex --> Convert it to RGB: http://gist.github.com/983661
      color = +('0x' + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'));

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }

    // HSP (Hue-Sat-Perceived-brightness) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    // Compare against gamma-adjusted tipping point
    if (hsp > Math.sqrt(0.5) * 255) {
      return 'black';
    } else {
      return 'white';
    }
  }

  /**
   * Determines whether the background color is light or dark.
   *
   * @param color - Background color of a label.
   */
  public labelIsDark(color) {
    if (!color) {
      return false;
    }
    return IssueLabelComponent.labelColorForBackground(color) === 'black';
  }
}
