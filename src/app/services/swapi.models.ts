interface BaseEntity {
    detail?: string;
}

interface Entity extends BaseEntity {
    url: string;
    created: Date;
    edited: Date;
}

export interface List<T> extends BaseEntity {
    count: number;
    next: string;
    previous: string;
    results: T[];
}

export interface People extends Entity {
    id?: string;
    birth_year: string;
    eye_color: string;
    films: string[];
    filmsRef?: Film[];
    gender: string;
    hair_color: string;
    height: string;
    homeworld: string;
    mass: string;
    name: string;
    skin_color: string;
    species: string[];
    speciesRef?: Species[];
    starships: string[];
    starshipsRef?: Starship[];
    vehicles: string[];
}

export interface Film extends Entity {
    characters: string[];
    director: string;
    episode_id: number;
    opening_crawl: string;
    planets: string[];
    producer: string;
    release_date: string;
    species: string[];
    starships: string[];
    title: string;
    vehicles: string[];
}

export interface Species extends Entity {
    average_height: string;
    average_lifespan: string;
    classification: string;
    designation: string;
    eye_colors: string;
    hair_colors: string;
    homeworld: string;
    language: string;
    name: string;
    people: string[];
    films: string[];
    skin_colors: string;
}

export interface Starship extends Entity {
    MGLT: string;
    cargo_capacity: string;
    consumables: string;
    cost_in_credits: string;
    crew: string;
    hyperdrive_rating: string;
    length: string;
    manufacturer: string;
    max_atmosphering_speed: string;
    model: string;
    name: string;
    passengers: string;
    films: string[];
    pilots: string[];
    starship_class: string;
}