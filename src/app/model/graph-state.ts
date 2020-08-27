import { Component, IssuesState, IssueType, IssueRelationType } from './state';

export const exampleComponents: Component[] = [
  {
    "id": "f0f6426c-f9e4-56ee-a5de-5b37f431d4ca",
    "name": "order-service",
    "description": "",
    "issues": [
      "8ea071db-16e7-5c49-89e7-84ff07125028",
      "4305e18b-1f70-5164-ab3e-144b183eccd8",
      "7653fd8c-a0da-5fd2-a5a1-a4a093ec5667"
    ],
    "imsId": null,
    "imsRepository": null,
    "imsOwner": null,
    "interfaces": {},
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
    "issues": [
      "560762e2-06be-5374-a520-70cbdf98a82a",
      "df264bcf-95ff-51ed-8c0c-e36981b5baf2",
      "575f169f-0dfd-5f89-9eea-6b970acfb774",
      "7653fd8c-a0da-5fd2-a5a1-a4a093ec5667"
    ],
    "imsId": null,
    "imsRepository": null,
    "imsOwner": null,
    "interfaces": {
      "c4d9f5a3-4209-5999-a55b-1fed815685a8": {
        "id": "c4d9f5a3-4209-5999-a55b-1fed815685a8",
        "interfaceName": "shipping-service-interface",
        "issues": [
          "560762e2-06be-5374-a520-70cbdf98a82a"
        ]
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
    "issues": [
      "400b7b0a-389a-5faa-b3e0-91d7a16b19ad"
    ],
    "imsId": null,
    "imsRepository": null,
    "imsOwner": null,
    "interfaces": {
      "80fbb377-f87e-5435-86f9-9416e36ae949": {
        "id": "80fbb377-f87e-5435-86f9-9416e36ae949",
        "interfaceName": "payment-service-interface",
        "issues": [
          "400b7b0a-389a-5faa-b3e0-91d7a16b19ad"
        ]
      }
    },
    "componentRelations": []
  }
];

export const exampleIssues: IssuesState = {
  "8ea071db-16e7-5c49-89e7-84ff07125028": {
    "id": "8ea071db-16e7-5c49-89e7-84ff07125028",
    "title": "order-service bug",
    "type": IssueType.BUG,
    "textBody": "problem in accessing shipping service API",
    "htmlBody": "",
    "isOpen": true,
    "relatedIssues": [
      {
        "relatedIssueId": "560762e2-06be-5374-a520-70cbdf98a82a",
        "relationType": "DEPENDS"
      }
    ],
    "labels": [],
    "comments": []
  },
  "4305e18b-1f70-5164-ab3e-144b183eccd8": {
    "id": "4305e18b-1f70-5164-ab3e-144b183eccd8",
    "title": "order-service feature request",
    "type": IssueType.FEATURE_REQUEST,
    "textBody": "updating to fr of shipping service API",
    "htmlBody": "",
    "isOpen": true,
    "relatedIssues": [],
    "labels": [],
    "comments": []
  },
  "7653fd8c-a0da-5fd2-a5a1-a4a093ec5667": {
    "id": "7653fd8c-a0da-5fd2-a5a1-a4a093ec5667",
    "title": "cross-component feature request",
    "type": IssueType.FEATURE_REQUEST,
    "textBody": "applying to update in another API",
    "htmlBody": "",
    "isOpen": true,
    "relatedIssues": [
      {
        "relatedIssueId": "400b7b0a-389a-5faa-b3e0-91d7a16b19ad",
        "relationType": "DEPENDS"
      }
    ],
    "labels": [],
    "comments": []
  },
  "560762e2-06be-5374-a520-70cbdf98a82a": {
    "id": "560762e2-06be-5374-a520-70cbdf98a82a",
    "title": "shipping-service-interface bug",
    "type": IssueType.BUG,
    "textBody": "problem in API",
    "htmlBody": "",
    "isOpen": true,
    "relatedIssues": [
      {
        "relatedIssueId": "df264bcf-95ff-51ed-8c0c-e36981b5baf2",
        "relationType": "DEPENDS"
      }
    ],
    "labels": [],
    "comments": []
  },
  "df264bcf-95ff-51ed-8c0c-e36981b5baf2": {
    "id": "df264bcf-95ff-51ed-8c0c-e36981b5baf2",
    "title": "shipping-service bug",
    "type": IssueType.BUG,
    "textBody": "some problem within the component",
    "htmlBody": "",
    "isOpen": true,
    "relatedIssues": [],
    "labels": [],
    "comments": []
  },
  "575f169f-0dfd-5f89-9eea-6b970acfb774": {
    "id": "575f169f-0dfd-5f89-9eea-6b970acfb774",
    "title": "second shipping-service bug",
    "type": IssueType.BUG,
    "textBody": "some problem within the component",
    "htmlBody": "",
    "isOpen": true,
    "relatedIssues": [],
    "labels": [],
    "comments": []
  },
  "400b7b0a-389a-5faa-b3e0-91d7a16b19ad": {
    "id": "400b7b0a-389a-5faa-b3e0-91d7a16b19ad",
    "title": "payment-service-interface feature request",
    "type": IssueType.FEATURE_REQUEST,
    "textBody": "A new feature in this API",
    "htmlBody": "",
    "isOpen": true,
    "relatedIssues": [],
    "labels": [],
    "comments": []
  }
};
