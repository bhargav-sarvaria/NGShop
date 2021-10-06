import { Component, OnInit } from '@angular/core';
import {ProductsService} from '../../services/products.service';
import {Product} from '../../models/product';
import {CategoriesService} from '../../services/categories.service';
import {Category} from '../../models/category';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit {

  isCategoryPage?: boolean;
  categoryId: string;
  products: Product[] = [];
  categories: Category[] = [];

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if(params.categoryid){
        this.isCategoryPage = true;
        this.categoryId = params.categoryid;
        this._getProducts([params.categoryid]);
      } else {
        this._getProducts();
      }
    });
    this._getCategories();
  }

  private _getProducts(categoriesFilter?: string[]) {
    this.productsService.getProducts(categoriesFilter).subscribe( (products) => {
      this.products = products;
    });
  }

  private _getCategories() {
    this.categoriesService.getCategories().subscribe( (categories) => {
      this.categories = categories;
    });
  }

  categoryFilter() {
    const selectedCategories = this.categories.filter(category => category.checked).map(category => category.id);
    this._getProducts(selectedCategories);
  }
}
