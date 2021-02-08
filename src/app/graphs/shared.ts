import { IssueCategory } from 'src/generated/graphql';
import { FilterSelection } from './label-search/label-search.component';

type EnumDictionary<T extends string | symbol | number, U> = {
  [K in T]: U;
};

export type SelectedCategories = EnumDictionary<IssueCategory, boolean>;

export interface FilterState {
  selectedCategories: SelectedCategories;
  selectedFilter: FilterSelection;
}
