import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { MovieResponseDTO, MovieRequestDTO } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})

export class MovieService {

  private urlApi: string = `${environment.apiUrl}/movies`;

  constructor(private http: HttpClient) { };

  // Public
  // Obtener todas las películas con estado "publicada"
  getPublishedMovies(): Observable<MovieResponseDTO[]> {
    return this.http.get<MovieResponseDTO[]>(`${this.urlApi}/all-movies-by-status/publicada`);
  }

  // Obtener películas por nombre
  getMoviesByName(name: string): Observable<MovieResponseDTO[]> {
    return this.http.get<MovieResponseDTO[]>(`${this.urlApi}/all-movies-by-name/${name}`);
  }
  
  // Obtener una pelicula por id
  getMovieById(id: number): Observable<MovieResponseDTO> {
    return this.http.get<MovieResponseDTO>(`${this.urlApi}/movie/${id}`);
  }

  // Administración de películas

  // Obtener todas las películas
  getAllMovies(): Observable<MovieResponseDTO[]> {
    return this.http.get<MovieResponseDTO[]>(this.urlApi);
  }

  // Crear una pelicula
  createMovie(movie: MovieRequestDTO): Observable<MovieRequestDTO> {
    return this.http.post<MovieRequestDTO>(`${this.urlApi}`, movie);
  }

  // Actualizar una pelicula
  updateMovie(id: number, movie: MovieRequestDTO): Observable<MovieRequestDTO> {
    return this.http.put<MovieRequestDTO>(`${this.urlApi}/${id}`, movie);
  }

  // Eliminar una pelicula
  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${id}`);
  }


}
