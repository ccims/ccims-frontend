import * as Uuid from 'uuid/v5';
import { State, Project, Component, Issue, IssueType, IssueLocationType, IssueRelationType } from './state';
import { PROJECT_UUID_NAMESPACE, COMPONENT_UUID_NAMESPACE, COMPONENT_INTERFACE_UUID_NAMESPACE, ISSUE_UUID_NAMESPACE } from './namespace-constants';




const issueTemplate: Issue = {
    id: 'TODO',
    title: '',
    type: IssueType.BUG,
    textBody: '',
    htmlBody: '',
    isOpen: true,
    relatedIssues: [],
    labels: [],
    comments: [],
};


const issueA: Issue = {
    ...issueTemplate,
    id: Uuid('order-service bug', ISSUE_UUID_NAMESPACE),
    title: 'order-service bug',
    textBody: 'problem in accessing shipping service API',
};

const issueB: Issue = {
    ...issueTemplate,
    id: Uuid('order-service feature request', ISSUE_UUID_NAMESPACE),
    title: 'order-service feature request',
    textBody: 'updating to fr of shipping service API',
    type: IssueType.FEATURE_REQUEST,
};

const issueC: Issue = {
    ...issueTemplate,
    id: Uuid('shipping-service-interface bug', ISSUE_UUID_NAMESPACE),
    title: 'shipping-service-interface bug',
    textBody: 'problem in API',
};

const issueD: Issue = {
    ...issueTemplate,
    id: Uuid('shipping-service bug', ISSUE_UUID_NAMESPACE),
    title: 'shipping-service bug',
    textBody: 'some problem within the component',
};

const issueE: Issue = {
    ...issueTemplate,
    id: Uuid('second shipping-service bug', ISSUE_UUID_NAMESPACE),
    title: 'second shipping-service bug',
    textBody: 'some problem within the component',
};

const issueF: Issue = {
    ...issueTemplate,
    id: Uuid('cross-component feature request', ISSUE_UUID_NAMESPACE),
    title: 'cross-component feature request',
    textBody: 'applying to update in another API',
    type: IssueType.FEATURE_REQUEST,
};

const issueG: Issue = {
    ...issueTemplate,
    id: Uuid('payment-service-interface feature request', ISSUE_UUID_NAMESPACE),
    title: 'payment-service-interface feature request',
    textBody: 'A new feature in this API',
    type: IssueType.FEATURE_REQUEST,
};


issueA.relatedIssues = [
    {
        relatedIssueId: issueC.id,
        relationType: IssueRelationType.DEPENDS,
    }
];

issueC.relatedIssues = [
    {
        relatedIssueId: issueD.id,
        relationType: IssueRelationType.DEPENDS,
    }
];

issueF.relatedIssues = [
    {
        relatedIssueId: issueG.id,
        relationType: IssueRelationType.DEPENDS,
    }
];



const compInterfaceUUIDShipping: string = Uuid('shipping-service-interface', COMPONENT_INTERFACE_UUID_NAMESPACE);
const compInterfaceUUIDPayment: string = Uuid('payment-service-interface', COMPONENT_INTERFACE_UUID_NAMESPACE);

const compOrderService: Component = {
    id: Uuid('order-service', COMPONENT_UUID_NAMESPACE),
    name: 'order-service',
    description: '',
    issues: [issueA.id, issueB.id, issueF.id],
    imsId: null,
    imsRepository: null,
    imsOwner: null,
    interfaces: {},
    componentRelations: [
        {
            targetId: compInterfaceUUIDShipping,
            targetType: 'interface',
        },
        {
            targetId: compInterfaceUUIDPayment,
            targetType: 'interface',
        },
    ],
};

const compShippingService: Component = {
    id: Uuid('shipping-service', COMPONENT_UUID_NAMESPACE),
    name: 'shipping-service',
    description: '',
    issues: [issueC.id, issueD.id, issueE.id, issueF.id],
    imsId: null,
    imsRepository: null,
    imsOwner: null,
    interfaces: {
        [compInterfaceUUIDShipping]: {
            id: compInterfaceUUIDShipping,
            interfaceName: 'shipping-service-interface',
            issues: [issueC.id],
        }
    },
    componentRelations: [
        {
            targetId: compInterfaceUUIDPayment,
            targetType: 'interface',
        },
    ],
};

const compPaymentService: Component = {
    id: Uuid('payment-service', COMPONENT_UUID_NAMESPACE),
    name: 'payment-service',
    description: '',
    issues: [issueG.id],
    imsId: null,
    imsRepository: null,
    imsOwner: null,
    interfaces: {
        [compInterfaceUUIDPayment]: {
            id: compInterfaceUUIDPayment,
            interfaceName: 'payment-service-interface',
            issues: [issueG.id],
        }
    },
    componentRelations: [],
};


const projA: Project = {
    id: Uuid('sandros-project', PROJECT_UUID_NAMESPACE),

    name: 'sandros-project',
    description: 'Sandro\'s Project',
    projectOwnerName: 'Sandro',

    //imsURL: 'github.com/sandros-project',
    //imsProviderType: 'GitHub',
    //imsOwnerName: 'Sandro',

    //rsURL: 'github.com/sandros-project',
    //rsProviderType: 'GitHub',
    //rsOwnerName: 'Sandro',

    components: [
        compOrderService.id,
        compShippingService.id,
        compPaymentService.id,
    ],
};

const projB: Project = {
    id: Uuid('pse', PROJECT_UUID_NAMESPACE),

    name: 'pse',
    description: 'PSE',
    projectOwnerName: 'Sandro',

    //imsURL: 'github.com/pse',
    //imsProviderType: 'GitHub',
    //imsOwnerName: 'Sandro',

    //rsURL: 'github.com/pse',
    //rsProviderType: 'GitHub',
    //rsOwnerName: 'Sandro',

    components: [
        compOrderService.id,
        compShippingService.id,
        compPaymentService.id,
    ],
};

const projC: Project = {
    id: Uuid('pizza-calculator', PROJECT_UUID_NAMESPACE),

    name: 'pizza-calculator',
    description: 'PizzaCalculator',
    projectOwnerName: 'Sandro',

    //imsURL: 'github.com/pizza-calculator',
    //imsProviderType: 'GitHub',
    //imsOwnerName: 'Sandro',

    //rsURL: 'github.com/pizza-calculator',
    //rsProviderType: 'GitHub',
    //rsOwnerName: 'Sandro',

    components: [
        compOrderService.id,
        compShippingService.id,
        compPaymentService.id,
    ],
};



export const DEMO_INITIAL_STATE: State = {
    projects: {
        [projA.id]: projA,
        [projB.id]: projB,
        [projC.id]: projC,
    },
    components: {
        [compOrderService.id]: compOrderService,
        [compShippingService.id]: compShippingService,
        [compPaymentService.id]: compPaymentService,
    },
    issues: {
        [issueA.id]: issueA,
        [issueB.id]: issueB,
        [issueC.id]: issueC,
        [issueD.id]: issueD,
        [issueE.id]: issueE,
        [issueF.id]: issueF,
        [issueG.id]: issueG,
    },
    issueGraphs: {
    },
};
