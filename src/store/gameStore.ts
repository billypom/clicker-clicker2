import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BuildingInfo {
  id: string
  cost: number
  levelRequirement: number
  title: string
  description: string
  production: {
    points?: number
    techParts?: number
  }
}

interface GameState {
  // Resources
  points: number
  techParts: number
  
  // Buildings
  mouseFarms: number
  keyboardFactories: number
  monitorDisplays: number
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
  
  // Production rates
  pointsPerSecond: number
  techPartsPerSecond: number

  // Special purchases
  clickMultiplier: number
  multiplierEndTime: number | null

  // Player level
  playerLevel: number
  
  // Actions
  click: () => void
  buyBuilding: (buildingType: BuildingType) => void
  buyUpgrade: (upgradeType: UpgradeType) => void
  resetGame: () => void
  tick: () => void
  buyMultiplier: (duration: number, multiplier: number) => void
  upgradeBuilding: (buildingType: BuildingType) => void

  // New getter for available buildings
  getAvailableBuildings: () => BuildingInfo[]
}

type BuildingType = 
  | 'mouseFarms' 
  | 'keyboardFactories' 
  | 'monitorDisplays' 
  | 'serverRooms' 
  | 'dataCenters'
  | 'dataCities'
  | 'dataCountries'
  | 'dataContinents'
  | 'dataWorlds'
  | 'dataMoons'
  | 'dataSolarSystems'
  | 'dataGalaxies'
  | 'dataUniverses'
  | 'dataGods'

type UpgradeType = 'autoClickers' | 'clickPower'

const initialState = {
  points: 0,
  techParts: 0,
  mouseFarms: 0,
  keyboardFactories: 0,
  monitorDisplays: 0,
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
  pointsPerSecond: 0,
  techPartsPerSecond: 0,
  clickMultiplier: 1,
  multiplierEndTime: null,
  playerLevel: 1,
}

// Production rates per building
const PRODUCTION_RATES = {
  mouseFarms: { points: 0.1, techParts: 0 },
  keyboardFactories: { points: 0, techParts: 0.05 },
  monitorDisplays: { points: 0.2, techParts: 0.1 },
  serverRooms: { points: 1, techParts: 0.5 },
  dataCenters: { points: 5, techParts: 2 },
  dataCities: { points: 25, techParts: 10 },
  dataCountries: { points: 100, techParts: 40 },
  dataContinents: { points: 500, techParts: 200 },
  dataWorlds: { points: 2500, techParts: 1000 },
  dataMoons: { points: 10000, techParts: 4000 },
  dataSolarSystems: { points: 50000, techParts: 20000 },
  dataGalaxies: { points: 250000, techParts: 100000 },
  dataUniverses: { points: 1000000, techParts: 400000 },
  dataGods: { points: 5000000, techParts: 2000000 },
}

// Building costs
const BUILDING_COSTS = {
  mouseFarms: 10,
  keyboardFactories: 50,
  monitorDisplays: 100,
  serverRooms: 500,
  dataCenters: 1000,
  dataCities: 5000,
  dataCountries: 25000,
  dataContinents: 100000,
  dataWorlds: 500000,
  dataMoons: 2000000,
  dataSolarSystems: 10000000,
  dataGalaxies: 50000000,
  dataUniverses: 200000000,
  dataGods: 1000000000,
}

// Building level requirements
const BUILDING_LEVEL_REQUIREMENTS = {
  mouseFarms: 1,
  keyboardFactories: 1,
  monitorDisplays: 1,
  serverRooms: 1,
  dataCenters: 1,
  dataCities: 5,
  dataCountries: 10,
  dataContinents: 20,
  dataWorlds: 30,
  dataMoons: 40,
  dataSolarSystems: 50,
  dataGalaxies: 60,
  dataUniverses: 70,
  dataGods: 80,
}

