import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@shreeshakti/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  ngOnDestroy(): void {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  getCategories(){
    this.categoriesService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe(cats => {
      this.categories = cats;
    });
  }

  deleteCategory( categoryId: string){

    this.confirmationService.confirm({
      message: 'Do you want to delete this category ?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesService.deleteCategory(categoryId).pipe(takeUntil(this.endsubs$)).subscribe( () => {
          this.getCategories();
          this.messageService.add({severity:'success', summary:'Success', detail:'Category is deleted!'});
        }, () => {
          this.messageService.add({severity:'error', summary:'Success', detail:'Category is not deleted!'});
        });
      },
      reject: () => { }
    });

  }

  editCategory(categoryId: string) {
    this.router.navigateByUrl(`categories/form/${categoryId}`);
  }



}
