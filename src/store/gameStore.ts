import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { playPurchaseSound, playLevelUpSound, playUpgradeSound } from '../utils/soundUtils'

// Building information interface
export interface BuildingInfo {
  id?: string
  cost: number
  levelRequirement: number
  title: string
  description: string
  production: {
    points?: number
  }
}

interface GameState {
  // Resources
  points: number
  
  // Buildings
  mouseFarms: number
  keyboardFactories: number
  monitorDisplays: number
  officeSpace: number
  serverRooms: number
  dataCenters: number
  dataCities: number
  dataCountries: number
  dataContinents: number
  dataWorlds: number
  dataMoons: number
  dataSolarSystems: number
  dataGalaxies: number
  dataUniverses: number
  dataGods: number
  
  // Building Levels
  mouseFarmsLevel: number
  keyboardFactoriesLevel: number
  monitorDisplaysLevel: number
  officeSpaceLevel: number
  serverRoomsLevel: number
  dataCentersLevel: number
  dataCitiesLevel: number
  dataCountriesLevel: number
  dataContinentsLevel: number
  dataWorldsLevel: number
  dataMoonsLevel: number
  dataSolarSystemsLevel: number
  dataGalaxiesLevel: number
  dataUniversesLevel: number
  dataGodsLevel: number
  
  // Upgrades
  autoClickers: number
  clickPower: number
  clickPowerUpgrades: number
  
  // Production rates
  pointsPerSecond: number

  // Player level
  playerLevel: number
  
  // Player state
  playerAccepted: boolean
  
  // Actions
  click: () => void
  buyBuilding: (buildingType: BuildingType) => void
  buyUpgrade: (upgradeType: UpgradeType) => void
  resetGame: () => void
  tick: () => void
  upgradeBuilding: (buildingType: BuildingType) => void
  getClickPowerUpgradeCost: () => number
  canUpgradeBuilding: (buildingType: BuildingType) => boolean
  getBuildingUpgradeCost: (buildingType: BuildingType) => number
  setPlayerAccepted: (accepted: boolean) => void

  // New getter for available buildings
  getAvailableBuildings: () => BuildingInfo[]
}

// Define tiers based on level requirements for buildings
type BuildingTier = 'early' | 'mid' | 'late';

// Building information with costs and requirements
export const BUILDING_INFO: Record<string, Omit<BuildingInfo, 'id'>> = {
  mouseFarms: {
    title: 'Mouse Farm',
    description: 'A basic facility that produces computer mice. Each mouse farm generates points automatically.',
    production: { points: 0.1 },
    cost: 10,
    levelRequirement: 1
  },
  keyboardFactories: {
    title: 'Keyboard Factory',
    description: 'Manufactures mechanical keyboards. Essential for advanced upgrades.',
    production: { points: 0.2 },
    cost: 50,
    levelRequirement: 1
  },
  monitorDisplays: {
    title: 'Monitor Display',
    description: 'High-resolution displays that generate points. A balanced production facility.',
    production: { points: 0.2 },
    cost: 100,
    levelRequirement: 1
  },
  serverRooms: {
    title: 'Server Room',
    description: 'A powerful facility that generates significant amounts of resources. Requires proper cooling.',
    production: { points: 5 },
    cost: 1000,
    levelRequirement: 1
  },
  dataCenters: {
    title: 'Data Center',
    description: 'The ultimate production facility. Generates massive amounts of resources but requires significant investment.',
    production: { points: 25 },
    cost: 5000,
    levelRequirement: 5
  },
  dataCities: {
    title: 'Data City',
    description: 'A massive network of data centers spanning an entire city. Requires level 10 to unlock.',
    production: { points: 100 },
    cost: 25000,
    levelRequirement: 10
  },
  dataCountries: {
    title: 'Data Country',
    description: 'A country-wide network of data cities. Requires level 20 to unlock.',
    production: { points: 500 },
    cost: 100000,
    levelRequirement: 20
  },
  dataContinents: {
    title: 'Data Continent',
    description: 'A continent-spanning network of data countries. Requires level 30 to unlock.',
    production: { points: 2500 },
    cost: 500000,
    levelRequirement: 30
  },
  dataWorlds: {
    title: 'Data World',
    description: 'A world-wide network of data continents. Requires level 40 to unlock.',
    production: { points: 10000 },
    cost: 2000000,
    levelRequirement: 40
  },
  dataMoons: {
    title: 'Data Moon',
    description: 'A moon-sized data processing facility. Requires level 50 to unlock.',
    production: { points: 50000 },
    cost: 10000000,
    levelRequirement: 50
  },
  dataSolarSystems: {
    title: 'Data Solar System',
    description: 'A solar system-wide network of data moons. Requires level 60 to unlock.',
    production: { points: 250000 },
    cost: 50000000,
    levelRequirement: 60
  },
  dataGalaxies: {
    title: 'Data Galaxy',
    description: 'A galaxy-spanning network of data solar systems. Requires level 70 to unlock.',
    production: { points: 1000000 },
    cost: 200000000,
    levelRequirement: 70
  },
  dataUniverses: {
    title: 'Data Universe',
    description: 'A universe-wide network of data galaxies. Requires level 80 to unlock.',
    production: { points: 5000000 },
    cost: 1000000000,
    levelRequirement: 80
  },
  dataGods: {
    title: 'Data God',
    description: 'The ultimate data processing entity. Requires level 90 to unlock.',
    production: { points: 25000000 },
    cost: 5000000000,
    levelRequirement: 90
  }
}

