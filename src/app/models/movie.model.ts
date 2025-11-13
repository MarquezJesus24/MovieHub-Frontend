export interface MovieResponseDTO {
    id: number;
    name: string;
    description: string;
    posterPath: string;
    rating: number;
    status: string;
    createAt: Date;
    updateAt: Date;
}

export interface MovieRequestDTO {
    name: string;
    posterPath: string;
    description: string;
    rating: number;
    status: string;
}

