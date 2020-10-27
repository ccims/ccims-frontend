import { IssueCategory } from 'src/generated/graphql';

type EnumDictionary<T extends string | symbol | number, U> = {
  [K in T]: U;
};

export type FilterState = EnumDictionary<IssueCategory, boolean>;

export const initialFilter: FilterState = {
  [IssueCategory.Bug]: true,
  [IssueCategory.FeatureRequest]: true,
  [IssueCategory.Unclassified]: true
};
