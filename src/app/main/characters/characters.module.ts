import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatInputModule, MatTableModule, MatFormFieldModule, MatSelectModule, MatSliderModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { CharacterDetailsComponent } from './character-details/character-details.component';
import { CharactersListingComponent } from './characters-listing/characters-listing.component';
import { CharactersStoreService } from './characters-store.service';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: CharactersListingComponent,
        resolve: {
            data: CharactersStoreService
        }
    },
    {
        path: ':id',
        component: CharacterDetailsComponent,
        resolve: {
            data: CharactersStoreService
        }
    }];

@NgModule({
    declarations: [CharactersListingComponent, CharacterDetailsComponent],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSliderModule,

        CommonModule,
        ReactiveFormsModule,

        FuseSharedModule,
        FuseSidebarModule
    ],
    providers: [
        CharactersStoreService
    ]
})
export class CharactersModule { }
