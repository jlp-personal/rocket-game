// src/game.ts
interface RocketConfig {
    name: string;
    fuelCapacity: number;
    maxCrew: number;
    burnRate: number;
    cost: number;
}

class MissionControlGame {
    private budget: number = 50000;
    private currentRocket: Rocket | null = null;
    private rocketConfigs: RocketConfig[] = [
        { name: "Swift", fuelCapacity: 1000, maxCrew: 3, burnRate: 50, cost: 10000 },
        { name: "Titan", fuelCapacity: 5000, maxCrew: 5, burnRate: 200, cost: 25000 },
        { name: "Colossus", fuelCapacity: 15000, maxCrew: 8, burnRate: 500, cost: 50000 }
    ];

    constructor() {
        this.initializeUI();
        this.updateBudgetDisplay();
    }

    private initializeUI(): void {
        // Add click handlers for rocket selection
        document.querySelectorAll('.rocket-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => this.selectRocket(index));
        });
    }

    private selectRocket(index: number): void {
        const config = this.rocketConfigs[index];
        
        if (this.budget < config.cost) {
            alert(`Not enough budget! You need $${config.cost}`);
            return;
        }

        // Create new rocket
        this.currentRocket = new Rocket(
            config.name,
            config.fuelCapacity,
            config.maxCrew,
            config.burnRate
        );

        this.budget -= config.cost;
        this.updateBudgetDisplay();
        this.showRocketStatus();
    }

    private updateBudgetDisplay(): void {
        const budgetElement = document.getElementById('budget');
        if (budgetElement) {
            budgetElement.textContent = this.budget.toString();
        }
    }

    private showRocketStatus(): void {
        // Update UI to show current rocket status
        console.log(`Selected rocket: ${this.currentRocket?.getName()}`);
    }

    public addFuel(amount: number): void {
        if (!this.currentRocket) {
            alert("Please select a rocket first!");
            return;
        }

        const cost = amount * 2; // $2 per liter
        if (this.budget < cost) {
            alert("Not enough budget for fuel!");
            return;
        }

        this.currentRocket.refuel(amount);
        this.budget -= cost;
        this.updateBudgetDisplay();
    }

    public launchMission(): void {
        if (!this.currentRocket) {
            alert("Please select a rocket first!");
            return;
        }

        try {
            const report = this.currentRocket.launch();
            alert(report.toString());
        } catch (error) {
            alert(`Launch failed: ${(error as Error).message}`);
        }
    }
}

// Initialize game when page loads
(window as any).game = new MissionControlGame();
