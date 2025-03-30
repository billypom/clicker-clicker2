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
import { formatNumber } from '../utils/numberUtils'

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
  const { 
    points, 
    playerLevel, 
    upgradeBuilding, 
    canUpgradeBuilding,
    getBuildingUpgradeCost
  } = useGameStore()
  
  const canAfford = points >= cost
  const meetsLevelRequirement = playerLevel >= levelRequirement
  const isDisabledStyle = !canAfford || !meetsLevelRequirement

  // Get upgrade cost from the store's actual calculation
  // This ensures the displayed cost matches the actual cost used in the upgrade function
  const upgradeCost = getBuildingUpgradeCost(buildingType as keyof typeof buildingImages)
  
  // Use the game store's method to determine if upgrade is possible
  const canUpgrade = canUpgradeBuilding(buildingType as keyof typeof buildingImages)
  const pointsPerSecond = production.points || 0

  // Create a helpful tooltip message
  const getUpgradeTooltip = () => {
    if (owned === 0) {
      return "You need to own this building first";
    } else if (points < upgradeCost) {
      return `Not enough points (${formatNumber(points)}/${formatNumber(upgradeCost)})`;
    }
    return `Upgrade to level ${level + 1}`;
  };

  return (
    <Box
      bg="background.card"
      p={4}
      borderRadius="lg"
      border="1px"
      borderColor="brand.700"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.24)"
      transition="all 0.2s ease-in-out"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "0 6px 10px -1px rgba(0, 0, 0, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.3)"
      }}
    >
      <VStack align="stretch" spacing={2}>
        {/* Image with overlapping title and stats */}
        <Box position="relative">
          <AspectRatio ratio={1} w="100%">
            <Box 
              borderRadius="md" 
              overflow="hidden"
              borderWidth="2px"
              borderColor="brand.800"
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
            bg="background.cardOverlay"
            borderTopLeftRadius="md"
            borderBottomRightRadius="md"
            boxShadow="0 1px 3px rgba(0,0,0,0.5)"
          >
            <Text fontWeight="bold" fontSize="sm" color="brand.200" variant="pixel">{title}</Text>
          </Box>
          
          {/* Overlay for owned count */}
          <Box 
            position="absolute" 
            bottom="0" 
            right="0" 
            p={2} 
            bg="background.cardOverlay"
            borderTopLeftRadius="md"
            borderBottomRightRadius="md"
            boxShadow="0 1px 3px rgba(0,0,0,0.5)"
          >
            <Text fontSize="xs" color="brand.100">Owned: {formatNumber(owned)}</Text>
          </Box>

          {/* Level badge */}
          <Box 
            position="absolute" 
            top="0" 
            right="0" 
            p={2} 
            bg="brand.400"
            borderTopRightRadius="md"
            borderBottomLeftRadius="md"
            boxShadow="0 1px 3px rgba(0,0,0,0.5)"
          >
            <Text fontSize="xs" fontWeight="bold" color="text.dark">Level {level}</Text>
          </Box>
        </Box>
        
        <Text fontSize="sm" color="text.secondary">{description}</Text>
        <Box p={2} bg="background.secondary" borderRadius="md">
          <Flex justifyContent="space-between" alignItems="center" mb={1}>
            <Text fontSize="sm" fontWeight="bold" color="brand.300" variant="pixel">Production:</Text>
          </Flex>
          <Text fontSize="sm" color="text.primary">Points: {formatNumber(pointsPerSecond * level)}/s per building</Text>
          <Text fontSize="sm" color="text.primary">Total: {formatNumber(pointsPerSecond * level * owned)}/s</Text>
        </Box>
        <HStack spacing={2}>
          <Button 
            onClick={onClick}
            opacity={isDisabledStyle ? 0.4 : 1}
            _hover={{ bg: 'brand.500', opacity: isDisabledStyle ? 0.4 : 1 }}
            cursor={isDisabledStyle ? 'not-allowed' : 'pointer'}
            colorScheme="brand"
            bg="brand.400"
            color="text.dark"
            size="sm"
            flexGrow={1}
          >
            Buy ({formatNumber(cost)} points)
          </Button>
          <Tooltip label={getUpgradeTooltip()}>
            <Button 
              onClick={() => upgradeBuilding(buildingType as keyof typeof buildingImages)}
              opacity={!canUpgrade ? 0.4 : 1}
              _hover={{ bg: 'background.highlight', opacity: !canUpgrade ? 0.4 : 1 }}
              cursor={!canUpgrade ? 'not-allowed' : 'pointer'}
              colorScheme="brand"
              size="sm"
              flexGrow={1}
              variant="outline"
            >
              Upgrade ({formatNumber(upgradeCost)} points)
            </Button>
          </Tooltip>
        </HStack>
      </VStack>
    </Box>
  )
} 