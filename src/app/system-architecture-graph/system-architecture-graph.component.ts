import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponentDialogComponent } from '../dialogs/create-component-dialog-demo/create-component-dialog.component';
import { Project, IssueType } from '../reducers/state';
import { ComponentPartial } from '../reducers/components.actions';
import { ApiService } from '../api/api.service';

@Component({
    selector: 'app-system-architecture-graph',
    templateUrl: './system-architecture-graph.component.html',
    styleUrls: ['./system-architecture-graph.component.css']
})
export class SystemArchitectureGraphComponent implements OnInit {

    @Input() project: Project;

    featureRequests = true;
    bugReports = true;
    undecided = true;

    private blacklistFilter = {
        [IssueType.BUG]: false,
        [IssueType.FEATURE_REQUEST]: false,
        [IssueType.UNCLASSIFIED]: false,

    }

    constructor(public dialog: MatDialog, private api: ApiService) { }

    ngOnInit() { }

    public openCreateComponentDialog(): void {
        const createComponentDialog = this.dialog.open(CreateComponentDialogComponent);

        createComponentDialog.afterClosed().subscribe((componentInformation: {ownerUsername: string, component: ComponentPartial}) => {
            // TODO add component to project, update graph and backend
            if (componentInformation) {
                console.log(componentInformation)
                this.api.addComponent(this.project.id, componentInformation.ownerUsername, componentInformation.component);
                //console.log(`Dialog result: ${componentInformation.generalInformation.componentName}`);
            }
        });
    }

    public updateBlacklistFilter() { // For change detection performance
        this.blacklistFilter = { // only create a new object if needed (change detection compares object ids)
            [IssueType.BUG]: !this.bugReports, // invert for blacklist
            [IssueType.FEATURE_REQUEST]: !this.featureRequests,
            [IssueType.UNCLASSIFIED]: !this.undecided,
        };
    }

    public getBlacklistFilter() {
        return this.blacklistFilter;
    }
}
