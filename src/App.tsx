import { ResourceDisplay } from './components/ResourceDisplay'
import { BuildingButton } from './components/BuildingButton'
import { NextBuildingPreview } from './components/NextBuildingPreview'
import { ResetButton } from './components/ResetButton'
import { useGameStore } from './store/gameStore'
import { playClickSound, initAudio } from './utils/soundUtils'
import { formatNumber } from './utils/numberUtils'
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

function App() {
  const { 
    points,
    playerLevel,
    getAvailableBuildings,
    tick,
    click,
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
    // Remove the local event listener since we're now handling events globally
    // This listener is no longer needed
    
    return () => {}
  }, [click, hasStarted])

  // This is now handled globally, but we'll keep a simpler version
  // for UI feedback only (cursor change, etc)
  const handleClick = (e: React.MouseEvent) => {
    // Don't call click() here as it's now handled globally
    // Just for visual feedback
    if (hasStarted) {
      console.log('App container clicked - handled by global handler');
    }
  }

  // Handle starting the game
  const handleStartGame = () => {
    if (agreedToTerms) {
      // Initialize audio on first user interaction
      initAudio();
      setHasStarted(true)
      onClose()
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Box 
        minH="100vh" 
        bg="background.primary" 
        color="white"
        onClick={handleClick}
        cursor={hasStarted ? "pointer" : "default"}
      >
        <ResourceDisplay />
        <Box pt="100px flex flex-col w-full">
          <Container maxW="container.xl m-auto">
            <VStack spacing={8}>
              <VStack spacing={8} w="full">
                {/* Game Title */}
                <Box textAlign="center" mt={10} mb={5}>
                  <Heading as="h1" size="lg" color="brand.300">Clicker Clicker 2</Heading>
                </Box>
                {/* Buildings Grid */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
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
                      buildingType={building.id!}
                      levelRequirement={building.levelRequirement}
                    />
                  ))}
                  <NextBuildingPreview />
                </SimpleGrid>
              </VStack>
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
          <ModalContent bg="background.secondary" color="white" maxW="800px">
            <ModalHeader borderBottom="1px" borderColor="brand.700" pb={4}>
              Welcome to ClickerCorp™
            </ModalHeader>
            <ModalBody py={6}>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={2} color="brand.300">
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
                  <Text fontSize="lg" fontWeight="bold" mb={2} color="brand.300">
                    Controls & Operations
                  </Text>
                  <Text fontSize="md" color="gray.300" lineHeight="1.6">
                    Click anywhere or press any key to generate points and advance your career in the digital clicking space.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="brand.200" fontStyle="italic">
                    (Please note: This position is unpaid and offers exposure as compensation)
                  </Text>
                </Box>

                <Checkbox 
                  colorScheme="brand"
                  isChecked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                >
                  I have read and agree to the terms of employment at ClickerCorp™
                </Checkbox>
              </VStack>
            </ModalBody>
            <ModalFooter borderTop="1px" borderColor="brand.700" pt={4}>
              <Button
                colorScheme="brand"
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
