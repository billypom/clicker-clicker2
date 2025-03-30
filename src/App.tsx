import { ResourceDisplay } from './components/ResourceDisplay'
import { BuildingButton } from './components/BuildingButton'
import { MultiplierShop } from './components/MultiplierShop'
import { NextBuildingPreview } from './components/NextBuildingPreview'
import { ResetButton } from './components/ResetButton'
import { useGameStore } from './store/gameStore'
import { 
  ChakraProvider, 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack,
  SimpleGrid,
  Button,
  Flex
} from '@chakra-ui/react'
import theme from './theme'
import { useEffect } from 'react'

type BuildingId = 'mouseFarms' | 'keyboardFactories' | 'monitorDisplays' | 'officeSpace' | 'serverRooms' | 'dataCenters' | 
                  'dataCities' | 'dataCountries' | 'dataContinents' | 'dataWorlds' | 'dataMoons' | 
                  'dataSolarSystems' | 'dataGalaxies' | 'dataUniverses' | 'dataGods'

type BuildingLevelKey = `${BuildingId}Level`

const BUILDING_INFO = {
  mouseFarms: {
    title: 'Mouse Farm',
    description: 'A basic facility that produces computer mice. Each mouse farm generates points automatically.',
    production: { points: 0.1 }
  },
  keyboardFactories: {
    title: 'Keyboard Factory',
    description: 'Manufactures mechanical keyboards and generates tech parts. Essential for advanced upgrades.',
    production: { techParts: 0.05 }
  },
  monitorDisplays: {
    title: 'Monitor Display',
    description: 'High-resolution displays that generate both points and tech parts. A balanced production facility.',
    production: { points: 0.2, techParts: 0.1 }
  },
  serverRooms: {
    title: 'Server Room',
    description: 'A powerful facility that generates significant amounts of both resources. Requires proper cooling.',
    production: { points: 1, techParts: 0.5 }
  },
  dataCenters: {
    title: 'Data Center',
    description: 'The ultimate production facility. Generates massive amounts of resources but requires significant investment.',
    production: { points: 5, techParts: 2 }
  },
  dataCities: {
    title: 'Data City',
    description: 'A massive network of data centers spanning an entire city. Requires level 5 to unlock.',
    production: { points: 25, techParts: 10 }
  },
  dataCountries: {
    title: 'Data Country',
    description: 'A country-wide network of data cities. Requires level 10 to unlock.',
    production: { points: 100, techParts: 40 }
  },
  dataContinents: {
    title: 'Data Continent',
    description: 'A continent-spanning network of data countries. Requires level 20 to unlock.',
    production: { points: 500, techParts: 200 }
  },
  dataWorlds: {
    title: 'Data World',
    description: 'A world-wide network of data continents. Requires level 30 to unlock.',
    production: { points: 2500, techParts: 1000 }
  },
  dataMoons: {
    title: 'Data Moon',
    description: 'A moon-sized data processing facility. Requires level 40 to unlock.',
    production: { points: 10000, techParts: 4000 }
  },
  dataSolarSystems: {
    title: 'Data Solar System',
    description: 'A solar system-wide network of data moons. Requires level 50 to unlock.',
    production: { points: 50000, techParts: 20000 }
  },
  dataGalaxies: {
    title: 'Data Galaxy',
    description: 'A galaxy-spanning network of data solar systems. Requires level 60 to unlock.',
    production: { points: 250000, techParts: 100000 }
  },
  dataUniverses: {
    title: 'Data Universe',
    description: 'A universe-wide network of data galaxies. Requires level 70 to unlock.',
    production: { points: 1000000, techParts: 400000 }
  },
  dataGods: {
    title: 'Data God',
    description: 'The ultimate data processing entity. Requires level 80 to unlock.',
    production: { points: 5000000, techParts: 2000000 }
  }
}

function App() {
  const { 
    points,
    playerLevel,
    getAvailableBuildings,
    tick,
    clickPower,
    click
  } = useGameStore()

  const availableBuildings = getAvailableBuildings()

  // Set up game tick interval
  useEffect(() => {
    const interval = setInterval(tick, 100) // 100ms = 10 ticks per second
    return () => clearInterval(interval)
  }, [tick])

  // Handle clicks anywhere in the game
  const handleClick = (e: React.MouseEvent) => {
    // Don't count clicks on buttons or interactive elements
    if (e.target instanceof HTMLElement && 
        (e.target.tagName === 'BUTTON' || 
         e.target.closest('button') || 
         e.target.closest('[role="button"]'))) {
      return
    }
    click()
  }

  return (
    <ChakraProvider theme={theme}>
      <Box 
        minH="100vh" 
        bg="gray.900" 
        color="white"
        onClick={handleClick}
        cursor="pointer"
      >
        <ResourceDisplay />
        <Box pt="100px">
          <Container maxW="container.xl">
            <VStack spacing={8}>
              <Box textAlign="center" w="full">
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading as="h1" size="2xl">Clicker Clicker 2</Heading>
                  <ResetButton />
                </Flex>
                <Text fontSize="xl" color="yellow.400" mb={4}>Level {playerLevel}</Text>
              </Box>
              
              <VStack spacing={8} w="full">
                {/* Shop Section */}
                <Box bg="gray.800" p={6} borderRadius="lg" w="full">
                  <Heading as="h2" size="xl" mb={6} color="blue.400">Shop</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                    {availableBuildings.map((building) => (
                      <BuildingButton
                        key={building.id}
                        title={building.title}
                        cost={building.cost}
                        owned={useGameStore.getState()[building.id as BuildingId]}
                        level={useGameStore.getState()[`${building.id}Level` as BuildingLevelKey] as number}
                        onClick={() => useGameStore.getState().buyBuilding(building.id as BuildingId)}
                        description={building.description}
                        production={building.production}
                        buildingType={building.id}
                        levelRequirement={building.levelRequirement}
                      />
                    ))}
                    <NextBuildingPreview />
                  </SimpleGrid>
                </Box>

                <Box h="1px" bg="gray.600" w="full" />

                {/* Upgrades Section */}
                <Box bg="gray.800" p={6} borderRadius="lg" w="full">
                  <Heading as="h2" size="xl" mb={6} color="green.400">Upgrades</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                    <Box
                      bg="gray.700"
                      p={4}
                      borderRadius="lg"
                      border="1px"
                      borderColor="gray.600"
                    >
                      <VStack align="stretch" spacing={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Text fontWeight="bold">Click Power</Text>
                          <Text>Level {clickPower}</Text>
                        </Box>
                        <Text fontSize="sm" color="gray.400">
                          Each click generates {clickPower} points
                        </Text>
                        <Button 
                          onClick={() => useGameStore.getState().buyUpgrade('clickPower')}
                          isDisabled={points < 20}
                          bg="gray.600"
                          _hover={{ bg: 'gray.500' }}
                        >
                          Upgrade (20 points)
                        </Button>
                      </VStack>
                    </Box>
                  </SimpleGrid>
                </Box>
              </VStack>

              <MultiplierShop />
            </VStack>
          </Container>
        </Box>
      </Box>
    </ChakraProvider>
  )
}

export default App
