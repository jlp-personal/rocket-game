// src/types.ts
interface Destination {
    name: string;
    distance: number;
    minCrew: number;
    fuelRequired: number;
    reward: number;
}

interface CrewMember {
    name: string;
    role: string;
    skill: number;
    cost: number;
}

interface GameState {
    budget: number;
    score: number;
    unlockedDestinations: string[];
}
