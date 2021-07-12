import {Injectable} from '@angular/core';
import {IndividualConfig, ToastrService} from 'ngx-toastr';

@Injectable({providedIn: 'root'})
export class UserNotifyService {
  private errorConfig: Partial<IndividualConfig> = {
    timeOut: 10000,
    closeButton: true,
    positionClass: 'toast-top-center',
    enableHtml: true
  };

  private infoConfig: Partial<IndividualConfig> = {
    timeOut: 4000,
    closeButton: true,
    positionClass: 'toast-top-center',
    enableHtml: true
  };

  constructor(private toastr: ToastrService) {
  }

  notifyError(message: string, error?: Error) {
    if (error !== undefined) {
      console.log('Error:', error);
    }

    this.toastr.error(message, 'Error!', this.errorConfig);
  }

  notifyInfo(message: string) {
    this.toastr.info(message, 'Info', this.infoConfig);
  }
}

