import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject, Subscription, forkJoin, of, throwError } from 'rxjs';
import { SwapiService } from 'app/services/swapi.service';
import { catchError, switchMap, map, tap, concat, delay, retry } from 'rxjs/operators';
import * as m from 'app/services/swapi.models';
import { Function1 } from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CharactersStoreService implements Resolve<any> {
    private _characters: BehaviorSubject<m.People[]> = new BehaviorSubject([]);
    private _films: BehaviorSubject<m.Film[]> = new BehaviorSubject([]);
    private _species: BehaviorSubject<m.Species[]> = new BehaviorSubject([]);
    private _starships: BehaviorSubject<m.Starship[]> = new BehaviorSubject([]);
    private _resourcesLinked: boolean = false;
    private _selectedCharacter: BehaviorSubject<m.People> = new BehaviorSubject(null);
    private _birthDates: BehaviorSubject<string[]> = new BehaviorSubject([]);

    get characters$() { return this._characters.asObservable(); }
    get films$() { return this._films.asObservable(); }
    get species$() { return this._species.asObservable(); }
    get starships$() { return this._starships.asObservable(); }
    get selectedCharacter$() { return this._selectedCharacter.asObservable(); }
    get birthDates$() { return this._birthDates.asObservable(); }

    constructor(private swapi: SwapiService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return forkJoin([
            this.loadAllCharacters(),
            this.loadAllFilms(),
            this.loadAllSpecies(),
            this.loadAllStarships()
        ]).pipe(
            tap(() => {
                this.linkResources();

                const characterId = route.params['id'];
                if (characterId) this._selectedCharacter.next(this._characters.value.find(i => i.id == characterId));
            })
        );
    }

    private loadAllCharacters(): Observable<m.People[]> {
        return this.loadAll<m.People>((page) => this.swapi.listCharacters(page), this._characters);
    }

    private loadAllFilms(): Observable<m.Film[]> {
        return this.loadAll<m.Film>((page) => this.swapi.listFilms(page), this._films);
    }

    private loadAllSpecies(): Observable<m.Species[]> {
        return this.loadAll<m.Species>((page) => this.swapi.listSpecies(page), this._species);
    }

    private loadAllStarships(): Observable<m.Starship[]> {
        return this.loadAll<m.Starship>((page) => this.swapi.listStarships(page), this._starships);
    }

    private loadAll<T>(loadMethod: Function1<number, Observable<m.List<T>>>, storage: BehaviorSubject<T[]>): Observable<T[]> {
        if (storage.value.length) return of(null).pipe(delay(0)); // don't refresh data

        const firstPage = loadMethod(1);

        return firstPage.pipe(
            switchMap((list: m.List<T>) => {
                const pagesCount: number = Math.ceil(list.count / 10);

                const otherPages: Observable<T[]>[] = [];
                for (var i = 2; i <= pagesCount; i++)
                    otherPages.push(loadMethod(i).pipe(map(i => i.results)));

                return forkJoin([firstPage.pipe(map(i => i.results)), ...otherPages]);
            }),
            map((pages: T[][]) => pages.reduce((acc, item) => [...acc, ...item])),
            tap((result) => { storage.next(result); }),
            retry(2),
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    private linkResources(): void {
        if (this._resourcesLinked) return;

        const films = this._films.getValue();
        const species = this._species.getValue();
        const starships = this._starships.getValue();
        var birthDates: string[] = [];

        this._characters.getValue().forEach((character) => {
            [, character.id] = /(\d+)\/$/.exec(character.url);

            if (character.birth_year != "unknown" && birthDates.indexOf(character.birth_year) == -1)
                birthDates.push(character.birth_year);

            character.filmsRef = character.films.map((film) => films.find(i => i.url == film));
            character.speciesRef = character.species.map((sp) => species.find(i => i.url == sp));
            character.starshipsRef = character.starships.map((ship) => starships.find(i => i.url == ship));
        });

        birthDates = birthDates.sort((a, b) => this.normalizeYear(a) - this.normalizeYear(b));
        this._birthDates.next(birthDates);

        this._resourcesLinked = true;
    }

    public normalizeYear(year: string): number {
        if (!year || year == "unknown") return Number.MIN_VALUE;
        return parseInt(year.substr(0, year.length - 3)) * (year.endsWith("BBY") ? -1 : 1);
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        //console.error(error);
        return throwError(error);
    }
}