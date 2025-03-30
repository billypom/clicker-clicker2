import { Box, HStack, Text, Progress, VStack } from '@chakra-ui/react'
import { useGameStore } from '../store/gameStore'

export function ResourceDisplay() {
  const { points, pointsPerSecond, clickPower, getTotalMultiplier, activeMultipliers, playerLevel } = useGameStore()

  const totalMultiplier = getTotalMultiplier()
  const actualClickPower = clickPower * totalMultiplier

  // Calculate progress to next level
  const currentLevelPPS = Math.pow(10, playerLevel - 1)
  const nextLevelPPS = Math.pow(10, playerLevel)
  
  // Handle progress calculation properly
  let progress = 0;
  if (playerLevel === 1) {
    // For level 1, show progress from 0 to 10 PPS
    progress = Math.min(Math.max((pointsPerSecond / nextLevelPPS) * 100, 0), 100);
  } else {
    // For levels > 1, show progress from currentLevelPPS to nextLevelPPS
    progress = Math.min(Math.max(((pointsPerSecond - currentLevelPPS) / (nextLevelPPS - currentLevelPPS)) * 100, 0), 100);
  }

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
      <VStack spacing={2}>
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
        </HStack>
        <Box w="full" maxW="600px" px={4}>
          <HStack justify="space-between" mb={1}>
            <Text fontSize="sm" color="gray.400">Level {playerLevel}</Text>
            <Text fontSize="sm" color="gray.400">Level {playerLevel + 1}</Text>
          </HStack>
          <Progress 
            value={progress} 
            colorScheme="green"
            size="sm"
            borderRadius="full"
            bg="gray.700"
          />
          <Text fontSize="xs" color="gray.500" mt={1} textAlign="center">
            {pointsPerSecond.toFixed(1)}/{nextLevelPPS} PPS
          </Text>
        </Box>
      </VStack>
    </Box>
  )
} 