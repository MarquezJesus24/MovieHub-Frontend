import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieResponseDTO } from '../../../models/movie.model';
import { MovieService } from '../../../services/movie';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css'
})

export class MovieList implements OnInit {
  
  movies = signal<MovieResponseDTO[]>([]);
  filteredMovies = signal<MovieResponseDTO[]>([]);
  loading = signal(false);
  error = signal('');
  filterStatus = signal('TODOS');
  searchTerm = signal('');

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading.set(true);
    this.error.set('');
    
    // getAll() trae TODAS las películas
    this.movieService.getAllMovies().subscribe({
      next: (movies) => {
        // Guardar todas
        this.movies.set(movies);
        // Aplicar filtros
        this.applyFilters();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.error.set(err.message || 'Error al cargar películas');
        this.loading.set(false);
      }
    });
  }
  
  applyFilters(): void {
    let result = [...this.movies()];
    if (this.filterStatus() !== 'TODOS') {
      result = result.filter(m => m.status === this.filterStatus());    
    }
    
    if (this.searchTerm().trim()) {
      const term = this.searchTerm().toLowerCase();    
      result = result.filter(m => 
        m.name.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term)
      );
    }    
    this.filteredMovies.set(result);
  }
  
  /**
   * onFilterChange: Cuando cambia el filtro de estado
   * 
   * @param status - Nuevo estado ('TODOS', 'publicada', 'edicion')
   */
  onFilterChange(status: string): void {
    this.filterStatus.set(status);
    this.applyFilters();
  }
  
  /**
   * onSearchChange: Cuando cambia el texto de búsqueda
   * 
   * @param value - Nuevo texto
   */
  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.applyFilters();
  }
  
  createMovie(): void {
    this.router.navigate(['/admin/movies/new']);
  }
  
  editMovie(id: number): void {
    // Array: [ruta, parámetro1, parámetro2, ...]
    this.router.navigate(['/admin/movies/edit', id]);
  }
  
  deleteMovie(movie: MovieResponseDTO): void {
    const confirmado = confirm(`¿Eliminar "${movie.name}"?`);
    if (!confirmado) {
      return;
    }
    this.loading.set(true);    
    this.movieService.deleteMovie(movie.id).subscribe({
      next: () => {
        alert('Película eliminada');
        this.loadMovies();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al eliminar');
        this.loading.set(false);
      }
    });
  }  
    toggleStatus(movie: MovieResponseDTO): void {
    const newStatus = movie.status === 'publicada' 
      ? 'edicion'
      : 'publicada';
    
      if (!confirm(`¿Cambiar estado a ${newStatus}?`)) {
      return;
    }
    
    const updated = {
      name: movie.name,
      posterPath: movie.posterPath,
      description: movie.description,
      rating: movie.rating,
      status: newStatus  // Solo esto cambia
    };
    
    this.movieService.updateMovie(movie.id, updated).subscribe({
      next: () => {
        alert('Estado actualizado');
        this.loadMovies();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al actualizar');
      }
    });
  }

  getStatusClass(estado: string): string {
    // Operador ternario simple
    return estado === 'publicada' ? 'badge-success' : 'badge-warning';
  }
}