const initialState = {
  points: 0,
  mouseFarms: 0,
  keyboardFactories: 0,
  monitorDisplays: 0,
  officeSpace: 0,
  serverRooms: 0,
  dataCenters: 0,
  dataCities: 0,
  dataCountries: 0,
  dataContinents: 0,
  dataWorlds: 0,
  dataMoons: 0,
  dataSolarSystems: 0,
  dataGalaxies: 0,
  dataUniverses: 0,
  dataGods: 0,
  mouseFarmsLevel: 1,
  keyboardFactoriesLevel: 1,
  monitorDisplaysLevel: 1,
  officeSpaceLevel: 1,
  serverRoomsLevel: 1,
  dataCentersLevel: 1,
  dataCitiesLevel: 1,
  dataCountriesLevel: 1,
  dataContinentsLevel: 1,
  dataWorldsLevel: 1,
  dataMoonsLevel: 1,
  dataSolarSystemsLevel: 1,
  dataGalaxiesLevel: 1,
  dataUniversesLevel: 1,
  dataGodsLevel: 1,
  autoClickers: 0,
  clickPower: 1,
  clickPowerUpgrades: 0,
  pointsPerSecond: 0,
  playerLevel: 1,
  playerAccepted: false,
}

// Production rates per building
const PRODUCTION_RATES = {
  mouseFarms: { points: 0.1 },
  keyboardFactories: { points: 0.2 },
  monitorDisplays: { points: 0.2 },
  officeSpace: { points: 1 },
  serverRooms: { points: 5 },
  dataCenters: { points: 25 },
  dataCities: { points: 100 },
  dataCountries: { points: 500 },
  dataContinents: { points: 2500 },
  dataWorlds: { points: 10000 },
  dataMoons: { points: 50000 },
  dataSolarSystems: { points: 250000 },
  dataGalaxies: { points: 1000000 },
  dataUniverses: { points: 5000000 },
  dataGods: { points: 25000000 },
}

// Building costs
const BUILDING_COSTS = {
  mouseFarms: 10,
  keyboardFactories: 50,
  monitorDisplays: 100,
  officeSpace: 500,
  serverRooms: 1000,
  dataCenters: 5000,
  dataCities: 25000,
  dataCountries: 100000,
  dataContinents: 500000,
  dataWorlds: 2000000,
  dataMoons: 10000000,
  dataSolarSystems: 50000000,
  dataGalaxies: 200000000,
  dataUniverses: 1000000000,
  dataGods: 5000000000,
}

// Building level requirements
const BUILDING_LEVEL_REQUIREMENTS = {
  mouseFarms: 1,
  keyboardFactories: 1,
  monitorDisplays: 1,
  officeSpace: 1,
  serverRooms: 1,
  dataCenters: 5,
  dataCities: 10,
  dataCountries: 20,
  dataContinents: 30,
  dataWorlds: 40,
  dataMoons: 50,
  dataSolarSystems: 60,
  dataGalaxies: 70,
  dataUniverses: 80,
  dataGods: 90,
}

