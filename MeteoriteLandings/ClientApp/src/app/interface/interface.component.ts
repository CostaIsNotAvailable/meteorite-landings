import { Continents } from './../enum/continents';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ThemePalette } from '@angular/material/core';
import { Params } from '../model/params.model';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.scss']
})
export class InterfaceComponent implements OnInit {
  
  @Output() sendData = new EventEmitter();
  
  task: Task = {
    name: 'Continents',
    completed: false,
    color: 'primary',
    subtasks: [],
  };

  fileName?: string;
  file?: File;

  sliderValue = 0;

  ngOnInit(): void {
      const continents = Object.values(Continents)
        .map((value) => ({ name: value, completed: false, color: "warn" } as Task));
      this.task.subtasks = continents;
  }

  setFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if(files){
      this.fileName = files[0].name;
      this.file = files[0];
    }
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      if(value >= 1000000){
        return Math.round(value / 1000000) + 'M';
      } else {
        return Math.round(value / 1000) + 'K';
      }
    }
    return value;
  }

  setSliderValue(event: MatSliderChange) {
    this.sliderValue = event.value || 0;
  }

  allComplete: boolean = false;
  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
  }

  getEnableCheckbox() {
    if(!this.task.subtasks){
      return [];
    }
    
    let subtasks: string[] = [];
    this.task.subtasks.forEach(subtask => {
      if(subtask.completed){
        subtasks.push(subtask.name);
      }
    });
    return subtasks;
  }

  emitData() {
    if(!this.file){
      return;
    }
    const continents = this.getEnableCheckbox();
    const params: Params = {
      continents: continents,
      mass: this.sliderValue,
      file: this.file
    }
    this.sendData.emit(params);
  }
}
