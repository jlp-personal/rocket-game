// game.ts - Mission Control Game Logic

interface RocketConfig {
    name: string;
    fuelCapacity: number;
    maxCrewCapacity: number;
    fuelConsumptionRate: number;
    cost: number;
}

interface Destination {
    name: string;
    distance: number;
    minCrew: number;
    reward: number;
}

class Game {
    private budget: number = 50000;
    private currentRocket: any = null;
    private rocketConfigs: RocketConfig[];
    private destinations: Map<string, Destination>;
    private hiredCrew: Set<string> = new Set();

    constructor() {
        this.rocketConfigs = [
            { name: "Swift", fuelCapacity: 1000, maxCrewCapacity: 3, fuelConsumptionRate: 50, cost: 10000 },
            { name: "Titan", fuelCapacity: 5000, maxCrewCapacity: 5, fuelConsumptionRate: 200, cost: 25000 },
            { name: "Colossus", fuelCapacity: 15000, maxCrewCapacity: 8, fuelConsumptionRate: 500, cost: 50000 }
        ];

        this.destinations = new Map([
            ["ISS", { name: "International Space Station", distance: 100, minCrew: 2, reward: 10000 }],
            ["Moon", { name: "Moon", distance: 500, minCrew: 3, reward: 50000 }],
            ["Mars", { name: "Mars", distance: 2000, minCrew: 4, reward: 200000 }]
        ]);

        this.initializeEventListeners();
        this.updateBudgetDisplay();
    }

