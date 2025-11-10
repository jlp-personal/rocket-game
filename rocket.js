export class Rocket {
    constructor(name, fuelCapacity, maxCrewCapacity, fuelConsumptionRate) {
        this.name = name;
        this.fuelCapacity = fuelCapacity;
        this.maxCrewCapacity = maxCrewCapacity;
        this.fuelConsumptionRate = fuelConsumptionRate;
        this.fuelLevel = 0;
        this.crewMembers = [];
        this.isLaunched = false;
    }
    addCrewMembers(...members) {
        if (this.isLaunched) {
            throw new Error("Cannot add crew members after launch!");
        }
        if (this.crewMembers.length + members.length > this.maxCrewCapacity) {
            throw new Error(`Cannot add ${members.length} crew members. Current: ${this.crewMembers.length}, Max capacity: ${this.maxCrewCapacity}`);
        }
        for (const member of members) {
            if (!member || member.trim().length === 0) {
                throw new Error("Crew member name cannot be null or empty");
            }
            this.crewMembers.push(member);
        }
        return true;
    }
    refuel(amount) {
        if (this.isLaunched) {
            throw new Error("Cannot refuel a rocket that has already launched!");
        }
        if (amount < 0) {
            throw new Error("Fuel amount cannot be negative");
        }
        this.fuelLevel = Math.min(this.fuelLevel + amount, this.fuelCapacity);
        return this.fuelLevel;
    }
    launch() {
        if (this.isLaunched) {
            throw new Error("Rocket has already launched!");
        }
        if (this.crewMembers.length === 0) {
            throw new Error("Cannot launch without crew members!");
        }
        const minimumFuel = this.fuelCapacity * 0.5;
        if (this.fuelLevel < minimumFuel) {
            throw new Error(`Insufficient fuel for launch. Need at least ${minimumFuel.toFixed(2)} liters, current: ${this.fuelLevel.toFixed(2)} liters`);
        }
        this.isLaunched = true;
        const fuelConsumed = this.fuelConsumptionRate * 10;
        this.fuelLevel = Math.max(0, this.fuelLevel - fuelConsumed);
        return new LaunchReport(this.name, this.crewMembers.length, [...this.crewMembers], fuelConsumed, this.fuelLevel, true);
    }
    getName() {
        return this.name;
    }
    getFuelLevel() {
        return this.fuelLevel;
    }
    getFuelCapacity() {
        return this.fuelCapacity;
    }
    getMaxCrewCapacity() {
        return this.maxCrewCapacity;
    }
    getCrewMembers() {
        return [...this.crewMembers];
    }
    getLaunched() {
        return this.isLaunched;
    }
    getFuelPercentage() {
        return (this.fuelLevel / this.fuelCapacity) * 100;
    }
    toString() {
        return `Rocket[name=${this.name}, fuel=${this.fuelLevel.toFixed(2)}/${this.fuelCapacity.toFixed(2)} liters (${this.getFuelPercentage().toFixed(1)}%), crew=${this.crewMembers.length}/${this.maxCrewCapacity}, launched=${this.isLaunched}]`;
    }
}
export class LaunchReport {
    constructor(rocketName, crewCount, crewList, fuelConsumed, remainingFuel, successful) {
        this.rocketName = rocketName;
        this.crewCount = crewCount;
        this.crewList = crewList;
        this.fuelConsumed = fuelConsumed;
        this.remainingFuel = remainingFuel;
        this.successful = successful;
    }
    toString() {
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
