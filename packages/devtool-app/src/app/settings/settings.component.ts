import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'krix-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  public stateStoreForm: FormGroup;
  public stateStoreNumOfEventsCtrl: FormControl;

  constructor (
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit (): void {
    this.stateStoreNumOfEventsCtrl = new FormControl(100);

    this.stateStoreForm = this.formBuilder.group({
      numOfEvents: this.stateStoreNumOfEventsCtrl,
    });
  }

}
