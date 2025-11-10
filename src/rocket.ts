// src/rocket.ts
class Rocket {
    private name: string;
    private fuelLevel: number;
    private fuelCapacity: number;
    private maxCrewCapacity: number;
    private crewMembers: string[];
    private isLaunched: boolean;
    private fuelConsumptionRate: number;

    constructor(
        name: string,
        fuelCapacity: number,
        maxCrewCapacity: number,
        fuelConsumptionRate: number
    ) {
        this.name = name;
        this.fuelCapacity = fuelCapacity;
        this.maxCrewCapacity = maxCrewCapacity;
        this.fuelConsumptionRate = fuelConsumptionRate;
        this.fuelLevel = 0;
        this.crewMembers = [];
        this.isLaunched = false;
    }

    addCrewMembers(...members: string[]): boolean {
        if (this.isLaunched) {
            throw new Error("Cannot add crew members after launch!");
        }

        if (this.crewMembers.length + members.length > this.maxCrewCapacity) {
            throw new Error(
                `Cannot add ${members.length} crew members. Current: ${this.crewMembers.length}, Max capacity: ${this.maxCrewCapacity}`
            );
        }

        for (const member of members) {
            if (!member || member.trim().length === 0) {
                throw new Error("Crew member name cannot be null or empty");
            }
            this.crewMembers.push(member);
        }

        return true;
    }

    refuel(amount: number): number {
        if (this.isLaunched) {
            throw new Error("Cannot refuel a rocket that has already launched!");
        }

        if (amount < 0) {
            throw new Error("Fuel amount cannot be negative");
        }

        this.fuelLevel = Math.min(this.fuelLevel + amount, this.fuelCapacity);
        return this.fuelLevel;
    }

    launch(): LaunchReport {
        if (this.isLaunched) {
            throw new Error("Rocket has already launched!");
        }

        if (this.crewMembers.length === 0) {
            throw new Error("Cannot launch without crew members!");
        }

        const minimumFuel = this.fuelCapacity * 0.5;
        if (this.fuelLevel < minimumFuel) {
            throw new Error(
                `Insufficient fuel for launch. Need at least ${minimumFuel.toFixed(2)} liters, current: ${this.fuelLevel.toFixed(2)} liters`
            );
        }

        this.isLaunched = true;
        const fuelConsumed = this.fuelConsumptionRate * 10;
        this.fuelLevel = Math.max(0, this.fuelLevel - fuelConsumed);

        return new LaunchReport(
            this.name,
            this.crewMembers.length,
            [...this.crewMembers],
            fuelConsumed,
            this.fuelLevel,
            true
        );
    }

    getName(): string {
        return this.name;
    }

    getFuelLevel(): number {
        return this.fuelLevel;
    }

    getFuelCapacity(): number {
        return this.fuelCapacity;
    }

    getMaxCrewCapacity(): number {
        return this.maxCrewCapacity;
    }

    getCrewMembers(): string[] {
        return [...this.crewMembers];
    }

    getLaunched(): boolean {
        return this.isLaunched;
    }

    getFuelPercentage(): number {
        return (this.fuelLevel / this.fuelCapacity) * 100;
    }

    toString(): string {
        return `Rocket[name=${this.name}, fuel=${this.fuelLevel.toFixed(2)}/${this.fuelCapacity.toFixed(2)} liters (${this.getFuelPercentage().toFixed(1)}%), crew=${this.crewMembers.length}/${this.maxCrewCapacity}, launched=${this.isLaunched}]`;
    }
}

class LaunchReport {
    public readonly rocketName: string;
    public readonly crewCount: number
    public readonly crewList: string[];
    public readonly fuelConsumed: number
    public readonly remainingFuel: number;
    public readonly successful: boolean;

    constructor(
        rocketName: string,
        crewCount: number,
        crewList: string[],
        fuelConsumed: number,
        remainingFuel: number,
        successful: boolean
    ) {
        this.rocketName = rocketName;
        this.crewCount = crewCount;
        this.crewList = crewList;
        this.fuelConsumed = fuelConsumed;
        this.remainingFuel = remainingFuel;
        this.successful = successful;
    }

    toString(): string {
        return `🚀 LAUNCH REPORT 🚀
==================
Rocket: ${this.rocketName}
Status: ${this.successful ? "SUCCESS" : "FAILED"}
Crew Count: ${this.crewCount}
Crew: ${this.crewList.join(", ")}
Fuel Consumed: ${this.fuelConsumed.toFixed(2)} liters
Remaining Fuel: ${this.remainingFuel.toFixed(2)} liters`;
    }
}

// Make classes available globally for browser
(window as any).Rocket = Rocket;
(window as any).LaunchReport = LaunchReport;
