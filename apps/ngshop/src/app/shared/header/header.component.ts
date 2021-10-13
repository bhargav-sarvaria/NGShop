import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngshop-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  @Output() public sidenavToggle = new EventEmitter();
  constructor() { }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
}
