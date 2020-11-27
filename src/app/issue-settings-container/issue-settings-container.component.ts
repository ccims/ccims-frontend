import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { AddIssueToLocationInput, AddLabelToIssueInput, CreateLabelInput, GetComponentQuery, GetIssueQuery, GetProjectQuery, Label, LinkIssueInput, RemoveIssueFromLocationInput, RemoveLabelFromIssueInput, UnlinkIssueInput } from 'src/generated/graphql';
import { Observable } from 'rxjs';
import { LabelStoreService } from '@app/data/label/label-store.service';
import { element } from 'protractor';
import { ProjectStoreService } from '@app/data/project/project-store.service';
import { IssueStoreService } from '@app/data/issue/issue-store.service';
import { FormControl, Validators } from '@angular/forms';
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
  issuesLoaded = false;
  selectedIssues: any = [];
  selectableComponentInterfaces = [];
  selectedInterfaces;
  linkableProjectIssues: any = [];
  validationLabelName = new FormControl('', [Validators.required]);
  validationLabelColor = new FormControl('', [Validators.required]);
  color: string = '#50d63a';
  loading: boolean;
  saveFailed = false;
  constructor(private activatedRoute: ActivatedRoute, private componentStoreService: ComponentStoreService,
              private labelStoreService: LabelStoreService, private projectStoreService: ProjectStoreService,
              private issueStoreService: IssueStoreService, private labelStore: LabelStoreService) { }

  ngOnInit(): void {


    this.issueComponent$ = this.componentStoreService.getFullComponent(this.activatedRoute.snapshot.paramMap.get('componentId'));
    this.issueComponent$.subscribe(component => {
      this.issueComponent = component;
      this.labels = component.node.labels.nodes;
      component.node.interfaces.nodes.forEach(location => this.selectableComponentInterfaces.push(location));
      this.selectedInterfaces = this.filterInterfacesFromLocations(component);
    });
    this.prepareLinkableIssues();


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
      if (remove.length < 1 && add.length < 1){this.messageEvent.emit(false); }
      return true;
    }

    if (this.selection === 'assignees') {
      // assignees speichern
      this.messageEvent.emit(false);
    }
    if (this.selection === 'nfr') {
      // nfr speichern
      const remove = this.getLocationsToRemove();
      const add = this.getLocationsToAdd();
      if (remove.length < 1 && add.length < 1){this.messageEvent.emit(false);
      }else{
        console.log(add, remove);

        this.removeIssueFromLocations(remove);
        this.addIssuesToLocations(add); }
      // this.messageEvent.emit(false);
    }
    if (this.selection === 'link') {
      // linked Issues speichern
      const remove = this.getIssuesToRemove();
      const add = this.getIssuesToAdd();

      this.unlinkIssues(remove);
      this.linkIssues(add);
      if (remove.length < 1 && add.length < 1){this.messageEvent.emit(false); }
      return true;
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
        label: element2
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
  private getIssuesToAdd(): Array<string>{
    const add: Array<string> = [];
    this.selectedIssues.forEach(selIssue => {
      let found = false;
      this.currentIssue.node.linksToIssues.nodes.forEach(issue => {
        if (issue.id === selIssue) {
          found = true;
        }

      });
      if (!found) {
        add.push(selIssue);
      }
    });
    return add;
  }
  private getIssuesToRemove(): Array<string>{
    const remove: Array<string> = [];
    this.currentIssue.node.linksToIssues.nodes.forEach(issue => {
      if (!this.selectedIssues.includes(issue.id)) {
        remove.push(issue.id);
      }
    });

    return remove;
  }
  private linkIssues(issuesToAdd: Array<string>){
    issuesToAdd.forEach(element1 => {
      const input: LinkIssueInput = {
        issue: this.currentIssue.node.id,
        issueToLink: element1
      };
      this.issueStoreService.link(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);

      });

    });
  }
  private unlinkIssues(issuesToRemove: Array<string>){
    issuesToRemove.forEach(issueToUnlink => {
      const input: UnlinkIssueInput = {
        issue: this.currentIssue.node.id,
        issueToUnlink
      };
      this.issueStoreService.unlink(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);

      }, (error) => {
        console.log('there was an error sending the query', error); });

    });
  }
  private prepareLinkableIssues() {
    this. projectStoreService.getFullProject(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(project => {
      const projectComponents = project.node.components.edges;
      projectComponents.forEach(component => {
        const currentComponentName = component.node.name;
        const currentComponentIssueArray = component.node.issues.nodes;
        currentComponentIssueArray.forEach(issue => {
          const tempIssue = {id: issue.id,
                            title: issue.title,
                            component: currentComponentName};
          this.linkableProjectIssues.push(tempIssue);
        });
      });
      // All Interfaces
      const projectInterfaces = project.node.interfaces.nodes;
      projectInterfaces.forEach(projectInterface => {
        const currentInterfaceName = projectInterface.name;
        const currentComponentIssueArray = projectInterface.issuesOnLocation.nodes;
        currentComponentIssueArray.forEach(issue => {
          const tempIssue = {id: issue.id,
                            title: issue.title,
                            component: 'Interface: ' + currentInterfaceName};
          this.linkableProjectIssues.push(tempIssue);
        });
      });
      this.currentIssue.node.linksToIssues.nodes.forEach(linkedIssue => {
        this.selectedIssues.push(linkedIssue.id);
      });

      this.issuesLoaded = true;
    });
  }
  private filterInterfacesFromLocations(componentLocation: GetComponentQuery){
    const interfaceList = [];
    this.currentIssue.node.locations.nodes.forEach(location => {
      if (location.id !== componentLocation.node.id){
        console.log('pushed');

        interfaceList.push(location.id);
      }
    });
    return interfaceList;
  }
  getLocationsToRemove(){
    const remove: Array<string> = [];
    this.filterInterfacesFromLocations(this.issueComponent).forEach(locationId => {

      if (!this.selectedInterfaces.includes(locationId)) {
        remove.push(locationId);
      }
    });
    return remove;

  }
  private getLocationsToAdd(){
    const add: Array<string> = [];
    this.selectedInterfaces.forEach(selInterface => {
      let found = false;
      this.currentIssue.node.locations.nodes.forEach(location => {
        if (location.id === selInterface) {
          found = true;
        }

      });
      if (!found) {
        add.push(selInterface);
      }
    });
    return add;
  }
  private removeIssueFromLocations(locationsToRemove: Array<string>){
    locationsToRemove.forEach(location => {
      const input: RemoveIssueFromLocationInput = {
        issue: this.currentIssue.node.id,
         location
      };
      this.issueStoreService.removeFromLocation(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);

      }, (error) => {
        console.log('there was an error sending the query', error); });

    });
  }
  private addIssuesToLocations(locationsToAdd: Array<string>){
    locationsToAdd.forEach(location => {
      const input: AddIssueToLocationInput = {
        issue: this.currentIssue.node.id,
         location
      };
      this.issueStoreService.addToLocation(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);

      }, (error) => {
        console.log('there was an error sending the query', error); });

    });
  }
  onLabelCancelClick() {
    this.validationLabelName.setValue('');
  }
  onConfirmCreateLabelCklick(name: string, description?: string) {
    // mutation new Label
    const input: CreateLabelInput = {
      name,
      color: this.color,
      components: [this.activatedRoute.snapshot.paramMap.get('componentId')],
      description
    };
    this.loading = true;
    this.labelStore.createLabel(input).subscribe(({ data}) => {
      this.loading = false;
      // save returned label to labels
      this.labels.push({name: data.createLabel.label.name, id: data.createLabel.label.id});
      this.onLabelCancelClick();
    }, (error) => {
      console.log('there was an error sending the query', error);
      this.loading = false;
      this.saveFailed = true;
    });


    }
}
