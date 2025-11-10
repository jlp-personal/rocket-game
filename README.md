# 🚀 Mission Control Game

A space-themed browser game where you manage rocket launches, hire crew, and complete missions to different destinations!

## 🎮 How to Play

### Game Flow
Unlike traditional space games, Mission Control lets you **plan your entire mission before committing**! All options are visible from the start, so you can strategize how to achieve your goal within your budget.

### Step-by-Step Guide

#### 1. Choose Your Destination First
Select where you want to go to see the mission requirements:
- **🛸 International Space Station (ISS)**
  - Distance: 100km
  - Minimum Crew: 2
  - Recommended Fuel: 600L
  - Reward: $10,000

- **🌙 Moon**
  - Distance: 500km
  - Minimum Crew: 3
  - Recommended Fuel: 2,500L
  - Reward: $50,000

- **🔴 Mars**
  - Distance: 2,000km
  - Minimum Crew: 4
  - Recommended Fuel: 8,000L
  - Reward: $200,000

#### 2. Select Your Rocket
Based on your destination, choose an appropriate rocket:
- **🚀 Swift** - Small and efficient ($10,000)
  - Fuel Capacity: 1,000L
  - Crew: 3
  - Fuel Burn Rate: 50L/min
  - *Best for: ISS missions*

- **🚀 Titan** - Medium-sized workhorse ($25,000)
  - Fuel Capacity: 5,000L
  - Crew: 5
  - Fuel Burn Rate: 200L/min
  - *Best for: Moon missions*

- **🚀 Colossus** - Large and powerful ($50,000)
  - Fuel Capacity: 15,000L
  - Crew: 8
  - Fuel Burn Rate: 500L/min
  - *Best for: Mars missions*

#### 3. Add Fuel to Your Rocket
- Fuel costs **$2 per liter**
- Add 500L or 1000L at a time, or fill the entire tank
- You need at least **50% fuel capacity** to launch
- Check the recommended fuel for your destination

#### 4. Hire Your Crew
Browse all 8 available crew members and hire the ones you need:
- **Commander Chen** - $5,000
- **Pilot Garcia** - $4,000
- **Engineer Kim** - $3,500
- **Navigator Silva** - $3,500
- **Medical Officer Rodriguez** - $3,200
- **Dr. Patel** - $3,000
- **Specialist Jones** - $3,000
- **Technician Wang** - $2,800

Remember: Each crew member can only be hired once, and different destinations require different minimum crew counts!

#### 5. Check Your Pre-Launch Checklist
The game automatically tracks your progress:
- ✅ Destination selected
- ✅ Rocket purchased
- ✅ Fuel sufficient (50%+ capacity)
- ✅ Crew meets minimum requirements

#### 6. Launch!
Once all checklist items are green, click the big red **LAUNCH MISSION** button to execute your mission and earn your reward!

### Game Mechanics

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

### Planning is Key!
Since all options are visible from the start, you can plan your entire mission:

1. **Choose your destination first**: This tells you exactly what you need (crew, fuel, rocket)
2. **Work backwards from requirements**: Calculate what you can afford
3. **Budget carefully**: Don't overspend on fuel or crew you don't need

### Mission Strategies

**ISS Mission (Beginner)**
- Budget: ~$17,000-$19,000 total
- Rocket: Swift ($10,000)
- Crew: 2 cheapest members (~$6,000)
- Fuel: 600-700L ($1,200-$1,400)
- Profit: ~$10,000 reward - ~$17,000 spent = Break even or small loss
- Purpose: Learning mission, low risk

**Moon Mission (Intermediate)**
- Budget: ~$35,000-$40,000 total
- Rocket: Titan ($25,000)
- Crew: 3-4 members (~$10,000-$14,000)
- Fuel: 2,500-3,000L ($5,000-$6,000)
- Profit: ~$50,000 reward - ~$40,000 spent = ~$10,000 profit
- Purpose: First real money maker

**Mars Mission (Advanced)**
- Budget: $70,000+ total (need to earn money first!)
- Rocket: Colossus ($50,000)
- Crew: 4-6 members (~$14,000-$20,000)
- Fuel: 8,000-10,000L ($16,000-$20,000)
- Profit: ~$200,000 reward - ~$80,000 spent = ~$120,000 profit!
- Purpose: Big payday, but requires successful missions first

### Pro Tips
- **Hire cheaper crew first**: Technician Wang ($2,800) and Dr. Patel ($3,000) are bargains
- **Don't overfuel**: Check recommended amounts for your destination
- **Watch the checklist**: It tells you exactly what you still need
- **Can't afford Mars?**: Do 1-2 Moon missions first to build capital
- **Crew capacity matters**: Make sure your rocket can hold enough crew for your destination

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
