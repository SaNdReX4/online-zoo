// Enum-ის გამოყენება დავალების მოთხოვნისთვის
export enum AnimalRegion {
    CentralChina = "Native to central China",
    Africa = "Native to Africa",
    SouthAmerica = "Native to South America",
    Global = "Found worldwide"
}


export interface Animal {
    id: number;         
    commonName: string;
    name: string;       
    species: string;   
    image: string;       
    description: string; 
    location: string;    
    region: string;
}

export interface Feedback {
    id: number;      
    name: string;     
    city: string;     
    month: string;    
    year: string;     
    text: string;        
    userIcon?: string;   
}


export interface ApiResponse<T> {
    data: T[];
}