import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngshop-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Output() public sidenavToggle = new EventEmitter();
  constructor() { }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
}