// Special multiplier purchases
const MULTIPLIER_PURCHASES = [
  { duration: 30, multiplier: 2, cost: 10, name: '30s 2x Click Power' },
  { duration: 60, multiplier: 2, cost: 15, name: '1m 2x Click Power' },
  { duration: 30, multiplier: 3, cost: 25, name: '30s 3x Click Power' },
  { duration: 60, multiplier: 3, cost: 35, name: '1m 3x Click Power' },
  { duration: 30, multiplier: 5, cost: 50, name: '30s 5x Click Power' },
  { duration: 60, multiplier: 5, cost: 75, name: '1m 5x Click Power' },
]

// Calculate upgrade cost based on current level
const calculateUpgradeCost = (buildingType: BuildingType, currentLevel: number): number => {
  const baseCost = BUILDING_COSTS[buildingType]
  return Math.floor(baseCost * Math.pow(1.5, currentLevel - 1))
}

// Building costs and level requirements
export const BUILDING_INFO = {
  mouseFarms: {
    cost: 10,
    levelRequirement: 1,
    title: 'Mouse Farm',
    description: 'A basic facility that produces computer mice. Each mouse farm generates points automatically.',
    production: { points: 0.1 }
  },
  keyboardFactories: {
    cost: 50,
    levelRequirement: 1,
    title: 'Keyboard Factory',
    description: 'Manufactures mechanical keyboards and generates tech parts. Essential for advanced upgrades.',
    production: { techParts: 0.05 }
  },
  monitorDisplays: {
    cost: 100,
    levelRequirement: 1,
    title: 'Monitor Display',
    description: 'High-resolution displays that generate both points and tech parts. A balanced production facility.',
    production: { points: 0.2, techParts: 0.1 }
  },
  serverRooms: {
    cost: 500,
    levelRequirement: 1,
    title: 'Server Room',
    description: 'A powerful facility that generates significant amounts of both resources. Requires proper cooling.',
    production: { points: 1, techParts: 0.5 }
  },
  dataCenters: {
    cost: 1000,
    levelRequirement: 1,
    title: 'Data Center',
    description: 'The ultimate production facility. Generates massive amounts of resources but requires significant investment.',
    production: { points: 5, techParts: 2 }
  },
  dataCities: {
    cost: 5000,
    levelRequirement: 5,
    title: 'Data City',
    description: 'A massive network of data centers spanning an entire city. Requires level 5 to unlock.',
    production: { points: 25, techParts: 10 }
  },
  dataCountries: {
    cost: 25000,
    levelRequirement: 10,
    title: 'Data Country',
    description: 'A country-wide network of data cities. Requires level 10 to unlock.',
    production: { points: 100, techParts: 40 }
  },
  dataContinents: {
    cost: 100000,
    levelRequirement: 20,
    title: 'Data Continent',
    description: 'A continent-spanning network of data countries. Requires level 20 to unlock.',
    production: { points: 500, techParts: 200 }
  },
  dataWorlds: {
    cost: 500000,
    levelRequirement: 30,
    title: 'Data World',
    description: 'A world-wide network of data continents. Requires level 30 to unlock.',
    production: { points: 2500, techParts: 1000 }
  },
  dataMoons: {
    cost: 2000000,
    levelRequirement: 40,
    title: 'Data Moon',
    description: 'A moon-sized data processing facility. Requires level 40 to unlock.',
    production: { points: 10000, techParts: 4000 }
  },
  dataSolarSystems: {
    cost: 10000000,
    levelRequirement: 50,
    title: 'Data Solar System',
    description: 'A solar system-wide network of data moons. Requires level 50 to unlock.',
    production: { points: 50000, techParts: 20000 }
  },
  dataGalaxies: {
    cost: 50000000,
    levelRequirement: 60,
    title: 'Data Galaxy',
    description: 'A galaxy-spanning network of data solar systems. Requires level 60 to unlock.',
    production: { points: 250000, techParts: 100000 }
  },
  dataUniverses: {
    cost: 200000000,
    levelRequirement: 70,
    title: 'Data Universe',
    description: 'A universe-wide network of data galaxies. Requires level 70 to unlock.',
    production: { points: 1000000, techParts: 400000 }
  },
  dataGods: {
    cost: 1000000000,
    levelRequirement: 80,
    title: 'Data God',
    description: 'The ultimate data processing entity. Requires level 80 to unlock.',
    production: { points: 5000000, techParts: 2000000 }
  }
}

