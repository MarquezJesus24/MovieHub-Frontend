import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieResponseDTO } from '../../../models/movie.model';
import { MovieService } from '../../../services/movie';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.css'
})
export class MovieDetail implements OnInit {
  
  movie = signal<MovieResponseDTO | undefined>(undefined);
  loading = signal(true);
  error = signal('');
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadMovie(id);
    });
  }
  
  loadMovie(id: number): void {
    this.loading.set(true);
    this.error.set('');
    
    this.movieService.getMovieById(id).subscribe({
      next: (movie) => {
        if (movie.status !== 'publicada') {
          this.error.set('Esta película no está disponible públicamente');
          this.loading.set(false);
          return;
        }
        
        this.movie.set(movie);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.error.set('No se pudo cargar la película');
        this.loading.set(false);
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/catalog']);
  }
  
  getRatingStars(): string {
    const rating = this.movie()?.rating || 0;
    const fullStars = Math.floor(rating / 2);
    return '⭐'.repeat(fullStars);
  }
}