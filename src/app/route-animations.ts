import {trigger, transition, style, query, group, animate} from '@angular/animations';

/**
 * Describes an animation of sliding to to the right, used for the entry of the ComponentDetails component
 */
export const slider = trigger('routeAnimations', [transition('* => isRight', slideTo('right'))]);

function slideTo(direction: string) {
  const optional = {optional: true};
  return [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          [direction]: 0,
          width: '100%'
        })
      ],
      optional
    ),
    query(':enter', [style({[direction]: '-100%'})]),
    group([
      query(':leave', [animate('600ms ease', style({[direction]: '100%'}))], optional),
      query(':enter', [animate('600ms ease', style({[direction]: '0%'}))])
    ])
  ];
}
