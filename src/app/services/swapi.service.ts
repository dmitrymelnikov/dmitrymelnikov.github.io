import { Injectable } from '@angular/core';
import * as m from 'app/services/swapi.models';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SwapiService {
    readonly baseUrl = 'https://swapi.co/api/';

    constructor(private http: HttpClient) { }

    public listCharacters(page: number): Observable<m.List<m.People>> {
        return this.http.get<m.List<m.People>>(this.baseUrl + 'people?page=' + page);
    }

    public listFilms(page: number): Observable<m.List<m.Film>> {
        return this.http.get<m.List<m.Film>>(this.baseUrl + 'films?page=' + page);
    }

    public listSpecies(page: number): Observable<m.List<m.Species>> {
        return this.http.get<m.List<m.Species>>(this.baseUrl + 'species?page=' + page);
    }

    public listStarships(page: number): Observable<m.List<m.Starship>> {
        return this.http.get<m.List<m.Starship>>(this.baseUrl + 'starships?page=' + page);
    }
}