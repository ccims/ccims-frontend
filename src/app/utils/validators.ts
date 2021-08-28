import {Validators} from '@angular/forms';

export class CCIMSValidators {
  static readonly nameValidator = Validators.maxLength(256);

  static readonly nameFormatValidator = Validators.compose([
    CCIMSValidators.nameValidator,
    Validators.pattern('([^ ]+ )*([^ ]+)+')
  ]);

  // TODO: Verify URL pattern, leaving this out for now for quicker testing
  static readonly urlValidator = Validators.maxLength(655536);

  static readonly contentValidator = Validators.maxLength(655536);
}
