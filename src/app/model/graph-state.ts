import { Component, IssuesState, IssueType, IssueRelationType, GraphComponent } from './state';
import { Point } from '@ustutt/grapheditor-webcomponent/lib/edge';

const zeroPosition: Point = {x: 0, y: 0};
export const exampleGraph: GraphComponent[] = [
  {
    "id": "f0f6426c-f9e4-56ee-a5de-5b37f431d4ca",
    "name": "order-service",
    "description": "",
    "imsId": null,
    "imsRepository": null,
    "owner": null,
    "interfaces": {},
    "issueCounts": {
      "UNCLASSIFIED": 0,
      "BUG": 1,
      "FEATURE_REQUEST": 2
    },
    "position": zeroPosition,
    "componentRelations": [
      {
        "targetId": "c4d9f5a3-4209-5999-a55b-1fed815685a8",
        "targetType": "interface"
      },
      {
        "targetId": "80fbb377-f87e-5435-86f9-9416e36ae949",
        "targetType": "interface"
      }
    ]
  },
  {
    "id": "00414e0f-def0-5d75-8a2d-1853ca741595",
    "name": "shipping-service",
    "description": "",
    "issueCounts": {
      "UNCLASSIFIED": 0,
      "BUG": 3,
      "FEATURE_REQUEST": 1
    },
    "imsId": null,
    "imsRepository": null,
    "owner": null,
    position: zeroPosition,
    "interfaces": {
      "c4d9f5a3-4209-5999-a55b-1fed815685a8": {
        "id": "c4d9f5a3-4209-5999-a55b-1fed815685a8",
        "interfaceName": "shipping-service-interface",
        position: zeroPosition,
        "issueCounts": {
          "UNCLASSIFIED": 0,
          "BUG": 1,
          "FEATURE_REQUEST": 0
        },
      }
    },
    "componentRelations": [
      {
        "targetId": "80fbb377-f87e-5435-86f9-9416e36ae949",
        "targetType": "interface"
      }
    ]
  },
  {
    "id": "7c82f221-4775-50c9-af69-38bfe561c153",
    "name": "payment-service",
    "description": "",
    "imsId": null,
    "imsRepository": null,
    "owner": null,
    position: zeroPosition,
    "issueCounts": {
      "UNCLASSIFIED": 0,
      "BUG": 0,
      "FEATURE_REQUEST": 1
    },
    "interfaces": {
      "80fbb377-f87e-5435-86f9-9416e36ae949": {
        "position": zeroPosition,
        "id": "80fbb377-f87e-5435-86f9-9416e36ae949",
        "interfaceName": "payment-service-interface",
          "issueCounts": {
          "UNCLASSIFIED": 0,
          "BUG": 0,
          "FEATURE_REQUEST": 1
        },
      }
    },
    "componentRelations": []
  }
];
