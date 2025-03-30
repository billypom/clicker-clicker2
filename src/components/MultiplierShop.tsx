import { Box, Button, VStack, HStack, Text } from '@chakra-ui/react'
import { useGameStore } from '../store/gameStore'

const MULTIPLIER_PURCHASES = [
  { duration: 30, multiplier: 2, cost: 10, name: '30s 2x Click Power' },
  { duration: 60, multiplier: 2, cost: 15, name: '1m 2x Click Power' },
  { duration: 30, multiplier: 3, cost: 25, name: '30s 3x Click Power' },
  { duration: 60, multiplier: 3, cost: 35, name: '1m 3x Click Power' },
  { duration: 30, multiplier: 5, cost: 50, name: '30s 5x Click Power' },
  { duration: 60, multiplier: 5, cost: 75, name: '1m 5x Click Power' },
]

export function MultiplierShop() {
  const { techParts, buyMultiplier } = useGameStore()

  return (
    <Box bg="gray.800" p={6} borderRadius="lg">
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Multiplier Shop</Text>
        <HStack spacing={4}>
          <Button
            onClick={() => buyMultiplier(30, 2)}
            isDisabled={techParts < 100}
            bg="gray.700"
            _hover={{ bg: 'gray.600' }}
          >
            Buy Points Multiplier (100 tech parts)
          </Button>
          <Button
            onClick={() => buyMultiplier(30, 2)}
            isDisabled={techParts < 100}
            bg="gray.700"
            _hover={{ bg: 'gray.600' }}
          >
            Buy Tech Parts Multiplier (100 tech parts)
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
} 