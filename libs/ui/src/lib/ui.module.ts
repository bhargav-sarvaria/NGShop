import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './components/banner/banner.component';
import {ButtonModule} from 'primeng/button';
import { GalleryComponent } from './components/gallery/gallery.component';

@NgModule({
    imports: [
      CommonModule,
      ButtonModule
    ],
    exports: [
      BannerComponent,
      ButtonModule,
      GalleryComponent
    ],
    declarations: [
      BannerComponent,
      GalleryComponent
    ]
    
})
export class UiModule {}
