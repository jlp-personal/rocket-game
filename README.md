# 🚀 Mission Control Game

A space-themed browser game where you manage rocket launches, hire crew, and complete missions to different destinations!

## 🎮 How to Play

### Starting Out
- You begin with a budget of **$50,000**
- Choose from 3 different rockets, each with different capabilities and costs

### Rocket Types
- **🚀 Swift** - Small and efficient ($10,000)
  - Fuel Capacity: 1,000L
  - Crew: 3
  - Fuel Burn Rate: 50L/min

- **🚀 Titan** - Medium-sized workhorse ($25,000)
  - Fuel Capacity: 5,000L
  - Crew: 5
  - Fuel Burn Rate: 200L/min

- **🚀 Colossus** - Large and powerful ($50,000)
  - Fuel Capacity: 15,000L
  - Crew: 8
  - Fuel Burn Rate: 500L/min

### Game Mechanics

#### 1. Select Your Rocket
Click on one of the rocket buttons to purchase it. This will deduct the cost from your budget.

#### 2. Refuel Your Rocket
- Fuel costs **$2 per liter**
- Add 500L or 1000L at a time, or fill the entire tank
- You need at least **50% fuel capacity** to launch

#### 3. Hire Your Crew
Choose from 5 available crew members:
- **Commander Chen** - $5,000
- **Pilot Garcia** - $4,000
- **Engineer Kim** - $3,500
- **Dr. Patel** - $3,000
- **Specialist Jones** - $3,000

Note: Each crew member can only be hired once per rocket!

#### 4. Choose Your Mission
Three destinations are available:

- **🛸 International Space Station (ISS)**
  - Distance: 100km
  - Minimum Crew: 2
  - Reward: $10,000

- **🌙 Moon**
  - Distance: 500km
  - Minimum Crew: 3
  - Reward: $50,000

- **🔴 Mars**
  - Distance: 2,000km
  - Minimum Crew: 4
  - Reward: $200,000

#### 5. Launch!
Once you have enough fuel and crew, click on a destination to launch your rocket and earn your reward!

## 🛠️ Technical Setup

### File Structure
```
mission-control-game/
├── .github/
│   └── workflows/
│       └── build.yml        # Auto-compiles TypeScript
├── src/
│   ├── rocket.ts           # Rocket class (provided)
│   ├── game.ts             # Game logic
│   └── types.ts            # Shared interfaces
├── index.html              # Game page
├── style.css               # Game styling
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── README.md               # This file
├── game.js                 # AUTO-GENERATED
└── rocket.js               # AUTO-GENERATED
```

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Compile TypeScript manually:**
   ```bash
   npm run build
   ```

3. **Watch mode (auto-compile on changes):**
   ```bash
   npm run watch
   ```

4. **Open the game:**
   Simply open `index.html` in your browser!

### GitHub Pages Deployment

The game is set up to automatically compile TypeScript when you push changes:

1. Push your `src/` TypeScript files to GitHub
2. The GitHub Action automatically compiles them to JavaScript
3. The compiled `.js` files are committed back to the repository
4. GitHub Pages serves the site with the compiled files

### Manual Compilation (if needed)

If the GitHub Action doesn't work or you want to compile locally:

```bash
# Install TypeScript globally
npm install -g typescript

# Compile all TypeScript files
tsc

# Or compile specific files
tsc src/rocket.ts --outDir .
tsc src/game.ts --outDir .
```

## 🎯 Game Strategy Tips

1. **Start small**: Begin with the Swift rocket to test missions
2. **ISS first**: Do low-risk ISS missions to build up capital
3. **Upgrade gradually**: Once you have funds, move to Titan for Moon missions
4. **Mars mission**: Only attempt Mars with the Colossus and a full crew
5. **Budget management**: Always keep enough fuel budget for minimum launch requirements

## 🔧 Customization Ideas

Want to extend the game? Here are some ideas:

- Add more crew members with special abilities
- Create new destinations (asteroids, space stations)
- Implement fuel efficiency upgrades
- Add random events during missions
- Create a mission log/history
- Add achievements system
- Implement rocket upgrades between missions

## 📝 License

MIT License - Feel free to modify and share!

---

**Good luck, Space Commander! 🚀✨**
