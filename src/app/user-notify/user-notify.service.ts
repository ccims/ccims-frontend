import {Injectable} from '@angular/core';
import {IndividualConfig, ToastrService} from 'ngx-toastr';

/**
 * This service provides functions for user notification
 */
@Injectable({providedIn: 'root'})
export class UserNotifyService {
  /** @ignore */
  private errorConfig: Partial<IndividualConfig> = {
    timeOut: 10000,
    closeButton: true,
    positionClass: 'toast-top-center',
    enableHtml: true
  };

  /** @ignore */
  private infoConfig: Partial<IndividualConfig> = {
    timeOut: 4000,
    closeButton: true,
    positionClass: 'toast-top-center',
    enableHtml: true
  };

  constructor(private toastr: ToastrService) {
  }

  /**
   * Notify the user that an error occurred
   * @param message The message to be shown
   * @param error Optionally, the error. This will be logged in the console, if defined.
   */
  notifyError(message: string, error?: Error) {
    if (error !== undefined) {
      console.log('Error:', error);
    }

    this.toastr.error(message, 'Error!', this.errorConfig);
  }

  /**
   * Notify the user
   * @param message The message to be shown
   */
  notifyInfo(message: string) {
    this.toastr.info(message, 'Info', this.infoConfig);
  }
}

