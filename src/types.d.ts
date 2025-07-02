export type User = {
    id_user: number,
    name: string,
    email: string,
}

export interface GoogleJwtPayload {
    sub: string,
    name: string,
    email:string
}

export type MyBook = {
    id_book: number,
    title: string,
    author: string,
    genre: string,
    year: number,
    favorite: boolean,
    rating?: number,
    user_id: number
}

export type GoogleBook = {
    id: string
    volumeInfo: {
        authors?: string[]
        categories?: string[]
        imageLinks?: {
            smallThumbnail?: string
            thumbnail?: string
        }
        title: string
    }
}

export type review = {
    id_review: number,
    description: string,
    id_user: number
}