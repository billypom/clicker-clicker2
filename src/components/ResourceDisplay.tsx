import { Box, HStack, Text } from '@chakra-ui/react'
import { useGameStore } from '../store/gameStore'

export function ResourceDisplay() {
  const { points, techParts, pointsPerSecond, techPartsPerSecond, clickPower, getTotalMultiplier, activeMultipliers } = useGameStore()

  const totalMultiplier = getTotalMultiplier()
  const actualClickPower = clickPower * totalMultiplier

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
      bg="gray.900"
      py={4}
      borderBottom="1px"
      borderColor="gray.700"
      shadow="lg"
    >
      <HStack spacing={8} justify="center">
        <Box textAlign="center">
          <Text fontSize="xl" fontWeight="bold">Points</Text>
          <Text fontSize="2xl">{Math.floor(points)}</Text>
          <Text fontSize="sm" color="green.400">+{pointsPerSecond}/s</Text>
          <Text fontSize="sm" color="green.400">Click Power: {actualClickPower}</Text>
          {activeMultipliers.length > 0 && (
            <Text fontSize="sm" color="yellow.400">{totalMultiplier}x Active</Text>
          )}
        </Box>
        <Box textAlign="center">
          <Text fontSize="xl" fontWeight="bold">Tech Parts</Text>
          <Text fontSize="2xl">{Math.floor(techParts)}</Text>
          <Text fontSize="sm" color="blue.400">+{techPartsPerSecond}/s</Text>
        </Box>
      </HStack>
    </Box>
  )
} 