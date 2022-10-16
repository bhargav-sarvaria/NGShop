import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[productsClickOutside]'
})
export class ProductsClickOutsideDirective {
  @Output() public productsClickOutside = new EventEmitter();
  constructor(private _elementRef: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
      const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
      if (!isClickedInside) {
          this.productsClickOutside.emit(null);
      }
  }
}
