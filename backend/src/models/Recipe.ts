export interface Recipe {
    id: string;
    name: string;
    description: string;
    ingredients: string[];
    instructions: string;
    time: number;
    servings: number;
    image: string;
    userId: string;
  }