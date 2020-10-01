import { Interface } from 'readline';
import { Component, Issue } from 'src/generated/graphql';


export interface GraphData {
  components: Component[];
  interfaces: Interface[];
  issueLocations: Map<Issue, Location>;
  issueLinks: Map<Issue, Issue>;
}
