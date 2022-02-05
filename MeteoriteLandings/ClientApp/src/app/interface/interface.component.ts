import { Continents } from './../enum/continents';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ThemePalette } from '@angular/material/core';
import { Params } from '../model/params.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.scss'],
})
export class InterfaceComponent implements OnInit {
  @Output() sendData = new EventEmitter();

  @Output() cancelEvent = new EventEmitter();

  task: Task = {
    name: 'Continents',
    completed: false,
    color: 'warn',
    subtasks: [],
  };

  fileName?: string;
  file?: File;

  minMass = 0;
  maxMass = 100000000;

  minDate = 1400;
  maxDate = 2013;

  actionSnackBar = 'Close';
  optionsSnackBar!: MatSnackBarConfig;

  launch = false;
  cancelAnimation = false;

  constructor(private _snackBar: MatSnackBar) {
    this.optionsSnackBar = new MatSnackBarConfig();
    this.optionsSnackBar.verticalPosition = 'top';
    this.optionsSnackBar.horizontalPosition = 'center';
    this.optionsSnackBar.duration = 4000;
  }

  ngOnInit(): void {
    const continents = Object.values(Continents).map(
      (value) => ({ name: value, completed: false, color: 'primary' } as Task)
    );
    this.task.subtasks = continents;
  }

  setFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      this.fileName = files[0].name;
      this.file = files[0];
      this.launch = true;
    }
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      if (value >= 1000000) {
        return Math.round(value / 1000000) + 'M';
      } else {
        return Math.round(value / 1000) + 'K';
      }
    }
    return value;
  }

  setMinimumMass(event: MatSliderChange) {
    this.minMass = event.value || 0;
  }

  setMaximumMass(event: MatSliderChange) {
    this.maxMass = event.value || 100000000;
  }

  setMaximumDate(value: number) {
    this.maxDate = value;
  }

  setMinimumDate(value: number) {
    this.minDate = value;
  }

  allComplete: boolean = false;
  updateAllComplete() {
    this.allComplete =
      this.task.subtasks != null &&
      this.task.subtasks.every((t) => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return (
      this.task.subtasks.filter((t) => t.completed).length > 0 &&
      !this.allComplete
    );
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach((t) => (t.completed = completed));
  }

  getEnableCheckbox() {
    if (!this.task.subtasks) {
      return [];
    }

    let subtasks: string[] = [];
    this.task.subtasks.forEach((subtask) => {
      if (subtask.completed) {
        subtasks.push(subtask.name);
      }
    });
    return subtasks;
  }

  emitData() {
    if (!this.file) {
      this._snackBar.open(
        'Please select a file',
        this.actionSnackBar,
        this.optionsSnackBar
      );
      return;
    }
    const continents = this.getEnableCheckbox();
    const params: Params = {
      continents: continents,
      minMass: this.minMass,
      maxMass: this.maxMass,
      minDate: this.minDate,
      maxDate: this.maxDate,
      file: this.file,
    };
    if (this.minMass < this.maxMass) {
      if (this.minDate < this.maxDate) {
        this.sendData.emit(params);
        this.cancelAnimation = true;
        this.launch = false;
      } else {
        this._snackBar.open(
          'The minimum date is greater than the maximum date',
          this.actionSnackBar,
          this.optionsSnackBar
        );
      }
    } else {
      this._snackBar.open(
        'The minimum mass is greater than the maximum mass',
        this.actionSnackBar,
        this.optionsSnackBar
      );
    }
  }

  stopAnimation() {
    this.launch = true;
    this.cancelAnimation = false;
    this.cancelEvent.emit(true);
  }
}
