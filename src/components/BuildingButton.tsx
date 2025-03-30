import { 
  Box, 
  Button, 
  VStack,
  Text, 
  Badge,
  Tooltip,
  HStack,
  Image
} from '@chakra-ui/react'
import { useGameStore } from '../store/gameStore'

// Import all building images
import mouseImg from '../assets/mouse.png'
import keyboardImg from '../assets/keyboard.png'
import monitorImg from '../assets/monitor.png'
import officeImg from '../assets/office.png'
import serverRoomImg from '../assets/server room.png'
import dataCenterImg from '../assets/data center.png'
import cityImg from '../assets/city.png'
import countryImg from '../assets/country.png'
import continentImg from '../assets/continent.png'
import worldImg from '../assets/world.png'
import moonImg from '../assets/moon.png'
import solarSystemImg from '../assets/solar system.png'
import galaxyImg from '../assets/galaxy.png'
import universeImg from '../assets/universe.png'
import godImg from '../assets/god.png'

// Create an image mapping object
const buildingImages = {
  mouseFarms: mouseImg,
  keyboardFactories: keyboardImg,
  monitorDisplays: monitorImg,
  officeSpace: officeImg,
  serverRooms: serverRoomImg,
  dataCenters: dataCenterImg,
  dataCities: cityImg,
  dataCountries: countryImg,
  dataContinents: continentImg,
  dataWorlds: worldImg,
  dataMoons: moonImg,
  dataSolarSystems: solarSystemImg,
  dataGalaxies: galaxyImg,
  dataUniverses: universeImg,
  dataGods: godImg
}

interface BuildingButtonProps {
  title: string
  cost: number
  owned: number
  level: number
  onClick: () => void
  description: string
  production: { points?: number }
  buildingType: string
  levelRequirement: number
}

export function BuildingButton({
  title,
  cost,
  owned,
  level,
  onClick,
  description,
  production,
  buildingType,
  levelRequirement
}: BuildingButtonProps) {
  const { points, playerLevel, upgradeBuilding } = useGameStore()
  const canAfford = points >= cost
  const meetsLevelRequirement = playerLevel >= levelRequirement
  const isDisabled = !canAfford || !meetsLevelRequirement

  // Calculate upgrade cost
  const calculateUpgradeCost = (currentLevel: number): number => {
    return Math.floor(cost * Math.pow(1.5, currentLevel - 1))
  }
  
  const upgradeCost = calculateUpgradeCost(level)
  const canUpgrade = points >= upgradeCost && owned > 0
  const pointsPerSecond = production.points || 0

  return (
    <Box
      bg="gray.700"
      p={4}
      borderRadius="lg"
      border="1px"
      borderColor="gray.600"
    >
      <VStack align="stretch" spacing={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold">{title}</Text>
          <HStack>
            <Text>Owned: {owned}</Text>
            <Text>Level: {level}</Text>
          </HStack>
        </Box>
        
        {/* Add the building image */}
        <Box 
          display="flex" 
          justifyContent="center" 
          bg="gray.800" 
          borderRadius="md" 
          p={2}
          height="120px"
          overflow="hidden"
        >
          <Image 
            src={buildingImages[buildingType as keyof typeof buildingImages]} 
            alt={title}
            objectFit="contain"
            maxHeight="100%"
          />
        </Box>
        
        <Text fontSize="sm" color="gray.400">{description}</Text>
        <Box>
          <Text fontSize="sm">Production:</Text>
          <Text fontSize="sm">Points: {(pointsPerSecond * level).toFixed(1)}/s per building</Text>
          <Text fontSize="sm">Total: {(pointsPerSecond * level * owned).toFixed(1)}/s</Text>
        </Box>
        <HStack spacing={2}>
          <Button 
            onClick={onClick}
            isDisabled={points < cost || playerLevel < levelRequirement}
            colorScheme="blue"
            size="sm"
            flexGrow={1}
          >
            Buy ({cost} points)
          </Button>
          <Tooltip label={owned === 0 ? "You need to own this building first" : ""}>
            <Button 
              onClick={() => upgradeBuilding(buildingType as any)}
              isDisabled={!canUpgrade}
              colorScheme="green"
              size="sm"
              flexGrow={1}
            >
              Upgrade ({upgradeCost} points)
            </Button>
          </Tooltip>
        </HStack>
      </VStack>
    </Box>
  )
} 