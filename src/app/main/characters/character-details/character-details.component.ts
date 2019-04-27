import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import * as m from 'app/services/swapi.models';
import { Observable } from 'rxjs';
import { CharactersStoreService } from '../characters-store.service';

@Component({
    selector: 'app-character-details',
    templateUrl: './character-details.component.html',
    styleUrls: ['./character-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CharacterDetailsComponent implements OnInit {

    constructor(private charactersStore: CharactersStoreService) { }

    ngOnInit() {
    }
}