import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngshop-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styles: [
  ]
})
export class SidenavListComponent {

  @Output() sidenavClose = new EventEmitter();
  hasSearchResults: boolean;
  constructor() { 
    this.hasSearchResults = false;
  }

  onSidenavClose(){
    this.sidenavClose.emit();
  }

  toggleSearchResults(event){
    this.hasSearchResults = event;
  }

}
