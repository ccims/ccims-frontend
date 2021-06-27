import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ComponentStoreService} from '@app/data/component/component-store.service';
import {
  AddIssueToLocationInput,
  AddLabelToIssueInput,
  GetComponentQuery,
  GetIssueQuery,
  LinkIssueInput,
  RemoveIssueFromLocationInput,
  RemoveLabelFromIssueInput,
  UnlinkIssueInput
} from 'src/generated/graphql';
import {Observable} from 'rxjs';
import {ProjectStoreService} from '@app/data/project/project-store.service';
import {IssueStoreService} from '@app/data/issue/issue-store.service';
import {LabelStoreService} from '@app/data/label/label-store.service';
import {LabelSelectorComponent} from '@app/label-selector/label-selector.component';
import {UserNotifyService} from '@app/user-notify/user-notify.service';

export enum SelectionType {
  Labels = 'labels',
  Assignees = 'assignees',
  Nfr = 'nfr',
  Link = 'link'
}

/**
 * This is a dynamic component displaying editing options for the issue depending on which
 * option gear the user clicked
 */
@Component({
  selector: 'app-issue-settings-container',
  templateUrl: './issue-settings-container.component.html',
  styleUrls: ['./issue-settings-container.component.scss']
})
export class IssueSettingsContainerComponent implements OnInit {
  @Input() selection: SelectionType;
  @Input() currentIssue: GetIssueQuery;
  @Input() selectedLabels: Array<string>;
  @Output() messageEvent = new EventEmitter<boolean>();
  @ViewChild('labelSelector') labelSelector: LabelSelectorComponent;

  public issueComponent: GetComponentQuery;
  public issueComponent$: Observable<GetComponentQuery>;
  issuesLoaded = false;
  selectedIssues: any = [];
  selectableComponentInterfaces = [];
  selectedInterfaces;
  linkableProjectIssues: any = [];
  loading: boolean;
  saveFailed = false;

  constructor(private labelStoreService: LabelStoreService,
              private activatedRoute: ActivatedRoute,
              private componentStoreService: ComponentStoreService,
              private projectStoreService: ProjectStoreService,
              private issueStoreService: IssueStoreService,
              private notify: UserNotifyService) {
  }

  ngOnInit(): void {
    this.issueComponent$ = this.componentStoreService.getFullComponent(this.activatedRoute.snapshot.paramMap.get('componentId'));
    this.issueComponent$.subscribe(component => {
      this.issueComponent = component;
      component.node.interfaces.nodes.forEach(location => this.selectableComponentInterfaces.push(location));
      this.selectedInterfaces = this.filterInterfacesFromLocations(component);
    });
    this.prepareLinkableIssues();
  }

