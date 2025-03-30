import { Box, HStack, Text } from '@chakra-ui/react'
import { useGameStore } from '../store/gameStore'

export function ResourceDisplay() {
  const { points, techParts, pointsPerSecond, techPartsPerSecond } = useGameStore()

  return (
    <HStack spacing={8} justify="center">
      <Box textAlign="center">
        <Text fontSize="xl" fontWeight="bold">Points</Text>
        <Text fontSize="2xl">{Math.floor(points)}</Text>
        <Text fontSize="sm" color="green.400">+{pointsPerSecond}/s</Text>
      </Box>
      <Box textAlign="center">
        <Text fontSize="xl" fontWeight="bold">Tech Parts</Text>
        <Text fontSize="2xl">{Math.floor(techParts)}</Text>
        <Text fontSize="sm" color="blue.400">+{techPartsPerSecond}/s</Text>
      </Box>
    </HStack>
  )
} 