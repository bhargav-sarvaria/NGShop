import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category, Product, ProductsService } from '@shreeshakti/products';
import { MessageService } from 'primeng/api';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentProductId: string; 
  categories: Category[];
  imageDisplay;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private formBuilder:FormBuilder,
    private productsService: ProductsService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this._initForm();
    this.getCategories();
    this._checkEditMode();
  }
    
  ngOnDestroy(): void {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private _checkEditMode() {
    this.route.params.subscribe( params => {
      if(params.id) {
        this.editMode = true;
        this.currentProductId = params.id;
        this.productsService.getProduct(params.id).pipe(takeUntil(this.endsubs$)).subscribe( product => {
          this.productForm.name.setValue(product.name);
          this.productForm.category.setValue(product.category.id);
          this.productForm.brand.setValue(product.brand);
          this.productForm.price.setValue(product.price);
          this.productForm.countInStock.setValue(product.countInStock);
          this.productForm.isFeatured.setValue(product.isFeatured);
          this.productForm.description.setValue(product.description);
          this.productForm.richDescription.setValue(product.richDescription);
          this.imageDisplay = product.image;
          this.productForm.image.setValidators([]);
          this.productForm.image.updateValueAndValidity();
        });
      }
    })
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false]
    })
  }

  private getCategories() {
    this.categoriesService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe( (categories) => {
      this.categories = categories;
    })
  }

  get productForm() {
    return this.form.controls;
  }
  
  onSubmit(){
    this.isSubmitted = true;
    if(this.form.invalid) return;

    const productFormData = new FormData();
    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);
    })
    if(this.editMode){
      this._updateProduct(productFormData);
    }else{
      this._addProduct(productFormData);
    }
  }

  private _updateProduct(productFormData: FormData){
    this.isSubmitted = false;
    this.productsService.updateProduct(productFormData, this.currentProductId).pipe(takeUntil(this.endsubs$)).subscribe( (product: Product) => {
      this.messageService.add({severity:'success', summary:'Success', detail:`${product.name} is updated!`});
      
      timer(2000).toPromise().then( () => {
        this.location.back();
      })
    }, ()=> {
      this.messageService.add({severity:'error', summary:'Error', detail:'Product is not updated!'});
    });
  }

  private _addProduct(productFormData: FormData){
    this.isSubmitted = false;
    this.productsService.createProduct(productFormData).pipe(takeUntil(this.endsubs$)).subscribe( (product: Product) => {
      this.messageService.add({severity:'success', summary:'Success', detail:`Product ${product.name} is created!`});
      this.form.reset();
      timer(2000).toPromise().then( () => {
        this.location.back();
      })
    }, ()=> {
      this.messageService.add({severity:'error', summary:'Error', detail:'Product is not created!'});
    });
  }

  onImageUpload(event) {
    const file = event.target.files[0];
    if(file) {
      this.form.patchValue({'image': file});
      this.form.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      }
      fileReader.readAsDataURL(file);

    }
  }

  onCancel(){
    this.location.back();
  }
}