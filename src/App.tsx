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
  Flex,
  Image,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  useDisclosure
} from '@chakra-ui/react'
import theme from './theme'
import { useEffect, useState } from 'react'
import logoImg from './assets/logo.png'

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

  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const availableBuildings = getAvailableBuildings()

  // Set up game tick interval
  useEffect(() => {
    const interval = setInterval(tick, 100) // 100ms = 10 ticks per second
    return () => clearInterval(interval)
  }, [tick])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only allow clicks after terms are accepted and modal is closed
      if (hasStarted) {
        click()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [click, hasStarted])

  // Handle clicks anywhere in the game
  const handleClick = (e: React.MouseEvent) => {
    // Only allow clicks after terms are accepted and modal is closed
    if (hasStarted) {
      click()
    }
  }

  // Handle starting the game
  const handleStartGame = () => {
    if (agreedToTerms) {
      setHasStarted(true)
      onClose()
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Box 
        minH="100vh" 
        bg="gray.900" 
        color="white"
        onClick={handleClick}
        cursor={hasStarted ? "pointer" : "default"}
      >
        <ResourceDisplay />
        <Box pt="100px">
          <Container maxW="container.xl">
            <VStack spacing={8}>
              <VStack spacing={8} w="full">
                {/* Buildings Grid */}
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
                          opacity={points < 20 ? 0.4 : 1}
                          _hover={{ bg: 'gray.500', opacity: points < 20 ? 0.4 : 1 }}
                          bg="gray.600"
                          cursor={points < 20 ? 'not-allowed' : 'pointer'}
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

        {/* Terms and Conditions Modal */}
        <Modal 
          isOpen={!hasStarted && points === 0} 
          onClose={() => {}} 
          closeOnOverlayClick={false} 
          isCentered 
          size="2xl"
        >
          <ModalOverlay />
          <ModalContent bg="gray.800" color="white" maxW="800px">
            <ModalHeader borderBottom="1px" borderColor="gray.700" pb={4}>
              Welcome to ClickerCorp™
            </ModalHeader>
            <ModalBody py={6}>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    Employment Agreement
                  </Text>
                  <Text fontSize="md" color="gray.300" lineHeight="1.6">
                    Welcome aboard! You have been selected by ClickerCorp™ to spearhead our mission-critical clicking initiatives. 
                    As our new Synergy Enhancement Specialist, you will leverage cutting-edge click-through paradigms to maximize 
                    stakeholder value in the rapidly evolving digital interaction space. Your KPIs include optimizing click-to-value 
                    ratios while maintaining best-in-class finger ergonomics. Together, we'll disrupt the clicking industry!
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    Controls & Operations
                  </Text>
                  <Text fontSize="md" color="gray.300" lineHeight="1.6">
                    Click anywhere or press any key to generate points and advance your career in the digital clicking space.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.400" fontStyle="italic">
                    (Please note: This position is unpaid and offers exposure as compensation)
                  </Text>
                </Box>

                <Checkbox 
                  colorScheme="cyan"
                  isChecked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                >
                  I have read and agree to the terms of employment at ClickerCorp™
                </Checkbox>
              </VStack>
            </ModalBody>
            <ModalFooter borderTop="1px" borderColor="gray.700" pt={4}>
              <Button
                colorScheme="cyan"
                isDisabled={!agreedToTerms}
                onClick={handleStartGame}
                w="full"
              >
                Begin Employment
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  )
}

export default App
