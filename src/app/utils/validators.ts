import { Validators } from '@angular/forms';

/**
 * This class provides commonly used validators in CCIMS usable for e.g. input fields
 */
export class CCIMSValidators {
  /**
   * Ensures that text has the appropriate length to be used as a name
   */
  static readonly nameValidator = Validators.maxLength(256);

  /**
   * Ensures that the text is both usable as a name ({@link #nameValidator}) and that the text does not start/end with
   * a whitespace (white-spaces in the name are allowed)
   */
  static readonly nameFormatValidator = Validators.compose([CCIMSValidators.nameValidator, Validators.pattern('([^ ]+ )*([^ ]+)+')]);

  /**
   * Ensures that the provided text has the correct length and the correct format for an URL
   */
  // TODO: Verify URL pattern, leaving this out for now for quicker testing
  static readonly urlValidator = Validators.maxLength(655536);

  /**
   * Ensures that the text has the appropriate length for content
   */
  static readonly contentValidator = Validators.maxLength(655536);
}
