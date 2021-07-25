import { Injectable } from '@angular/core';
import { IssuesService } from './issues.service';

@Injectable({
  providedIn: 'root'
})
export class QueriesService {
  constructor(
    public issues: IssuesService,
  ) {}
}
