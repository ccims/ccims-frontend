import { IssueCategory } from 'src/generated/graphql';
import { FilterLabel } from '../data/label/label-store.service';

type EnumDictionary<T extends string | symbol | number, U> = {
  [K in T]: U;
};

export type SelectedCategories = EnumDictionary<IssueCategory, boolean>;

export interface FilterState {
  selectedCategories: SelectedCategories;
  selectedLabels: FilterLabel[];
}
