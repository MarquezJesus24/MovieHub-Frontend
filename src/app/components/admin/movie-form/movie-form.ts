import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../../services/movie';
import { MovieRequestDTO } from '../../../models/movie.model';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './movie-form.html',
  styleUrl: './movie-form.css'
})

export class MovieForm implements OnInit {

  movieForm!: FormGroup;
  isEditMode = signal(false);
  movieId = signal<number | undefined>(undefined);
  loading = signal(false);
  submitting = signal(false);
  error = signal('');
  imagePreview = signal('');
  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    // Crear FormGroup
    this.movieForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],

      posterPath: [
        '',
        [
          Validators.required,
          Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000)
        ]
      ],
      rating: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(10)
        ]
      ],
      status: [
        'Edicion',
        Validators.required
      ]
    });
    this.movieForm.get('posterPath')?.valueChanges.subscribe(url => {
      this.updateImagePreview(url);
    });
  }
  checkEditMode(): void {
    // Suscribirse a parámetros de la ruta
    this.route.params.subscribe(params => {
      // params es un objeto: { id: 'valor' }

      const id = params['id'];

      if (id) {
        // HAY ID → Modo edición
        this.isEditMode.set(true);

        // Convertir string a number
        // +string = Number(string)
        this.movieId.set(+id);

        // Cargar datos de la película
        this.loadMovie(+id);
      } else {
        // NO HAY ID → Modo creación
        this.isEditMode.set(false);
        this.movieId.set(undefined);
      }
    });
  }

  loadMovie(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.movieService.getMovieById(id).subscribe({
      next: (movie) => {
        this.movieForm.patchValue({
          name: movie.name,
          posterPath: movie.posterPath,
          description: movie.description,
          rating: movie.rating,
          status: movie.status,
        });

        this.updateImagePreview(movie.posterPath);

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando película:', err);
        this.error.set('No se pudo cargar la película');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.movieForm.invalid) {
      this.movieForm.markAllAsTouched();
      this.error.set('Por favor, completa todos los campos correctamente');
      return;
    }

    this.submitting.set(true);
    this.error.set('');
    const movieData: MovieRequestDTO = this.movieForm.value;
    const request = this.isEditMode() && this.movieId()
      ? this.movieService.updateMovie(this.movieId()!, movieData)  // Actualizar
      : this.movieService.createMovie(movieData);                   // Crear
    request.subscribe({
      next: (response) => {
        console.log('Película guardada:', response);

        const mensaje = this.isEditMode()
          ? 'Película actualizada exitosamente'
          : 'Película creada exitosamente';

        alert(mensaje);

        this.router.navigate(['/admin/movies']);
      },
      error: (err) => {
        console.error('Error guardando película:', err);
        this.error.set(err.message || 'Error al guardar la película');
        this.submitting.set(false);
      }
    });
  }

  onCancel(): void {
    if (this.movieForm.dirty) {
      const confirmar = confirm('¿Seguro que deseas salir? Los cambios no guardados se perderán.');

      if (!confirmar) {
        return;
      }
    }
    this.router.navigate(['/admin/movies']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.movieForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.movieForm.get(fieldName);

    if (!field) return '';

    // Campo obligatorio
    if (field.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    // Longitud mínima
    if (field.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength'].requiredLength;
      const actualLength = field.errors?.['minlength'].actualLength;
      return `Mínimo ${requiredLength} caracteres (actual: ${actualLength})`;
    }

    // Longitud máxima
    if (field.hasError('maxlength')) {
      const requiredLength = field.errors?.['maxlength'].requiredLength;
      return `Máximo ${requiredLength} caracteres`;
    }

    // Valor mínimo
    if (field.hasError('min')) {
      const min = field.errors?.['min'].min;
      return `El valor mínimo es ${min}`;
    }

    // Valor máximo
    if (field.hasError('max')) {
      const max = field.errors?.['max'].max;
      return `El valor máximo es ${max}`;
    }

    // Patrón (regex)
    if (field.hasError('pattern')) {
      return 'Debe ser una URL válida de imagen (jpg, png, gif, webp)';
    }

    return 'Campo inválido';
  }


  getFieldClass(fieldName: string): string {
    const field = this.movieForm.get(fieldName);

    if (!field || (!field.dirty && !field.touched)) {
      return ''; 
    }

    // Operador ternario
    return field.valid ? 'is-valid' : 'is-invalid';
  }

  
  updateImagePreview(url: string): void {
    const pattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;

    if (pattern.test(url)) {
      this.imagePreview.set(url);
    } else {
      this.imagePreview.set('');
    }
  }

  onImageError(): void {
    this.imagePreview.set('');
  }

  
  getCharCount(fieldName: string): number {
    const value = this.movieForm.get(fieldName)?.value;
    return value ? value.length : 0;
  }

  getRatingProgress(): number {
    const rating = this.movieForm.get('rating')?.value || 0;
    return (rating / 10) * 100;
  }

  getRatingColor(): string {
    const rating = this.movieForm.get('rating')?.value || 0;

    if (rating >= 7) return '#4caf50'; // Verde
    if (rating >= 5) return '#ff9800'; // Naranja
    return '#f44336'; // Rojo
  }
}