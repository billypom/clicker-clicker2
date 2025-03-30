import { Box, HStack, Text, Progress, Flex, Divider, Tooltip } from '@chakra-ui/react'
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
      py={2}
      borderBottom="1px"
      borderColor="gray.700"
      shadow="lg"
    >
      <Flex 
        justify="center" 
        align="center" 
        wrap="nowrap"
        maxW="1200px"
        mx="auto"
        px={4}
        gap={4}
      >
        {/* Points */}
        <Box textAlign="center" minW="120px">
          <Text fontSize="sm" fontWeight="bold">Points</Text>
          <Text fontSize="md" fontWeight="bold">{Math.floor(points)}</Text>
          <Text fontSize="xs" color="green.400">+{pointsPerSecond.toFixed(1)}/s</Text>
        </Box>

        <Divider orientation="vertical" h="40px" />

        {/* Click Power */}
        <Box textAlign="center" minW="120px">
          <Text fontSize="sm" fontWeight="bold">Click Power</Text>
          <Text fontSize="md">{actualClickPower}</Text>
          {activeMultipliers.length > 0 && (
            <Text fontSize="xs" color="yellow.400">{totalMultiplier}x Active</Text>
          )}
        </Box>

        <Divider orientation="vertical" h="40px" />

        {/* Level */}
        <Box textAlign="center" minW="80px">
          <Text fontSize="sm" fontWeight="bold">Level</Text>
          <Text fontSize="md">{playerLevel}</Text>
        </Box>

        {/* Progress to next level */}
        <Tooltip label={`${pointsPerSecond.toFixed(1)}/${nextLevelPPS} PPS`}>
          <Box flex="1" maxW="300px">
            <Flex justify="space-between" mb={1}>
              <Text fontSize="xs" color="gray.400">Level {playerLevel}</Text>
              <Text fontSize="xs" color="gray.400">Level {playerLevel + 1}</Text>
            </Flex>
            <Progress 
              value={progress} 
              colorScheme="green"
              size="sm"
              borderRadius="full"
              bg="gray.700"
            />
          </Box>
        </Tooltip>
      </Flex>
    </Box>
  )
} 