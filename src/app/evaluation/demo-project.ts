import {Injectable} from '@angular/core';
import {AuthenticationService} from '@app/auth/authentication.service';
import {
  CreateComponentGQL,
  CreateComponentInput,
  CreateIssueInput,
  GetComponentGQL,
  ImsType,
  IssueCategory,
  LinkIssueInput,
  UpdateComponentGQL
} from 'src/generated/graphql';
import {ProjectStoreService} from '@app/data/project/project-store.service';
import {IssueStoreService} from '@app/data/issue/issue-store.service';
import {LabelStoreService} from '@app/data/label/label-store.service';
import {InterfaceStoreService} from '@app/data/interface/interface-store.service';
import {IssueGraphStateService} from '@app/data/issue-graph/issue-graph-state.service';

/**
 * This service sets up a sample project with two components and a few issues
 * The two components are connected via an interface
 * One isssue is linked from one component across the interface to an issue of the other component
 * It can be used for quick testing, without the need to set up a project with
 */
@Injectable({
  providedIn: 'root'
})

export class demoProject {
  beschreibung: string = 'Lorem Ipsum';
  store = {};
  issueOnInterfaceId: string;
  userId: string;

  constructor(private updateComponentMutation: UpdateComponentGQL, private projectStore: ProjectStoreService,
              private authService: AuthenticationService, private getFullComponentQuery: GetComponentGQL,
              private createComponentMutation: CreateComponentGQL, private issueStore: IssueStoreService,
              private labelStore: LabelStoreService, private interfaceStore: InterfaceStoreService,
              private gs: IssueGraphStateService) {
    this.authService.currentUser.subscribe(user => this.userId = user.id);
  }

  createDemoProject() {
    // FIXME Api change
//     let projectId = '';
//     let projectCount = 0;
//
//     // get all projects to define the name of the newly created project
//     this.projectStore.getAll().subscribe(projects => {
//       projectCount = projects.length + 1;
//
//       // create project mutation
//       this.projectStore.create('Demo Project ' + projectCount, this.beschreibung).subscribe(({data}) => {
//         projectId = data.createProject.project.id;
//         // create shipping service
//         let input: CreateComponentInput = {
//           name: 'Shipping Service',
//           owner: this.userId,
//           imsType: ImsType.Ccims,
//           description: this.beschreibung,
//           projects: [projectId]
//         };
//         // CreateComponentMutation for the shipping service
//         this.createComponentMutation.mutate({input}).subscribe(({data}) => {
//           this.store['ss'] = {
//             id: data.createComponent.component.id,
//             issues: [],
//             labels: {}
//           };
//           // create default labels to label the issues
//           this.labelStore.createLabel({
//             name: 'Bug',
//             color: '#d31111',
//             components: [data.createComponent.component.id]
//           }).subscribe(label => this.store['ss'].labels.bug = {
//             id: label.data.createLabel.label.id,
//             name: label.data.createLabel.label.name
//           });
//           this.labelStore.createLabel({
//             name: 'Asian Expansion',
//             color: '#11d0d3',
//             components: [data.createComponent.component.id]
//           }).subscribe(label => this.store['ss'].labels.asienExpansion = {
//             id: label.data.createLabel.label.id,
//             name: label.data.createLabel.label.name
//           });
//           this.labelStore.createLabel({
//             name: 'Feature',
//             color: '#113bd3',
//             components: [data.createComponent.component.id]
//           }).subscribe(label => this.store['ss'].labels.feature = {
//             id: label.data.createLabel.label.id,
//             name: label.data.createLabel.label.name
//           });
//
// // because of async communication with the backend a timeout is used to ensure correct timin behavior
//           setTimeout(() => {
// // create the shipping service interface
//               this.interfaceStore.create('Shipment Status Interface', data.createComponent.component.id, 'LoremIpsum').subscribe(Cinterface => {
//                 this.store['ss'].interface = Cinterface.data.createComponentInterface.componentInterface.id;
//                 // create issues for shipping service
//                 let SSIssueInputList: Array<CreateIssueInput> = [{
//                   title: 'Orders from non EU countries are delivered late',
//                   componentIDs: [data.createComponent.component.id],
//                   body: 'Lorem Ipsum',
//                   category: IssueCategory.Bug,
//                   assignees: ['0'],
//                   locations: [Cinterface.data.createComponentInterface.componentInterface.id],
//                   labels: [this.store['ss'].labels.bug.id]
//                 }, {
//                   title: 'This issue describes a Bug',
//                   componentIDs: [data.createComponent.component.id],
//                   body: 'Lorem Ipsum',
//                   category: IssueCategory.Bug,
//                   assignees: ['0'],
//                   labels: this.store['ss'].labels.bug.id
//                 }, {
//                   title: 'Ship to Korea',
//                   componentIDs: [data.createComponent.component.id],
//                   body: 'Lorem Ipsum',
//                   category: IssueCategory.FeatureRequest,
//                   assignees: ['0'],
//                   labels: [this.store['ss'].labels.feature.id, this.store['ss'].labels.asienExpansion.id]
//                 }];
// // for each issue for the shipping service execute the CreateIssueMutation
//                 SSIssueInputList.forEach(element => {
//
//                   this.issueStore.create(element).subscribe(issue => {
//                     this.store['ss'].issues.push({
//                       id: issue.data.createIssue.issue.id,
//                       name: issue.data.createIssue.issue.title
//                     });
//                     if (element.title.match('Orders from non EU countries are delivered late')) {
//                       this.issueOnInterfaceId = issue.data.createIssue.issue.id;
//                     }
//                   });
//                 }); // end foreach
//               }); // end of interface create subscribe
//
//             },
//             1000);
//
//
//           // create order service in the same way the shipping service was created above
//           input = {
//             name: 'Order Service',
//             owner: this.userId,
//             imsType: ImsType.Ccims,
//             description: this.beschreibung,
//             projects: [projectId]
//           };
//           this.createComponentMutation.mutate({input}).subscribe(({data}) => {
//             this.store['os'] = {
//               id: data.createComponent.component.id,
//               issues: [],
//               labels: {}
//             };
//             // TODO create labels BUG FEATURE
//             this.labelStore.createLabel({
//               name: 'Bug',
//               color: '#d31111',
//               components: [data.createComponent.component.id]
//             }).subscribe(label => this.store['os'].labels.bug = {
//               id: label.data.createLabel.label.id,
//               name: label.data.createLabel.label.name
//             });
//             this.labelStore.createLabel({
//               name: 'Asian Expansion',
//               color: '#11d0d3',
//               components: [data.createComponent.component.id]
//             }).subscribe(label => this.store['os'].labels.asienExpansion = {
//               id: label.data.createLabel.label.id,
//               name: label.data.createLabel.label.name
//             });
//             this.labelStore.createLabel({
//               name: 'Feature',
//               color: '#113bd3',
//               components: [data.createComponent.component.id]
//             }).subscribe(label => this.store['os'].labels.feature = {
//               id: label.data.createLabel.label.id,
//               name: label.data.createLabel.label.name
//             });
//             // create interface consumuption
//             setTimeout(() => {
//                 //this.linkIssue(issueOnInterfaceId);
//
//                 this.gs.addConsumedInterface(data.createComponent.component.id, this.store['ss'].interface).subscribe();
//                 // create issues for order service
//                 this.createIssuesOs(data.createComponent.component.id);
//
//               },
//               1000);
//           });// end subscribe of createComponent order-service
//
//         }); // end subscribe of createComponent Shipping-service
//         console.log('got data', data);
//       }, (error) => {
//         console.log('there was an error sending the query', error);
//       });
//     }); // end of get projects
  }

