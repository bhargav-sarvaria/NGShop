import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@shreeshakti/products';
import { MessageService } from 'primeng/api';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentCategoryId: string; 
  endsubs$: Subject<any> = new Subject();

  constructor(private formBuilder:FormBuilder,
     private categoriesService: CategoriesService,
     private messageService: MessageService,
     private location: Location,
     private route: ActivatedRoute
     ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color :['#fff']
    });
    this._checkEditMode();
  }

  ngOnDestroy(): void {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  get categoryForm(){
    return this.form.controls;
  }

  private _checkEditMode(){
    this.route.params.subscribe( params => {
      if(params.id) {
        this.editMode = true;
        this.currentCategoryId = params.id;
        this.categoriesService.getCategory(params.id).pipe(takeUntil(this.endsubs$)).subscribe( category => {
          this.categoryForm.name.setValue(category.name);
          this.categoryForm.icon.setValue(category.icon);
          this.categoryForm.color.setValue(category.color);
        });
      }
    })
  }

  private _addCategory(category: Category){
    this.categoriesService.createCategory(category).pipe(takeUntil(this.endsubs$)).subscribe( (category: Category) => {
      this.messageService.add({severity:'success', summary:'Success', detail:`Category ${category.name} is created!`});
      this.form.reset();
      this.isSubmitted = false;
      timer(2000).toPromise().then( () => {
        this.location.back();
      })
    }, ()=> {
      this.messageService.add({severity:'error', summary:'Error', detail:'Category is not created!'});
    });
  }

  private _updateCategory(category: Category){
    this.categoriesService.updateCategory(category).subscribe( (category: Category) => {
      this.messageService.add({severity:'success', summary:'Success', detail:`Category ${category.name} is updated!`});
      this.isSubmitted = false;
      timer(2000).toPromise().then( () => {
        this.location.back();
      })
    }, ()=> {
      this.messageService.add({severity:'error', summary:'Error', detail:'Category is not updated!'});
    });
  }

  back(){
    this.location.back();
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.form.invalid){
      return;
    }

    const category: Category = {
      id: this.currentCategoryId,
      name: this.categoryForm.name.value,
      icon: this.categoryForm.icon.value,
      color: this.categoryForm.color.value
    }

    if(this.editMode){
      this._updateCategory(category);
    }else{
      this._addCategory(category);
    }
  }

}
