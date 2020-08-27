import * as Uuid from 'uuid/v5';

const ROOT_NAMESPACE = 'e4b9e0ea-b368-4306-8288-1afcd2631b3c';

export const PROJECT_UUID_NAMESPACE = Uuid('CCIMS-Project', ROOT_NAMESPACE);
export const COMPONENT_UUID_NAMESPACE = Uuid('CCIMS-Component', ROOT_NAMESPACE);
export const COMPONENT_INTERFACE_UUID_NAMESPACE = Uuid('CCIMS-ComponentInterface', ROOT_NAMESPACE);
export const ISSUE_UUID_NAMESPACE = Uuid('CCIMS-IssueNamespace', ROOT_NAMESPACE);