  private linkIssue(obj) {
// link issue to issue obj
    this.store['os'].issues.forEach(element => {
      if (element.name.match('Ordering from non EU countries is not available')) {
        console.log('foud');

        const issueInput: LinkIssueInput = {
          issue: element.id,
          issueToLink: obj
        };
        this.issueStore.link(issueInput).subscribe(({data}) => {
          console.log(data);
          location.reload();


        }, (error) => {
          console.log('there was an error sending the query', error);

        });
      }
    });
  }

  private getprojectCount() {
    let count = 10;
    this.projectStore.getAll('').subscribe(projects => {
      count = projects.length + 1;
      return count;
    });
    return count;
  }

  private createIssuesOs(componentId) {
    // FIXME Api change
    //
    // let OSIssueInputList: Array<CreateIssueInput> = [{
    //   title: 'Ordering from non EU countries is not available',
    //   componentIDs: [componentId],
    //   body: 'Issue Body with Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    //   category: IssueCategory.Bug,
    //   assignees: ['0'],
    //   labels: [this.store['os'].labels.bug.id]
    // }, {
    //   title: 'Accept order from Korea',
    //   componentIDs: [componentId],
    //   body: 'Lorem Ipsum',
    //   category: IssueCategory.FeatureRequest,
    //   assignees: ['0'],
    //   labels: [this.store['os'].labels.feature.id, this.store['os'].labels.asienExpansion.id]
    // }, {
    //   title: 'This is an unclassified Issue',
    //   componentIDs: [componentId],
    //   body: 'Lorem Ipsum',
    //   category: IssueCategory.Unclassified,
    //   assignees: ['0'],
    //   labels: [this.store['os'].labels.asienExpansion.id]
    // }];
    //
    // OSIssueInputList.forEach(element => {
    //   this.issueStore.create(element).subscribe(issue => this.store['os'].issues.push({
    //     id: issue.data.createIssue.issue.id,
    //     name: issue.data.createIssue.issue.title
    //   }));
    // }); // end foreach
    //
    //
    // setTimeout(() => {
    //     this.linkIssue(this.issueOnInterfaceId);
    //
    //   },
    //   2000);
  }
}

