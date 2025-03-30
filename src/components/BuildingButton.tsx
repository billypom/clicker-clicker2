import { 
  Box, 
  Button, 
  VStack,
  Text, 
  Badge,
  Tooltip,
  HStack,
  Image,
  Flex,
  AspectRatio
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
  const isDisabledStyle = !canAfford || !meetsLevelRequirement

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
        {/* Image with overlapping title and stats */}
        <Box position="relative">
          <AspectRatio ratio={1} w="100%">
            <Box 
              borderRadius="md" 
              overflow="hidden"
            >
              <Image 
                src={buildingImages[buildingType as keyof typeof buildingImages]} 
                alt={title}
                objectFit="cover"
                w="100%"
                h="100%"
              />
            </Box>
          </AspectRatio>
          
          {/* Overlay for title */}
          <Box 
            position="absolute" 
            top="0" 
            left="0" 
            p={2} 
            bg="blackAlpha.700"
            borderTopLeftRadius="md"
            borderBottomRightRadius="md"
          >
            <Text fontWeight="bold" fontSize="md">{title}</Text>
          </Box>
          
          {/* Overlay for owned count */}
          <Box 
            position="absolute" 
            bottom="0" 
            right="0" 
            p={2} 
            bg="blackAlpha.700"
            borderTopLeftRadius="md"
            borderBottomRightRadius="md"
          >
            <Text fontSize="sm">Owned: {owned}</Text>
          </Box>

          {/* Level badge */}
          <Box 
            position="absolute" 
            top="0" 
            right="0" 
            p={2} 
            bg="blue.700"
            borderTopRightRadius="md"
            borderBottomLeftRadius="md"
          >
            <Text fontSize="xs" fontWeight="bold">Level {level}</Text>
          </Box>
        </Box>
        
        <Text fontSize="sm" color="gray.400">{description}</Text>
        <Box>
          <Flex justifyContent="space-between" alignItems="center" mb={1}>
            <Text fontSize="sm" fontWeight="bold">Production:</Text>
          </Flex>
          <Text fontSize="sm">Points: {(pointsPerSecond * level).toFixed(1)}/s per building</Text>
          <Text fontSize="sm">Total: {(pointsPerSecond * level * owned).toFixed(1)}/s</Text>
        </Box>
        <HStack spacing={2}>
          <Button 
            onClick={onClick}
            opacity={isDisabledStyle ? 0.4 : 1}
            _hover={{ bg: 'blue.600', opacity: isDisabledStyle ? 0.4 : 1 }}
            cursor={isDisabledStyle ? 'not-allowed' : 'pointer'}
            colorScheme="blue"
            size="sm"
            flexGrow={1}
          >
            Buy ({cost} points)
          </Button>
          <Tooltip label={owned === 0 ? "You need to own this building first" : ""}>
            <Button 
              onClick={() => upgradeBuilding(buildingType as any)}
              opacity={!canUpgrade ? 0.4 : 1}
              _hover={{ bg: 'green.600', opacity: !canUpgrade ? 0.4 : 1 }}
              cursor={!canUpgrade ? 'not-allowed' : 'pointer'}
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