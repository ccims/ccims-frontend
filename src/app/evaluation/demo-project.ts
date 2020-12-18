import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/auth/authentication.service';
import { Component, ComponentInterface, CreateComponentGQL, CreateComponentInput, CreateIssueInput, DeleteComponentGQL, DeleteComponentInput, GetComponentGQL,
  GetComponentQuery, Ims, ImsType, Issue, IssueCategory, Maybe, UpdateComponentGQL, UpdateComponentInput, User } from 'src/generated/graphql';
import { map } from 'rxjs/operators';
import { ProjectStoreService } from '@app/data/project/project-store.service';
import { IssueStoreService } from '@app/data/issue/issue-store.service';
import { LabelStoreService } from '@app/data/label/label-store.service';
import { InterfaceStoreService } from '@app/data/interface/interface-store.service';
import { IssueGraphStateService } from '@app/data/issue-graph/issue-graph-state.service';

@Injectable({
  providedIn: 'root'
})

export class demoProject {
beschreibung:string = "Lorem Ipsum";
userId:string;
  constructor(private updateComponentMutation: UpdateComponentGQL, private projectStore: ProjectStoreService,
              private authService: AuthenticationService, private getFullComponentQuery: GetComponentGQL,
              private createComponentMutation: CreateComponentGQL, private issueStore: IssueStoreService,
              private labelStore: LabelStoreService,private interfaceStore: InterfaceStoreService,
              private gs: IssueGraphStateService)
              { this.authService.currentUser.subscribe(user => this.userId=user.id)}

createDemoProject(){
  let projectId = "";
  let projectCount= 0;
  let store = {};
  let issueOnInterfaceId = "";
  this.projectStore.getAll().subscribe(projects => projectCount = projects.length+1);
  this.projectStore.create("Demoprojekt"+this.getprojectCount(), this.beschreibung).subscribe(({ data}) => {
    projectId = data.createProject.project.id;
    // create shipping service
    let input:CreateComponentInput ={
      name:"shipping-service",
      owner:this.userId,
      imsType:ImsType.Ccims,
      description:this.beschreibung,
      projects:[projectId]
    }
    this.createComponentMutation.mutate({input}).subscribe(({data})=>{store["ss"]={id:data.createComponent.component.id,
                                                                                    issues:[],
                                                                                    labels:{}};
    // TODO create labels BUG FEATURE
      this.labelStore.createLabel({name:"Bug",color:"#d31111",components:[data.createComponent.component.id]}).subscribe(label=>store["ss"].labels.bug={id:label.data.createLabel.label.id,name:label.data.createLabel.label.name})
      this.labelStore.createLabel({name:"Feature",color:"#113bd3",components:[data.createComponent.component.id]}).subscribe(label=>store["ss"].labels.feature={id:label.data.createLabel.label.id,name:label.data.createLabel.label.name})



    // create interface
    this.interfaceStore.create("shipping-order-interface",data.createComponent.component.id,"LoremIpsum").subscribe(Cinterface=>{
      store["ss"].interface=Cinterface.data.createComponentInterface.componentInterface.id;
      // create issues for shipping service
    let SSIssueInputList:Array<CreateIssueInput> = [{
      title:"Issue 1 ist ein Bug",
      componentIDs: [data.createComponent.component.id],
      body:"Lorem Ipsum",
      category:IssueCategory.Bug,
      assignees: ['0'],
      locations:[Cinterface.data.createComponentInterface.componentInterface.id],
      labels:store["ss"].labels.bug.id
      },{
        title:"Issue 2 ist ein Bug",
        componentIDs: [data.createComponent.component.id],
        body:"Lorem Ipsum",
        category:IssueCategory.Bug,
        assignees: ['0'],
        labels:store["ss"].labels.bug.id
    },{
      title:"Ship to Korea",
      componentIDs: [data.createComponent.component.id],
      body:"Lorem Ipsum",
      category:IssueCategory.FeatureRequest,
      assignees: ['0'],
      labels:store["ss"].labels.feature.id
    }];
  SSIssueInputList.forEach(element => {

    this.issueStore.create(element).subscribe(issue=> {store["ss"].issues.push({id:issue.data.createIssue.issue.id,
      name:issue.data.createIssue.issue.title});
      if (element.title.match("Issue 1 ist ein Bug")){
        issueOnInterfaceId = issue.data.createIssue.issue.id;
      }
    })
  }); // end foreach
    }) // end of interface create subscribe


    // create order service
     input={
      name:"order-service",
      owner:this.userId,
      imsType:ImsType.Ccims,
      description:this.beschreibung,
      projects:[projectId]
    }
    this.createComponentMutation.mutate({input}).subscribe(({data})=>{store["os"]={id:data.createComponent.component.id,
                                                                                    issues:[],
                                                                                    labels:{}};
    // TODO create labels BUG FEATURE
      this.labelStore.createLabel({name:"Bug",color:"#d31111",components:[data.createComponent.component.id]}).subscribe(label=>store["os"].labels.bug={id:label.data.createLabel.label.id,name:label.data.createLabel.label.name})
      this.labelStore.createLabel({name:"Feature",color:"#113bd3",components:[data.createComponent.component.id]}).subscribe(label=>store["os"].labels.feature={id:label.data.createLabel.label.id,name:label.data.createLabel.label.name})
    // create interface consumuption
    this.gs.addConsumedInterface(data.createComponent.component.id,store["ss"].interface).subscribe();
    // create issues for order service
    let OSIssueInputList:Array<CreateIssueInput> = [{
      title:"Issue 1 ist ein Bug",
      componentIDs: [data.createComponent.component.id],
      body:"Lorem Ipsum",
      category:IssueCategory.Bug,
      assignees: ['0'],
      //labels:store["os"].labels.bug.id
      },{
        title:"Issue 2 ist ein FeatureRequest",
        componentIDs: [data.createComponent.component.id],
        body:"Lorem Ipsum",
        category:IssueCategory.Bug,
        assignees: ['0'],
        //labels:store["os"].labels.feature.id
    },{
      title:"Accept order from Korea",
      componentIDs: [data.createComponent.component.id],
      body:"Lorem Ipsum",
      category:IssueCategory.FeatureRequest,
      assignees: ['0'],
      //labels:store["os"].labels.feature.id
    }];

  OSIssueInputList.forEach(element => {
    this.issueStore.create(element).subscribe(issue=> store["os"].issues.push({id:issue.data.createIssue.issue.id,
      name:issue.data.createIssue.issue.title}))
  }); // end foreach


    })// end subscribe of createComponent order-service
  }) // end subscribe of createComponent Shipping-service
    console.log('got data', data);
    setTimeout(() =>
{
    this.linkIssue(issueOnInterfaceId);
},
3000);
  }, (error) => {
    console.log('there was an error sending the query', error);
  });
  // location.reload();
}
private linkIssue(obj){
// link issue to issue obj
// refresh page
location.reload();
}
private getprojectCount(){
  let count=10;
  this.projectStore.getAll().subscribe(projects => {count= projects.length+1;
  return count})
  return count;
}

}

