import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { CreateLabelGQL, CreateLabelInput, GetLabelsGQL, Label } from '../../../generated/graphql';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelStoreService {

  constructor(private getLabelsGQL: GetLabelsGQL, private CreateLabelMutation: CreateLabelGQL) { }


  getMatchingLabels(projectId: string, term: string = null): Observable<FilterLabel[]> {
    this.getAllFilter(projectId).pipe(tap(items => console.log("labels: ", items)));
    if (!term) {
      return this.getAllFilter(projectId);
    }
    return this.getAllFilter(projectId).pipe(
      map(items => items.filter(x => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1))
    );
  }

  private getAllFilter(projectId: string): Observable<FilterLabel[]> {
    return this.getLabelsGQL.fetch({ projectId }).pipe(
      map(({ data }) => data.node.labels.nodes)
    );
  }


  public createLabel(input: CreateLabelInput) {
    return this.CreateLabelMutation.mutate({ input });
  }
  public lightOrDark(color) {
    // Variables for red, green, blue values
    let r, g, b, hsp;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

        r = color[1];
        g = color[2];
        b = color[3];
    }
    else {

        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +('0x' + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {

        return 'black';
    }
    else {

        return 'white';
    }
  }
}

export type FilterLabel = Pick<Label, 'id' | 'name' | 'color'>;