// Helper function to get available buildings based on player level
const getAvailableBuildings = (playerLevel: number) => {
  return Object.entries(BUILDING_INFO)
    .filter(([_, info]) => info.levelRequirement <= playerLevel)
    .map(([key, info]) => ({
      id: key,
      ...info
    }))
    .sort((a, b) => a.cost - b.cost)
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      click: () => {
        const { clickPower, autoClickers, clickMultiplier } = get()
        const pointsPerClick = clickPower * (1 + autoClickers * 0.1) * clickMultiplier
        set((state) => ({
          points: state.points + pointsPerClick,
        }))
      },

      buyBuilding: (buildingType: BuildingType) => {
        const state = get()
        const cost = BUILDING_COSTS[buildingType]
        if (state.points >= cost) {
          set((state) => {
            const newCount = state[buildingType] + 1
            const rates = PRODUCTION_RATES[buildingType]
            const level = state[`${buildingType}Level` as keyof GameState] as number
            
            return {
              points: state.points - cost,
              [buildingType]: newCount,
              pointsPerSecond: state.pointsPerSecond + rates.points * level,
              techPartsPerSecond: state.techPartsPerSecond + rates.techParts * level,
            }
          })
        }
      },

      upgradeBuilding: (buildingType: BuildingType) => {
        const state = get()
        const currentLevel = state[`${buildingType}Level` as keyof GameState] as number
        const upgradeCost = calculateUpgradeCost(buildingType, currentLevel)
        
        if (state.points >= upgradeCost) {
          set((state) => {
            const rates = PRODUCTION_RATES[buildingType]
            const count = state[buildingType]
            const newLevel = currentLevel + 1
            
            return {
              points: state.points - upgradeCost,
              [`${buildingType}Level`]: newLevel,
              pointsPerSecond: state.pointsPerSecond + rates.points * count,
              techPartsPerSecond: state.techPartsPerSecond + rates.techParts * count,
            }
          })
        }
      },

      buyUpgrade: (upgradeType: UpgradeType) => {
        const state = get()
        const upgradeCosts: Record<UpgradeType, number> = {
          autoClickers: 50,
          clickPower: 20,
        }

        const cost = upgradeCosts[upgradeType]
        if (state.points >= cost) {
          set((state) => ({
            points: state.points - cost,
            [upgradeType]: state[upgradeType] + 1,
          }))
        }
      },

      buyMultiplier: (duration: number, multiplier: number) => {
        const state = get()
        const purchase = MULTIPLIER_PURCHASES.find(
          p => p.duration === duration && p.multiplier === multiplier
        )
        
        if (purchase && state.techParts >= purchase.cost) {
          const now = Date.now()
          set((state) => ({
            techParts: state.techParts - purchase.cost,
            clickMultiplier: multiplier,
            multiplierEndTime: now + duration * 1000,
          }))
        }
      },

      tick: () => {
        const state = get()
        const now = Date.now()
        
        // Check if multiplier has expired
        if (state.multiplierEndTime && now >= state.multiplierEndTime) {
          set({ clickMultiplier: 1, multiplierEndTime: null })
        }

        // Update player level based on points per second
        const newLevel = Math.floor(Math.log10(state.pointsPerSecond + 1)) + 1
        if (newLevel !== state.playerLevel) {
          set({ playerLevel: newLevel })
        }

        // Calculate resources gained in this tick (1/10th of a second)
        const pointsGained = state.pointsPerSecond / 10
        const techPartsGained = state.techPartsPerSecond / 10

        set({
          points: state.points + pointsGained,
          techParts: state.techParts + techPartsGained,
        })
      },

      resetGame: () => {
        set(initialState)
      },

      // Add new getter for available buildings
      getAvailableBuildings: () => {
        const state = get()
        return getAvailableBuildings(state.playerLevel)
      },
    }),
    {
      name: 'game-storage',
    }
  )
) 