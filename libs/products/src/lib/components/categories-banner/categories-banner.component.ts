import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'products-categories-banner',
  templateUrl: './categories-banner.component.html',
  styles: [
  ]
})
export class CategoriesBannerComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  endSubs$: Subject<any> = new Subject();
  constructor(
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.categoriesService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe( (categories) => {
        this.categories = categories;
    });
  }
  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

}