  /**
   * Fires an event that tells the parent page that the user clicked beside the IssueSettingsContainer
   * @param $event click event
   */
  @HostListener('document:mousedown', ['$event'])
  clickout($event) {
    if (this.labelSelector.isDialogOpen()) {
      return;
    }

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

  @HostListener('window:resize', ['$event'])
  resize($event) {
    this.labelSelector.closeDialog();
    this.messageEvent.emit(false);
  }

  /**
   * Saves the changes
   * Which method has to be called is defined by the attribute "selection". This information is injected to the classs
   */
  private saveChanges(): boolean {
    switch (this.selection) {
      case SelectionType.Labels:
        const labelsRemove = this.getLabelsToRemove();
        const labelsAdd = this.getLabelsToAdd();

        this.removeLabelsFromIssue(labelsRemove);
        this.addLabelsToIssue(labelsAdd);
        if (labelsRemove.length < 1 && labelsAdd.length < 1) {
          this.messageEvent.emit(false);
        }
        break;
      case SelectionType.Assignees:
        this.messageEvent.emit(false);
        break;
      case SelectionType.Nfr:
        const locsRemove = this.getLocationsToRemove();
        const locsAdd = this.getLocationsToAdd();
        if (locsRemove.length < 1 && locsAdd.length < 1) {
          this.messageEvent.emit(false);
        } else {
          console.log(locsAdd, locsRemove);
          this.removeIssueFromLocations(locsRemove);
          this.addIssuesToLocations(locsAdd);
        }
        break;
      case SelectionType.Link:
        const remove = this.getIssuesToRemove();
        const add = this.getIssuesToAdd();

        this.unlinkIssues(remove);
        this.linkIssues(add);
        if (remove.length < 1 && add.length < 1) {
          this.messageEvent.emit(false);
        }
        break;
      default:
        return false;
    }

    return true;
  }

  // Determines the labels the user wants to add to the issue
  private getLabelsToAdd(): Array<string> {
    const add: Array<string> = [];
    this.labelSelector.selectedLabels.forEach(selLabel => {
      if (!this.currentIssue.node.labels.nodes.map(l => l.id).includes(selLabel)) {
        add.push(selLabel);
      }
    });

    return add;
  }

  // Determines the labels the user wants to remove from the issue
  private getLabelsToRemove(): Array<string> {
    const remove: Array<string> = [];
    this.currentIssue.node.labels.nodes.forEach(element => {
      if (!this.labelSelector.selectedLabels.includes(element.id)) {
        remove.push(element.id);
      }
    });

    return remove;
  }

  /**
   * Removes the specified labels from the issue
   * @param removeList List of labels that has to be priveded to the database mutation for label removal
   */
  private removeLabelsFromIssue(removeList: Array<string>) {
    removeList.forEach(element2 => {
      const input: RemoveLabelFromIssueInput = {
        issue: this.currentIssue.node.id,
        label: element2
      };

      this.labelStoreService.removeLabel(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);
      }, (error) => {
        this.notify.notifyError('Failed to remove labels!', error);
      });

    });
  }

  /**
   * Adds the specified labels to the issue
   * @param addList List of labels to add to the issue
   */
  private addLabelsToIssue(addList: Array<string>) {
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

  /**
   *  Determines the issues the user wants to be linked by the issue
   */
  private getIssuesToAdd(): Array<string> {
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

  /**
   * Determines the issues the user wants to unlink from the issue
   */
  private getIssuesToRemove(): Array<string> {
    const remove: Array<string> = [];
    this.currentIssue.node.linksToIssues.nodes.forEach(issue => {
      if (!this.selectedIssues.includes(issue.id)) {
        remove.push(issue.id);
      }
    });

    return remove;
  }

  /**
   * Links the issues sprecified by issuesToAdd
   * @param issuesToAdd List of issueIds the issue gets linked to
   */
  private linkIssues(issuesToAdd: Array<string>) {
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

  /**
   * @param issuesToRemove List of issueIds which get unlinked from the issue
   */
  private unlinkIssues(issuesToRemove: Array<string>) {
    issuesToRemove.forEach(issueToUnlink => {
      const input: UnlinkIssueInput = {
        issue: this.currentIssue.node.id,
        issueToUnlink
      };

      this.issueStoreService.unlink(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);
      }, (error) => {
        this.notify.notifyError('Failed to unlink issues!', error);
      });
    });
  }

  /**
   * Helper method to add the component names and interfaces to issues
   */
  private prepareLinkableIssues() {
    this.projectStoreService.getFullProject(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(project => {
      const projectComponents = project.node.components.edges;
      projectComponents.forEach(component => {
        const currentComponentName = component.node.name;
        const currentComponentIssueArray = component.node.issues.nodes;
        currentComponentIssueArray.forEach(issue => {
          const tempIssue = {
            id: issue.id,
            title: issue.title,
            component: currentComponentName
          };
          this.linkableProjectIssues.push(tempIssue);
        });
      });

      // All Interfaces
      const projectInterfaces = project.node.interfaces.nodes;
      projectInterfaces.forEach(projectInterface => {
        const currentInterfaceName = projectInterface.name;
        const currentComponentIssueArray = projectInterface.issuesOnLocation.nodes;
        currentComponentIssueArray.forEach(issue => {
          const tempIssue = {
            id: issue.id,
            title: issue.title,
            component: 'Interface: ' + currentInterfaceName
          };
          this.linkableProjectIssues.push(tempIssue);
        });
      });

      this.currentIssue.node.linksToIssues.nodes.forEach(linkedIssue => {
        this.selectedIssues.push(linkedIssue.id);
      });

      this.issuesLoaded = true;
    });
  }

  /**
   * Checks the locations of the current issue
   */
  private filterInterfacesFromLocations(componentLocation: GetComponentQuery) {
    const interfaceList = [];
    this.currentIssue.node.locations.nodes.forEach(location => {
      if (location.id !== componentLocation.node.id) {
        interfaceList.push(location.id);
      }
    });

    return interfaceList;
  }

  /**
   * Determines which locations have to be removed from the issue
   */
  getLocationsToRemove() {
    const remove: Array<string> = [];
    this.filterInterfacesFromLocations(this.issueComponent).forEach(locationId => {
      if (!this.selectedInterfaces.includes(locationId)) {
        remove.push(locationId);
      }
    });

    return remove;
  }

  /**
   * Determines which locations to add to the issue
   */
  private getLocationsToAdd() {
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

  /**
   * Removes all locations from issue which are included in the locationsToRemove list
   * @param locationsToRemove List containing locations to remove
   */
  private removeIssueFromLocations(locationsToRemove: Array<string>) {
    locationsToRemove.forEach(location => {
      const input: RemoveIssueFromLocationInput = {
        issue: this.currentIssue.node.id,
        location
      };

      this.issueStoreService.removeFromLocation(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);
      }, (error) => {
        this.notify.notifyError('Failed to remove issues!', error);
      });
    });
  }

  /**
   * Add all locations to the issue included in the locationsToAdd list
   * @param locationsToAdd List containing locations to add
   */
  private addIssuesToLocations(locationsToAdd: Array<string>) {
    locationsToAdd.forEach(location => {
      const input: AddIssueToLocationInput = {
        issue: this.currentIssue.node.id,
        location
      };

      this.issueStoreService.addToLocation(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);
      }, (error) => {
        this.notify.notifyError('Failed to add issues!', error);
      });
    });
  }
}
