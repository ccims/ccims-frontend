import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
  animateChild
} from '@angular/animations';

const enterLeaveGroupMetadata = group([
  query(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
  ], { optional: true }),
  query(':leave', [
    style({ transform: 'translateX(0%)' }),
    animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
  ], { optional: true }),
]);

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('Graph => *', [
      query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
      enterLeaveGroupMetadata
    ]),
  ]);