// Helper function to determine building tier based on level requirement
const getBuildingTier = (buildingType: BuildingType): BuildingTier => {
  const levelRequirement = BUILDING_LEVEL_REQUIREMENTS[buildingType];
  
  if (levelRequirement <= 5) {
    return 'early';
  } else if (levelRequirement <= 50) {
    return 'mid';
  } else {
    return 'late';
  }
}

// Get tier-based upgrade cost multiplier
const getTierMultiplier = (tier: BuildingTier): number => {
  switch (tier) {
    case 'early': return 1.75; // Steeper curve for early buildings
    case 'mid': return 1.6;    // Medium curve for mid-game
    case 'late': return 1.5;   // Unchanged for late game
  }
}

// Get tier-based production scaling power
const getTierScalingPower = (tier: BuildingTier): number => {
  switch (tier) {
    case 'early': return 0.9;  // Sub-linear scaling for early buildings
    case 'mid': return 0.95;   // Slightly sub-linear for mid-game
    case 'late': return 1;     // Linear scaling for late game
  }
}

// Calculate upgrade cost based on current level and building tier
const calculateUpgradeCost = (buildingType: BuildingType, currentLevel: number): number => {
  const baseCost = BUILDING_COSTS[buildingType]
  const tier = getBuildingTier(buildingType)
  const multiplier = getTierMultiplier(tier)
  
  // Formula: baseCost * multiplier^(currentLevel - 1)
  // This ensures costs scale exponentially with level
  const cost = Math.floor(baseCost * Math.pow(multiplier, currentLevel - 1))
  
  // For debugging
  console.log(`Upgrade cost for ${buildingType} at level ${currentLevel}: ${cost} points, tier: ${tier}, multiplier: ${multiplier}`)
  
  return cost
}

// Calculate building production based on level, count, and tier
const calculateProduction = (buildingType: BuildingType, level: number, count: number): number => {
  const baseRate = PRODUCTION_RATES[buildingType].points || 0
  const tier = getBuildingTier(buildingType)
  const scalingPower = getTierScalingPower(tier)
  
  // Apply tier-based scaling to level
  const effectiveLevel = Math.pow(level, scalingPower)
  
  return baseRate * effectiveLevel * count
}

// Helper function to calculate click power upgrade cost
const calculateClickPowerUpgradeCost = (upgrades: number): number => {
  return Math.floor(20 * Math.pow(1.5, upgrades));
}

type BuildingType = keyof typeof BUILDING_COSTS
type UpgradeType = 'autoClickers' | 'clickPower'

