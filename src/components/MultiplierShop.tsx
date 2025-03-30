import { Box, Button, VStack, Text, SimpleGrid } from '@chakra-ui/react'
import { useGameStore } from '../store/gameStore'

const MULTIPLIER_PURCHASES = [
  { duration: 30, multiplier: 2, cost: 100, name: '30s 2x Click Power' },
  { duration: 60, multiplier: 2, cost: 150, name: '1m 2x Click Power' },
  { duration: 30, multiplier: 3, cost: 250, name: '30s 3x Click Power' },
  { duration: 60, multiplier: 3, cost: 350, name: '1m 3x Click Power' },
  { duration: 30, multiplier: 5, cost: 500, name: '30s 5x Click Power' },
  { duration: 60, multiplier: 5, cost: 750, name: '1m 5x Click Power' },
]

export function MultiplierShop() {
  const { points } = useGameStore()

  return (
    <Box bg="gray.800" p={6} borderRadius="lg">
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontSize="xl" fontWeight="bold">Click Power Multiplier</Text>
          <Text fontSize="sm" color="gray.400">
            Temporarily increase the points you get from clicking. Does not affect automatic point generation from buildings.
          </Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {MULTIPLIER_PURCHASES.map((purchase) => (
            <Button
              key={`${purchase.duration}-${purchase.multiplier}`}
              // Multiplier shop functionality is not yet implemented in the game state
              // onClick={() => buyMultiplier(purchase.duration, purchase.multiplier)}
              isDisabled={points < purchase.cost}
              bg="gray.700"
              _hover={{ bg: 'gray.600' }}
              height="auto"
              py={4}
              px={6}
            >
              <VStack align="stretch" spacing={2}>
                <Text fontSize="xl" fontWeight="bold">{purchase.multiplier}x Click Power</Text>
                <Text fontSize="md" color="gray.300">{purchase.duration}s duration</Text>
                <Box borderTop="1px" borderColor="gray.600" pt={2}>
                  <Text fontSize="md" color="yellow.400">Cost: {purchase.cost} points</Text>
                </Box>
              </VStack>
            </Button>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  )
} 