export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    owner: string;
    description: string | null;
    image: string | null;
    pdf: string | null | undefined;
    showDetails: boolean;
  }
  
  export interface Video {
    id: number;
    title: string;
    duration: string;
    description: string;
    image: string | null;
    path: string | null | undefined;
  }
  
  export interface Text {
    id: number;
    title: string;
    description: string;
    image: string | null;
    words: string | null | undefined;
  }

  export interface Design {
    id: number;
    title: string;
    description: string | null;
    words: string | null | undefined;
    showDetails: boolean;
  }

  export interface Exercise {
    id: number;
    title: string;
    description: string | null;
    pdf: string | null | undefined;
  }  
  export interface NewBook {
    title: string;
    author: string;
    isbn: string;
    owner: string;
    description: string;
    image: File | null;
    pdf: File | string | null;
  }
  
  export interface NewVideo {
    title: string;
    duration: string;
    description: string;
    image: File | null;
    video: File | string | null;
  }

  export interface NewText {
    title: string;
    description: string;
    image: File | null;
    words: File | string | null;
  }

  export interface NewDesign {
    id: number;
    title: string;
    description: string | null;
    words: string | null | undefined;
    showDetails: boolean;
  }
  export interface NewExercise {
    id: number;
    title: string;
    description: string | null;
    pdf: string | null | undefined;
  }  