import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import * as m from 'app/services/swapi.models';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CharactersStoreService } from '../characters-store.service';

@Component({
    selector: 'app-characters-listing',
    templateUrl: './characters-listing.component.html',
    styleUrls: ['./characters-listing.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersListingComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();
    dataSource: MatTableDataSource<m.People> | null;
    searchForm: FormGroup;

    constructor(
        private charactersStore: CharactersStoreService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            film: [''],
            species: [''],
            yearsFrom: [''],
            yearsTo: ['']
        });

        this.charactersStore.characters$.pipe(
            takeUntil(this.destroy$)
        ).subscribe((characters) => {
            this.dataSource = new MatTableDataSource(characters);

            this.dataSource.filterPredicate = (item: m.People, filter: any) => {
                const filters = this.searchForm.value;
                const filterByFilm: boolean = filters.film ? true : false;
                const film: string = filters.film;
                const filterBySpecies: boolean = filters.species ? true : false;
                const species: string = filters.species;
                const filterByYearsFrom: boolean = filters.yearsFrom ? true : false;
                var yearsFrom: number = this.charactersStore.normalizeYear(filters.yearsFrom);
                const filterByYearsTo: boolean = filters.yearsTo ? true : false;
                var yearsTo: number = this.charactersStore.normalizeYear(filters.yearsTo);
                if (filterByYearsFrom && filterByYearsTo && yearsFrom > yearsTo) [yearsFrom, yearsTo] = [yearsTo, yearsFrom];

                return (!filterByFilm || item.films.indexOf(film) !== -1) &&
                       (!filterBySpecies || item.species.indexOf(species) !== -1) &&
                       (!filterByYearsFrom || yearsFrom <= this.charactersStore.normalizeYear(item.birth_year)) &&
                       (!filterByYearsTo || this.charactersStore.normalizeYear(item.birth_year) <= yearsTo) &&
                       ((filterByYearsFrom || yearsTo) && item.birth_year !== "unknown");
            };
            
        });

        this.searchForm.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        ).subscribe((newValue) => {
            if (this.dataSource) this.dataSource.filter = newValue;
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    private showCharacter(character: m.People): void {
        this.router.navigate(['/characters/' + character.id]);
    }
}