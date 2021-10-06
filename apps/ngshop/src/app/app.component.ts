import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { UsersService } from '@shreeshakti/users';

@Component({
  selector: 'ngshop-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'ngshop';
  navbarfixed = false;

  doc = document.documentElement;
  w = window;
  prevScroll = this.w.scrollY || this.doc.scrollTop;
  curScroll;
  direction = 0;
  prevDirection = 0; 
  header;
  hide = false;
  @ViewChild('matSidenavContent') content: ElementRef;

  constructor(private usersService: UsersService){}

  ngOnInit(): void{

    this.usersService.initAppSession();
    this.header = document.getElementById('site-header');
    document.getElementsByClassName('track-scrolling')[0].addEventListener('scroll', e => {
      const target  = e.target as Element;
      this.onscroll(target.scrollTop);
      
    }, false);
  }

  onscroll(scrollTop){
    this.curScroll = scrollTop;
    if (this.curScroll > this.prevScroll) { 
      //scrolled up
      this.direction = 2;
    }
    else if (this.curScroll < this.prevScroll) { 
      //scrolled down
      this.direction = 1;
    }
    if (this.direction !== this.prevDirection) {
      this.toggleHeader(this.direction, this.curScroll);
    }

    this.prevScroll = this.curScroll;
  }

  toggleHeader(direction, curScroll) {
    if (direction === 2 && curScroll > 120) { 
      this.hide = true;
      this.header.classList.add('hide');
      this.prevDirection = direction;
    }
    else if (direction === 1) {
      this.hide = false;
      this.header.classList.remove('hide');
      this.prevDirection = direction;
    }
  }
}
