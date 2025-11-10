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
    recommendedFuel: number;
}

class Game {
    private budget: number = 50000;
    private currentRocket: any = null;
    private selectedDestination: string | null = null;
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
            ["ISS", { name: "International Space Station", distance: 100, minCrew: 2, reward: 10000, recommendedFuel: 600 }],
            ["Moon", { name: "Moon", distance: 500, minCrew: 3, reward: 50000, recommendedFuel: 2500 }],
            ["Mars", { name: "Mars", distance: 2000, minCrew: 4, reward: 200000, recommendedFuel: 8000 }]
        ]);

        this.initializeEventListeners();
        this.updateBudgetDisplay();
        this.updateLaunchChecklist();
    }

    private initializeEventListeners(): void {
        // Rocket selection buttons
        const rocketButtons = document.querySelectorAll('.rocket-btn');
        rocketButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const rocketIndex = parseInt(button.getAttribute('data-rocket') || '0');
                this.selectRocket(rocketIndex);
            });
        });

        // Destination selection buttons
        const destinationButtons = document.querySelectorAll('.destination-btn');
        destinationButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const destinationKey = button.getAttribute('data-destination') || '';
                this.selectDestination(destinationKey);
            });
        });
    }

    private selectDestination(key: string): void {
        const destination = this.destinations.get(key);
        if (!destination) return;

        this.selectedDestination = key;

        // Update UI to show selected destination
        const selectedSection = document.getElementById('selected-destination');
        const destName = document.getElementById('destination-name');
        const minCrew = document.getElementById('min-crew');
        const recFuel = document.getElementById('recommended-fuel');
        const reward = document.getElementById('mission-reward');

        if (selectedSection) selectedSection.classList.remove('hidden');
        if (destName) destName.textContent = destination.name;
        if (minCrew) minCrew.textContent = destination.minCrew.toString();
        if (recFuel) recFuel.textContent = destination.recommendedFuel.toString();
        if (reward) reward.textContent = destination.reward.toLocaleString();

        // Highlight selected destination button
        document.querySelectorAll('.destination-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        const selectedBtn = document.querySelector(`.destination-btn[data-destination="${key}"]`);
        if (selectedBtn) selectedBtn.classList.add('selected');

        this.updateLaunchChecklist();
        this.showMessage(`Mission selected: ${destination.name}! Now prepare your rocket.`, 'success');
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
        this.enableFuelControls();
        this.updateAllDisplays();
        this.updateLaunchChecklist();
        this.showMessage(`Rocket "${config.name}" purchased for $${config.cost.toLocaleString()}!`, 'success');
    }

    private showRocketStatus(): void {
        const statusDiv = document.getElementById('rocket-status');
        if (statusDiv) statusDiv.classList.remove('hidden');
    }

    private enableFuelControls(): void {
        const fuelPreview = document.getElementById('fuel-status-preview');
        const fuelControls = document.getElementById('fuel-controls');
        
        if (fuelPreview) fuelPreview.classList.add('hidden');
        if (fuelControls) fuelControls.classList.remove('hidden');
    }

    addFuel(amount: number): void {
        if (!this.currentRocket) {
            this.showMessage('Select a rocket first!', 'error');
            return;
        }

        const cost = amount * 2;
        if (this.budget < cost) {
            this.showMessage(`Not enough budget! Need $${cost.toLocaleString()}`, 'error');
            return;
        }

        try {
            this.currentRocket.refuel(amount);
            this.budget -= cost;
            this.updateBudgetDisplay();
            this.updateAllDisplays();
            this.updateLaunchChecklist();
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
        this.updateAllDisplays();
        this.updateLaunchChecklist();
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
            this.updateAllDisplays();
            this.updateLaunchChecklist();
            this.showMessage(`${name} hired for $${cost.toLocaleString()}!`, 'success');
        } catch (error: any) {
            this.showMessage(error.message, 'error');
        }
    }

    attemptLaunch(): void {
        if (!this.selectedDestination) {
            this.showMessage('Select a destination first!', 'error');
            return;
        }

        if (!this.currentRocket) {
            this.showMessage('Select a rocket first!', 'error');
            return;
        }

        const destination = this.destinations.get(this.selectedDestination);
        if (!destination) return;

        const crewCount = this.currentRocket.getCrewMembers().length;
        if (crewCount < destination.minCrew) {
            this.showMessage(
                `Not enough crew for ${destination.name}! Need ${destination.minCrew}, have ${crewCount}`,
                'error'
            );
            return;
        }

        try {
            const report = this.currentRocket.launch();
            this.budget += destination.reward;
            
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
            this.updateAllDisplays();
            this.disableControls();
            
            setTimeout(() => {
                this.showMessage('Mission complete! Refresh the page to start a new mission.', 'info');
            }, 6000);
            
        } catch (error: any) {
            this.showMessage(error.message, 'error');
        }
    }

    private disableControls(): void {
        const buttons = document.querySelectorAll('.fuel-controls button, .crew-controls button, .rocket-btn, .destination-btn, .launch-button');
        buttons.forEach(button => {
            (button as HTMLButtonElement).disabled = true;
        });
    }

    private updateLaunchChecklist(): void {
        const checkDest = document.getElementById('check-destination');
        const checkRocket = document.getElementById('check-rocket');
        const checkFuel = document.getElementById('check-fuel');
        const checkCrew = document.getElementById('check-crew');
        const launchBtn = document.getElementById('launch-btn') as HTMLButtonElement;

        let allChecked = true;

        // Check destination
        if (this.selectedDestination) {
            if (checkDest) {
                checkDest.textContent = '✅ Destination selected';
                checkDest.className = 'checklist-item checked';
            }
        } else {
            allChecked = false;
            if (checkDest) {
                checkDest.textContent = '❌ Select destination';
                checkDest.className = 'checklist-item unchecked';
            }
        }

        // Check rocket
        if (this.currentRocket && !this.currentRocket.getLaunched()) {
            if (checkRocket) {
                checkRocket.textContent = `✅ Rocket purchased (${this.currentRocket.getName()})`;
                checkRocket.className = 'checklist-item checked';
            }
        } else {
            allChecked = false;
            if (checkRocket) {
                checkRocket.textContent = '❌ Purchase rocket';
                checkRocket.className = 'checklist-item unchecked';
            }
        }

        // Check fuel
        if (this.currentRocket) {
            const fuelPercent = this.currentRocket.getFuelPercentage();
            if (fuelPercent >= 50) {
                if (checkFuel) {
                    checkFuel.textContent = `✅ Fuel sufficient (${fuelPercent.toFixed(1)}%)`;
                    checkFuel.className = 'checklist-item checked';
                }
            } else {
                allChecked = false;
                if (checkFuel) {
                    checkFuel.textContent = `❌ Add fuel (currently ${fuelPercent.toFixed(1)}%, need 50%+)`;
                    checkFuel.className = 'checklist-item unchecked';
                }
            }
        } else {
            allChecked = false;
        }

        // Check crew
        if (this.currentRocket && this.selectedDestination) {
            const destination = this.destinations.get(this.selectedDestination);
            const crewCount = this.currentRocket.getCrewMembers().length;
            
            if (destination && crewCount >= destination.minCrew) {
                if (checkCrew) {
                    checkCrew.textContent = `✅ Crew ready (${crewCount}/${destination.minCrew} minimum)`;
                    checkCrew.className = 'checklist-item checked';
                }
            } else {
                allChecked = false;
                if (checkCrew) {
                    const minCrew = destination ? destination.minCrew : '?';
                    checkCrew.textContent = `❌ Hire crew (have ${crewCount}, need ${minCrew} minimum)`;
                    checkCrew.className = 'checklist-item unchecked';
                }
            }
        } else {
            allChecked = false;
        }

        // Enable/disable launch button
        if (launchBtn) {
            launchBtn.disabled = !allChecked;
        }
    }

    private updateAllDisplays(): void {
        if (!this.currentRocket) return;

        // Update main rocket status
        const rocketName = document.getElementById('rocket-name');
        if (rocketName) rocketName.textContent = this.currentRocket.getName();

        // Update fuel in all places
        const fuelCurrent = this.currentRocket.getFuelLevel();
        const fuelMax = this.currentRocket.getFuelCapacity();
        const fuelPercent = this.currentRocket.getFuelPercentage();

        // Main fuel section
        const fuelCurrentMain = document.getElementById('fuel-current-main');
        const fuelMaxMain = document.getElementById('fuel-max-main');
        const fuelPercentMain = document.getElementById('fuel-percent-main');
        const fuelLevelMain = document.getElementById('fuel-level-main');

        if (fuelCurrentMain) fuelCurrentMain.textContent = fuelCurrent.toFixed(0);
        if (fuelMaxMain) fuelMaxMain.textContent = fuelMax.toFixed(0);
        if (fuelPercentMain) fuelPercentMain.textContent = fuelPercent.toFixed(1);
        if (fuelLevelMain) fuelLevelMain.style.width = `${fuelPercent}%`;

        // Rocket status fuel
        const fuelCurrentStatus = document.getElementById('fuel-current');
        const fuelMaxStatus = document.getElementById('fuel-max');
        const fuelPercentStatus = document.getElementById('fuel-percent');
        const fuelLevelStatus = document.getElementById('fuel-level');

        if (fuelCurrentStatus) fuelCurrentStatus.textContent = fuelCurrent.toFixed(0);
        if (fuelMaxStatus) fuelMaxStatus.textContent = fuelMax.toFixed(0);
        if (fuelPercentStatus) fuelPercentStatus.textContent = fuelPercent.toFixed(1);
        if (fuelLevelStatus) fuelLevelStatus.style.width = `${fuelPercent}%`;

        // Update crew in all places
        const crew = this.currentRocket.getCrewMembers();
        const crewMax = this.currentRocket.getMaxCrewCapacity();

        // Main crew section
        const crewCountMain = document.getElementById('crew-count-main');
        const crewMaxMain = document.getElementById('crew-max-main');
        const crewListMain = document.getElementById('crew-list-main');

        if (crewCountMain) crewCountMain.textContent = crew.length.toString();
        if (crewMaxMain) crewMaxMain.textContent = crewMax.toString();
        
        if (crewListMain) {
            if (crew.length === 0) {
                crewListMain.innerHTML = '<p class="no-crew">No crew members hired yet</p>';
            } else {
                crewListMain.innerHTML = crew.map(member => 
                    `<div class="crew-member">👨‍🚀 ${member}</div>`
                ).join('');
            }
        }

        // Rocket status crew
        const crewCountStatus = document.getElementById('crew-count');
        const crewMaxStatus = document.getElementById('crew-max');
        const crewListStatus = document.getElementById('crew-list');

        if (crewCountStatus) crewCountStatus.textContent = crew.length.toString();
        if (crewMaxStatus) crewMaxStatus.textContent = crewMax.toString();
        
        if (crewListStatus) {
            if (crew.length === 0) {
                crewListStatus.innerHTML = '<p class="no-crew">No crew members assigned</p>';
            } else {
                crewListStatus.innerHTML = crew.map(member => 
                    `<div class="crew-member">👨‍🚀 ${member}</div>`
                ).join('');
            }
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
    (window as any).game = game;
});
