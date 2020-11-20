import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { AddLabelToIssueInput, GetComponentQuery, GetIssueQuery, Label, RemoveLabelFromIssueInput } from 'src/generated/graphql';
import { Observable } from 'rxjs';
import { LabelStoreService } from '@app/data/label/label-store.service';
import { element } from 'protractor';
@Component({
  selector: 'app-issue-settings-container',
  templateUrl: './issue-settings-container.component.html',
  styleUrls: ['./issue-settings-container.component.scss']
})
export class IssueSettingsContainerComponent implements OnInit {
  @Input() selection;
  @Input() currentIssue: GetIssueQuery;
  @Input() selectedLabels: Array<string>;
  @Output() messageEvent = new EventEmitter<boolean>();

  public labels: Label[];
  public issueComponent: GetComponentQuery;
  public issueComponent$: Observable<GetComponentQuery>;
  constructor(private activatedRoute: ActivatedRoute, private componentStoreService: ComponentStoreService,
              private labelStoreService: LabelStoreService) { }

  ngOnInit(): void {


    this.issueComponent$ = this.componentStoreService.getFullComponent(this.activatedRoute.snapshot.paramMap.get('componentId'));
    this.issueComponent$.subscribe(component => {
      this.issueComponent = component;
      this.labels = component.node.labels.nodes;
    });
  }
  @HostListener('document:click', ['$event'])
  clickout($event) {
    let close = true;
    $event.path.forEach(element => {
      if (element.classList && element.classList.contains('settings')) {
        close = false;
      }
    });
    if ($event.target.outerText !== 'settings' && close === true) {
      this.saveChanges();
       // if (this.saveChanges()) { this.messageEvent.emit(true); }
    }


  }
  private saveChanges(): boolean {
    if (this.selection === 'labels') {
      const remove = this.getLabelsToRemove();
      const add = this.getLabelsToAdd();

      this.removeLabelsFromIssue(remove);
      this.addLabelsToIssue(add);
      console.log('add', add);
      console.log('remove', remove);
      if (remove.length < 1 && add.length < 1){this.messageEvent.emit(false); }
      return true;
    }

    if (this.selection === 'assignees') {
      // assignees speichern

    }
    if (this.selection === 'link') {
      // linked Issues speichern

    }
    return false;
  }
  public lightOrDark(color) {
    this.labelStoreService.lightOrDark(color);
  }

  private getLabelsToAdd(): Array<string> {
    const add: Array<string> = [];
    this.selectedLabels.forEach(selLabel => {
      let found = false;
      this.currentIssue.node.labels.nodes.forEach(label => {
        if (label.id === selLabel) {
          found = true;
        }

      });
      if (!found) {
        add.push(selLabel);
      }
    });

    return add;
  }
  private getLabelsToRemove(): Array<string> {
    const remove: Array<string> = [];
    this.currentIssue.node.labels.nodes.forEach(element => {
      if (!this.selectedLabels.includes(element.id)) {
        remove.push(element.id);
      }
    });

    return remove;
  }
  private removeLabelsFromIssue(removeList: Array<string>){
    removeList.forEach(element2 => {
      const input: RemoveLabelFromIssueInput = {
        issue: this.currentIssue.node.id,
        label: 'element2'
      };
      this.labelStoreService.removeLabel(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);

      }, (error) => {
        console.log('there was an error sending the query', error); });

    });
  }
  private addLabelsToIssue(addList: Array<string>){
    addList.forEach(element1 => {
      const input: AddLabelToIssueInput = {
        issue: this.currentIssue.node.id,
        label: element1
      };
      this.labelStoreService.addLabel(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);

      });

    });
  }
}