// Helper function to get available buildings
const getAvailableBuildings = (playerLevel: number): BuildingInfo[] => {
  return Object.entries(BUILDING_INFO)
    .filter(([_, building]) => building.levelRequirement <= playerLevel)
    .map(([id, building]) => ({
      ...building,
      id
    }))
    .sort((a, b) => a.cost - b.cost)
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      click: () => {
        const { clickPower, autoClickers, playerAccepted } = get()
        
        // Only allow clicks if player has accepted the employment agreement
        if (!playerAccepted) return
        
        const pointsPerClick = clickPower * (1 + autoClickers * 0.1)
        set((state) => ({
          points: state.points + pointsPerClick,
        }))
      },

      buyBuilding: (buildingType: BuildingType) => {
        const state = get()
        const cost = BUILDING_COSTS[buildingType]
        
        // Get building info for level requirement check
        const info = BUILDING_INFO[buildingType];
        
        // Check if player meets level requirement
        if (state.playerLevel < info.levelRequirement) {
          return;
        }
        
        if (state.points >= cost) {
          // Play purchase sound
          playPurchaseSound()
          
          set((state) => {
            const newCount = state[buildingType] + 1
            const level = state[`${buildingType}Level` as keyof GameState] as number
            
            // Use the new calculateProduction function
            const newProduction = calculateProduction(buildingType, level, newCount)
            const oldProduction = calculateProduction(buildingType, level, newCount - 1)
            const productionDifference = newProduction - oldProduction
            
            return {
              points: state.points - cost,
              [buildingType]: newCount,
              pointsPerSecond: state.pointsPerSecond + productionDifference,
            }
          })
        }
      },

      buyUpgrade: (type: UpgradeType) => {
        const state = get();
        
        if (type === 'clickPower') {
          const cost = get().getClickPowerUpgradeCost();
          
          // Check if we have enough points
          if (state.points < cost) return;
          
          // Apply the upgrade
          set({
            points: state.points - cost,
            clickPower: state.clickPower + 1,
            clickPowerUpgrades: state.clickPowerUpgrades + 1
          });
          
          // Play upgrade sound instead of purchase sound
          playUpgradeSound();
        }
      },

      getClickPowerUpgradeCost: () => {
        const { clickPowerUpgrades } = get()
        return calculateClickPowerUpgradeCost(clickPowerUpgrades)
      },

      getBuildingUpgradeCost: (buildingType: BuildingType) => {
        const state = get()
        const currentLevel = state[`${buildingType}Level` as keyof GameState] as number
        return calculateUpgradeCost(buildingType, currentLevel)
      },

      canUpgradeBuilding: (buildingType: BuildingType) => {
        const state = get()
        // Check if player owns at least one building
        if (state[buildingType] <= 0) {
          return false
        }
        
        // Get current level and calculate upgrade cost
        const currentLevel = state[`${buildingType}Level` as keyof GameState] as number
        const cost = calculateUpgradeCost(buildingType, currentLevel)
        
        // Check if player has enough points
        return state.points >= cost
      },

      upgradeBuilding: (buildingType: BuildingType) => {
        const state = get()
        const currentLevel = state[`${buildingType}Level` as keyof GameState] as number
        const cost = calculateUpgradeCost(buildingType, currentLevel)
        const ownedCount = state[buildingType]
        
        console.log(`Attempting to upgrade ${buildingType}: 
          - Current level: ${currentLevel}
          - Upgrade cost: ${cost}
          - Player points: ${state.points}
          - Buildings owned: ${ownedCount}
          - Can afford: ${state.points >= cost}
          - Owns building: ${ownedCount > 0}
        `)
        
        if (state.points >= cost && state[buildingType] > 0) {
          // Play upgrade sound instead of purchase sound
          playUpgradeSound()
          
          set((state) => {
            const newLevel = (state[`${buildingType}Level` as keyof GameState] as number) + 1
            const count = state[buildingType]
            
            // Use the new calculateProduction function for both old and new production
            const oldProduction = calculateProduction(buildingType, currentLevel, count)
            const newProduction = calculateProduction(buildingType, newLevel, count)
            const productionDifference = newProduction - oldProduction
            
            console.log(`Upgrade successful! New level: ${newLevel}, Production increase: +${productionDifference}/s`)
            
            return {
              points: state.points - cost,
              [`${buildingType}Level`]: newLevel,
              pointsPerSecond: state.pointsPerSecond + productionDifference,
            }
          })
        } else {
          // Log why upgrade failed
          console.warn(`Upgrade failed! ${state.points < cost ? 'Not enough points' : 'No buildings owned'}`)
        }
      },
      
      resetGame: () => {
        set(initialState)
        window.location.reload()
      },

      tick: () => {
        const state = get()
        
        // Don't add production if player hasn't accepted employment
        if (!state.playerAccepted) return
        
        // Add production from buildings
        if (state.pointsPerSecond > 0) {
          set((state) => ({
            points: state.points + state.pointsPerSecond / 10, // 10 ticks per second
          }))
        }
        
        // Update player level based on points per second
        const currentLevel = state.playerLevel
        const newLevel = Math.max(1, Math.floor(Math.log10(state.pointsPerSecond) + 1))
        
        if (newLevel !== currentLevel) {
          // If level has increased, play the level up sound
          if (newLevel > currentLevel) {
            playLevelUpSound()
          }
          
          set({ playerLevel: newLevel })
        }
      },

      getAvailableBuildings: () => {
        const { playerLevel } = get()
        return getAvailableBuildings(playerLevel)
      },

      setPlayerAccepted: (accepted: boolean) => {
        set({ playerAccepted: accepted })
      },
    }),
    {
      name: 'clicker-game',
    }
  )
) 