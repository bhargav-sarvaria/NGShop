import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../../models/product';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'products-search',
  templateUrl: './products-search.component.html',
  styles: [
  ]
})

export class ProductsSearchComponent {

  results: Product[];
  showDropdown = true;
  searchForm: FormGroup;
  valueChange;

  @Output() sidenavClose = new EventEmitter();
  @Output() searchResults = new EventEmitter();
  constructor(private formBuilder: FormBuilder, private searchService: SearchService, private router: Router) { 
    this.initForm();
    this.onChanges();
  }

  onChanges(): void {
    this.valueChange = this.searchForm.valueChanges.pipe(debounceTime(1200), distinctUntilChanged()).subscribe(updatedForm => {
      this.search(updatedForm.search);
    });
  }

  initForm(): FormGroup {
    return this.searchForm = this.formBuilder.group({
      search: ''
    });
  }

  toggleDropDown(){
    this.showDropdown = !this.showDropdown;
    this.searchResults.emit(this.showDropdown);
  }

  search(query) {
    if(!query) return;
    query = query.trim();
    if(query.length > 2) {
      this.searchService.getResults(query).subscribe((res)=>{
        this.results = res;
        this.showDropdown = this.results.length > 0 ? true : false;
        this.searchResults.emit(this.showDropdown);
      })
    }
  }

  onClick(id: string) {
    this.searchForm.reset();
    this.showDropdown = false;
    this.sidenavClose.emit();
    this.searchResults.emit(this.showDropdown);
    this.router.navigateByUrl(`products/${id}`);
  }
}