    private initializeEventListeners(): void {
        const rocketButtons = document.querySelectorAll('.rocket-btn');
        rocketButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const rocketIndex = parseInt(button.getAttribute('data-rocket') || '0');
                this.selectRocket(rocketIndex);
            });
        });
    }

    private selectRocket(index: number): void {
        const config = this.rocketConfigs[index];
        
        if (this.budget < config.cost) {
            this.showMessage(`Not enough budget! Need $${config.cost.toLocaleString()}, have $${this.budget.toLocaleString()}`, 'error');
            return;
        }

        if (this.currentRocket && !this.currentRocket.getLaunched()) {
            this.showMessage('You already have a rocket! Launch it first or start a new game.', 'error');
            return;
        }

        this.budget -= config.cost;
        this.currentRocket = new (window as any).Rocket(
            config.name,
            config.fuelCapacity,
            config.maxCrewCapacity,
            config.fuelConsumptionRate
        );

        this.updateBudgetDisplay();
        this.showRocketStatus();
        this.updateRocketDisplay();
        this.showMessage(`Rocket "${config.name}" purchased for $${config.cost.toLocaleString()}!`, 'success');
    }

    addFuel(amount: number): void {
        if (!this.currentRocket) {
            this.showMessage('Select a rocket first!', 'error');
            return;
        }

        const cost = amount * 2; // $2 per liter
        if (this.budget < cost) {
            this.showMessage(`Not enough budget! Need $${cost.toLocaleString()}`, 'error');
            return;
        }

        try {
            this.currentRocket.refuel(amount);
            this.budget -= cost;
            this.updateBudgetDisplay();
            this.updateRocketDisplay();
            this.showMessage(`Added ${amount}L of fuel for $${cost.toLocaleString()}`, 'success');
        } catch (error: any) {
            this.showMessage(error.message, 'error');
        }
    }

    fillTank(): void {
        if (!this.currentRocket) {
            this.showMessage('Select a rocket first!', 'error');
            return;
        }

        const currentFuel = this.currentRocket.getFuelLevel();
        const capacity = this.currentRocket.getFuelCapacity();
        const needed = capacity - currentFuel;
        const cost = needed * 2;

        if (needed <= 0) {
            this.showMessage('Tank is already full!', 'info');
            return;
        }

        if (this.budget < cost) {
            this.showMessage(`Not enough budget! Need $${cost.toLocaleString()} to fill tank`, 'error');
            return;
        }

        this.currentRocket.refuel(needed);
        this.budget -= cost;
        this.updateBudgetDisplay();
        this.updateRocketDisplay();
        this.showMessage(`Tank filled! Added ${needed.toFixed(0)}L for $${cost.toLocaleString()}`, 'success');
    }

    addCrewMember(name: string, cost: number): void {
        if (!this.currentRocket) {
            this.showMessage('Select a rocket first!', 'error');
            return;
        }

        if (this.hiredCrew.has(name)) {
            this.showMessage(`${name} has already been hired!`, 'error');
            return;
        }

        if (this.budget < cost) {
            this.showMessage(`Not enough budget! Need $${cost.toLocaleString()}`, 'error');
            return;
        }

        try {
            this.currentRocket.addCrewMembers(name);
            this.hiredCrew.add(name);
            this.budget -= cost;
            this.updateBudgetDisplay();
            this.updateRocketDisplay();
            this.showMessage(`${name} hired for $${cost.toLocaleString()}!`, 'success');
        } catch (error: any) {
            this.showMessage(error.message, 'error');
        }
    }

    launchToDestination(destinationKey: string): void {
        if (!this.currentRocket) {
            this.showMessage('Select a rocket first!', 'error');
            return;
        }

        const destination = this.destinations.get(destinationKey);
        if (!destination) {
            this.showMessage('Invalid destination!', 'error');
            return;
        }

        const crewCount = this.currentRocket.getCrewMembers().length;
        if (crewCount < destination.minCrew) {
            this.showMessage(
                `Not enough crew for ${destination.name}! Need ${destination.minCrew}, have ${crewCount}`,
                'error'
            );
            return;
        }

        const fuelNeeded = destination.distance * this.currentRocket.getFuelCapacity() / 1000;
        if (this.currentRocket.getFuelLevel() < fuelNeeded) {
            this.showMessage(
                `Not enough fuel for ${destination.name}! Need at least ${fuelNeeded.toFixed(0)}L`,
                'error'
            );
            return;
        }

        try {
            const report = this.currentRocket.launch();
            this.budget += destination.reward;
            
            // Show detailed launch report
            const reportMessage = `
                <strong>🚀 MISSION TO ${destination.name.toUpperCase()} SUCCESSFUL! 🚀</strong><br><br>
                <strong>Rocket:</strong> ${report.rocketName}<br>
                <strong>Crew:</strong> ${report.crewList.join(', ')}<br>
                <strong>Fuel Consumed:</strong> ${report.fuelConsumed.toFixed(2)}L<br>
                <strong>Remaining Fuel:</strong> ${report.remainingFuel.toFixed(2)}L<br>
                <strong>Mission Reward:</strong> $${destination.reward.toLocaleString()}<br><br>
                <strong>New Budget:</strong> $${this.budget.toLocaleString()}
            `;
            
            this.showMessage(reportMessage, 'success');
            this.updateBudgetDisplay();
            this.updateRocketDisplay();
            
            // Disable rocket controls after launch
            setTimeout(() => {
                this.showMessage('Mission complete! Select a new rocket to continue.', 'info');
            }, 5000);
            
        } catch (error: any) {
            this.showMessage(error.message, 'error');
        }
    }

    private showRocketStatus(): void {
        const selectionDiv = document.getElementById('rocket-selection');
        const statusDiv = document.getElementById('rocket-status');
        
        if (selectionDiv) selectionDiv.classList.add('hidden');
        if (statusDiv) statusDiv.classList.remove('hidden');
    }

    private updateRocketDisplay(): void {
        if (!this.currentRocket) return;

        // Update rocket name
        const nameEl = document.getElementById('rocket-name');
        if (nameEl) nameEl.textContent = this.currentRocket.getName();

        // Update fuel status
        const fuelCurrent = document.getElementById('fuel-current');
        const fuelMax = document.getElementById('fuel-max');
        const fuelPercent = document.getElementById('fuel-percent');
        const fuelLevel = document.getElementById('fuel-level');

        if (fuelCurrent) fuelCurrent.textContent = this.currentRocket.getFuelLevel().toFixed(0);
        if (fuelMax) fuelMax.textContent = this.currentRocket.getFuelCapacity().toFixed(0);
        if (fuelPercent) fuelPercent.textContent = this.currentRocket.getFuelPercentage().toFixed(1);
        if (fuelLevel) fuelLevel.style.width = `${this.currentRocket.getFuelPercentage()}%`;

        // Update crew status
        const crewCount = document.getElementById('crew-count');
        const crewMax = document.getElementById('crew-max');
        const crewList = document.getElementById('crew-list');

        const crew = this.currentRocket.getCrewMembers();
        if (crewCount) crewCount.textContent = crew.length.toString();
        if (crewMax) crewMax.textContent = this.currentRocket.getMaxCrewCapacity().toString();
        
        if (crewList) {
            if (crew.length === 0) {
                crewList.innerHTML = '<p class="no-crew">No crew members assigned</p>';
            } else {
                crewList.innerHTML = crew.map(member => 
                    `<div class="crew-member">👨‍🚀 ${member}</div>`
                ).join('');
            }
        }

        // Disable buttons if rocket has launched
        if (this.currentRocket.getLaunched()) {
            const buttons = document.querySelectorAll('.fuel-controls button, .crew-controls button');
            buttons.forEach(button => {
                (button as HTMLButtonElement).disabled = true;
            });
        }
    }

    private updateBudgetDisplay(): void {
        const budgetEl = document.getElementById('budget');
        if (budgetEl) {
            budgetEl.textContent = this.budget.toLocaleString();
        }
    }

    private showMessage(text: string, type: 'success' | 'error' | 'info'): void {
        const messageEl = document.getElementById('message');
        if (!messageEl) return;

        messageEl.innerHTML = text;
        messageEl.className = `message ${type}`;
        messageEl.classList.remove('hidden');

        // Auto-hide after 5 seconds for success/info messages
        if (type !== 'error') {
            setTimeout(() => {
                messageEl.classList.add('hidden');
            }, 5000);
        }
    }
}

// Initialize game when page loads
let game: Game;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    (window as any).game = game; // Make game accessible globally for onclick handlers
});
