import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MovieResponseDTO } from '../../../models/movie.model';
import { MovieService } from '../../../services/movie';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-movie-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movie-catalog.html',
  styleUrl: './movie-catalog.css',
})


export class MovieCatalog implements OnInit {

  movies = signal<MovieResponseDTO[]>([]);
  searchTerm = signal<string>('');
  filteredMovies = signal<MovieResponseDTO[]>([]);
  sortBy = signal<'rating' | 'fechaCreacion' | 'nombre'>('rating');
  loading = signal<boolean>(false);
  error = signal<string>('');


  constructor(private movieService: MovieService) { } ngOnInit(): void {
    this.loadMovies();
  }
  ;

  loadMovies(): void {

    this.loading.set(true);
    this.error.set('');

    this.movieService.getPublishedMovies()
      .subscribe({

        next: (movies) => {
          console.log('Películas recibidas:', movies);
          this.movies.set(movies);
          this.filteredMovies.set(movies);
          this.sortBy();
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar películas:', err);
          this.error.set('Error al cargar las películas');
          this.loading.set(false);
        }
      });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);

    if (!value.trim()) {
      this.filteredMovies.set(this.movies());
      this.sortBy();
      return;
    }

    this.loading.set(true);

    this.movieService.getMoviesByName(value)
      .subscribe({
        next: (movies) => {
          this.filteredMovies.set(movies);
          this.sortBy();
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al buscar películas:', err);
          this.error.set('Error al buscar las películas');
          this.loading.set(false);
        }
      });

  }

  applySort(): void {
    const actualMovies = [...this.filteredMovies()];

    actualMovies.sort((a, b) => {
      switch (this.sortBy()) {
        case 'rating':
          return b.rating - a.rating;
        case 'fechaCreacion':
          return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
        case 'nombre':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    this.filteredMovies.set(actualMovies);
  }

  onSortChange(value: 'rating' | 'fechaCreacion' | 'nombre'): void {
    this.sortBy.set(value);
    this.applySort();
  }
}
