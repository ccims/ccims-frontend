import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LabelStoreService} from '@app/data/label/label-store.service';
import {CreateLabelInput, GetComponentQuery} from '../../generated/graphql';
import {FormControl, Validators} from '@angular/forms';
import {ComponentStoreService} from '@app/data/component/component-store.service';
import {NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-label-selector-component',
  templateUrl: './label-selector.component.html',
  styleUrls: ['./label-selector.component.scss']
})
export class LabelSelectorComponent implements OnInit {
  @Input() componentId: string;
  @Input() selectedLabels: Array<string> = [];
  @ViewChild('labelName') nameInput: ElementRef;
  @ViewChild('labelDescription') descriptionInput: ElementRef;
  @ViewChild('labelSelector') labelSelector: NgSelectComponent;

  public loading = false;

  component: GetComponentQuery;
  componentLabels = [];
  validationLabelName = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  color = '#d31111'; // The default color for the label color picker
  newLabelOpen = false;
  saveFailed = false;

  constructor(public labelStore: LabelStoreService, private componentStoreService: ComponentStoreService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.componentStoreService.getFullComponent(this.componentId).subscribe(component => {
      this.component = component;
      this.componentLabels = component.node.labels.nodes;
    }, () => {
      // TODO: Proper error handling
      alert('Failed to get component details');
    });
  }

  async onNewLabelClick(): Promise<void> {
    this.newLabelOpen = true;
    this.changeDetector.detectChanges(); // Make sure div is visible before focusing
    this.nameInput.nativeElement.focus();
  }

  onLabelCancelClick(): void {
    this.reset();
  }

  reset(): void {
    this.newLabelOpen = false;
    this.validationLabelName.setValue('');
    this.descriptionInput.nativeElement.value = '';
  }

  onConfirmCreateLabelClick(name: string, description?: string) {
    const input: CreateLabelInput = {
      name,
      color: this.color,
      components: [this.component.node.id],
      description
    };

    this.loading = true;
    this.labelStore.createLabel(input).subscribe(({data}) => {
      this.loading = false;
      // save returned label to labels
      const label = {name: data.createLabel.label.name, id: data.createLabel.label.id, color: this.color};
      this.componentLabels.push(label);
      this.reset();
      this.labelSelector.select({value: label.id});
    }, (error) => {
      // TODO: Proper error handling
      console.log('there was an error sending the query', error);
      this.loading = false;
      this.saveFailed = true;
    });
  }
}
