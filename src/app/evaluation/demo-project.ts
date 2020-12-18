import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/auth/authentication.service';
import { Component, ComponentInterface, CreateComponentGQL, CreateComponentInput, CreateIssueInput, DeleteComponentGQL, DeleteComponentInput, GetComponentGQL,
  GetComponentQuery, Ims, ImsType, Issue, IssueCategory, LinkIssueInput, Maybe, UpdateComponentGQL, UpdateComponentInput, User } from 'src/generated/graphql';
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
store = {};
issueOnInterfaceId: string;
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


  this.projectStore.getAll().subscribe(projects => {projectCount = projects.length +1;

  this.projectStore.create("Demoprojekt "+projectCount, this.beschreibung).subscribe(({ data}) => {
    projectId = data.createProject.project.id;
    // create shipping service
    let input:CreateComponentInput ={
      name:"Shipping Service",
      owner:this.userId,
      imsType:ImsType.Ccims,
      description:this.beschreibung,
      projects:[projectId]
    }
    this.createComponentMutation.mutate({input}).subscribe(({data})=>{this.store["ss"]={id:data.createComponent.component.id,
                                                                                    issues:[],
                                                                                    labels:{}};
    // TODO create labels BUG FEATURE
      this.labelStore.createLabel({name:"Bug",color:"#d31111",components:[data.createComponent.component.id]}).subscribe(label=>this.store["ss"].labels.bug={id:label.data.createLabel.label.id,name:label.data.createLabel.label.name})
      this.labelStore.createLabel({name:"Asian Expansion",color:"#11d0d3",components:[data.createComponent.component.id]}).subscribe(label=>this.store["ss"].labels.asienExpansion={id:label.data.createLabel.label.id,name:label.data.createLabel.label.name})
      this.labelStore.createLabel({name:"Feature",color:"#113bd3",components:[data.createComponent.component.id]}).subscribe(label=>this.store["ss"].labels.feature={id:label.data.createLabel.label.id,name:label.data.createLabel.label.name})


      setTimeout(() =>
    {
// create interface
this.interfaceStore.create("shipping-order-interface",data.createComponent.component.id,"LoremIpsum").subscribe(Cinterface=>{
  this.store["ss"].interface=Cinterface.data.createComponentInterface.componentInterface.id;
  // create issues for shipping service
let SSIssueInputList:Array<CreateIssueInput> = [{
  title:"Orders from non EU countries are delivered late",
  componentIDs: [data.createComponent.component.id],
  body:"Lorem Ipsum",
  category:IssueCategory.Bug,
  assignees: ['0'],
  locations:[Cinterface.data.createComponentInterface.componentInterface.id],
  labels:this.store["ss"].labels.bug.id
  },{
    title:"Issue 2 ist ein Bug",
    componentIDs: [data.createComponent.component.id],
    body:"Lorem Ipsum",
    category:IssueCategory.Bug,
    assignees: ['0'],
    labels:this.store["ss"].labels.bug.id
},{
  title:"Ship to Korea",
  componentIDs: [data.createComponent.component.id],
  body:"Lorem Ipsum",
  category:IssueCategory.FeatureRequest,
  assignees: ['0'],
  labels:this.store["ss"].labels.asienExpansion.id
}];
SSIssueInputList.forEach(element => {

this.issueStore.create(element).subscribe(issue=> {this.store["ss"].issues.push({id:issue.data.createIssue.issue.id,
  name:issue.data.createIssue.issue.title});
  if (element.title.match("Orders from non EU countries are delivered late")){
    this.issueOnInterfaceId = issue.data.createIssue.issue.id;
  }
})
}); // end foreach
}) // end of interface create subscribe

  },
  1000);



    // create order service
     input={
      name:"Order Service",
      owner:this.userId,
      imsType:ImsType.Ccims,
      description:this.beschreibung,
      projects:[projectId]
    }
    this.createComponentMutation.mutate({input}).subscribe(({data})=>{this.store["os"]={id:data.createComponent.component.id,
                                                                                    issues:[],
                                                                                    labels:{}};
    // TODO create labels BUG FEATURE
      this.labelStore.createLabel({name:"Bug",color:"#d31111",components:[data.createComponent.component.id]}).subscribe(label=>this.store["os"].labels.bug={id:label.data.createLabel.label.id,name:label.data.createLabel.label.name})
      this.labelStore.createLabel({name:"Asian Expansion",color:"#11d0d3",components:[data.createComponent.component.id]}).subscribe(label=>this.store["os"].labels.asienExpansion={id:label.data.createLabel.label.id,name:label.data.createLabel.label.name})
      this.labelStore.createLabel({name:"Feature",color:"#113bd3",components:[data.createComponent.component.id]}).subscribe(label=>this.store["os"].labels.feature={id:label.data.createLabel.label.id,name:label.data.createLabel.label.name})
    // create interface consumuption
    setTimeout(() =>
    {
        //this.linkIssue(issueOnInterfaceId);

    this.gs.addConsumedInterface(data.createComponent.component.id,this.store["ss"].interface).subscribe();
    // create issues for order service
    this.createIssuesOs(data.createComponent.component.id);

  },
  1000);
    })// end subscribe of createComponent order-service

  }) // end subscribe of createComponent Shipping-service
    console.log('got data', data);
  }, (error) => {
    console.log('there was an error sending the query', error);
  });
}); // end of get projects
  // location.reload();
}
private linkIssue(obj){
// link issue to issue obj
this.store["os"].issues.forEach(element => {
  if (element.name.match("Orders from non EU countries are processed slowly")){
    console.log("foud");

    const issueInput: LinkIssueInput = {
      issue: element.id,
      issueToLink: obj
    };
    this.issueStore.link(issueInput).subscribe(({ data}) => {
      console.log(data);
      location.reload();


    }, (error) => {
      console.log('there was an error sending the query', error);

    });
  }
});
// refresh page
//location.reload();
}
private getprojectCount(){
  let count=10;
  this.projectStore.getAll().subscribe(projects => {count= projects.length+1;
  return count})
  return count;
}
private createIssuesOs(componentId){

  let OSIssueInputList:Array<CreateIssueInput> = [{
    title:"Orders from non EU countries are processed slowly",
    componentIDs: [componentId],
    body:"Lorem Ipsum",
    category:IssueCategory.Bug,
    assignees: ['0'],
    labels:this.store["os"].labels.asienExpansion.id
    },{
      title:"Issue 2 ist ein FeatureRequest",
      componentIDs: [componentId],
      body:"Lorem Ipsum",
      category:IssueCategory.FeatureRequest,
      assignees: ['0'],
      labels:this.store["os"].labels.feature.id
  },{
    title:"Accept order from Korea",
    componentIDs: [componentId],
    body:"Lorem Ipsum",
    category:IssueCategory.FeatureRequest,
    assignees: ['0'],
    labels:this.store["os"].labels.feature.id
  }];

OSIssueInputList.forEach(element => {
  this.issueStore.create(element).subscribe(issue=> this.store["os"].issues.push({id:issue.data.createIssue.issue.id,
    name:issue.data.createIssue.issue.title}))
}); // end foreach


setTimeout(() =>
{
  this.linkIssue(this.issueOnInterfaceId);

},
2000);
}
private createEmptyProject(){

}

}

