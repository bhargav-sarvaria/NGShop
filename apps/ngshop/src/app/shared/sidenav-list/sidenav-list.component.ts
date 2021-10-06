import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngshop-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styles: [
  ]
})
export class SidenavListComponent {

  @Output() sidenavClose = new EventEmitter();

  constructor() { }

  onSidenavClose(){
    this.sidenavClose.emit();
  }

}
