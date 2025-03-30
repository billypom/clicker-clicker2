import { Box, HStack, Text, Progress, Flex, Divider, Tooltip, Image, Button, Icon } from '@chakra-ui/react'
import { useGameStore } from '../store/gameStore'
import logoImg from '../assets/logo.png'
import { ResetButton } from './ResetButton'
import { SoundToggleButton } from './SoundToggleButton'
import { AddIcon } from '@chakra-ui/icons'
import { formatNumber } from '../utils/numberUtils'

export function ResourceDisplay() {
  const { points, pointsPerSecond, clickPower, playerLevel, getClickPowerUpgradeCost, buyUpgrade } = useGameStore()

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

  const clickPowerUpgradeCost = getClickPowerUpgradeCost();
  const canAffordUpgrade = points >= clickPowerUpgradeCost;

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
        maxW="1200px"
        mx="auto"
        px={4}
        position="relative"
      >
        {/* Logo */}
        <Box 
          position="absolute" 
          left={4} 
          top="50%" 
          transform="translateY(-50%)"
          h="40px"
          w="auto"
        >
          <Image 
            src={logoImg} 
            alt="Clicker Clicker 2" 
            h="100%" 
            w="auto"
            objectFit="contain"
          />
        </Box>

        {/* Control buttons */}
        <Flex 
          position="absolute" 
          right={4} 
          top="50%" 
          transform="translateY(-50%)"
          zIndex={1}
          gap={2}
          align="center"
        >
          <SoundToggleButton />
          <ResetButton />
        </Flex>

        {/* Main content - centered */}
        <Flex 
          justify="center" 
          align="center" 
          wrap="nowrap"
          gap={4}
          w="full"
        >
          {/* Points */}
          <Box textAlign="center" minW="120px">
            <Text fontSize="sm" fontWeight="bold">Points</Text>
            <Text fontSize="md" fontWeight="bold">{formatNumber(Math.floor(points))}</Text>
            <Text fontSize="xs" color="green.400">+{formatNumber(pointsPerSecond)}/s</Text>
          </Box>

          <Divider orientation="vertical" h="40px" />

          {/* Click Power with Upgrade Button */}
          <Box textAlign="center" minW="120px">
            <Text fontSize="sm" fontWeight="bold">Click Power</Text>
            <Flex justify="center" align="center" gap={1}>
              <Text fontSize="md">{formatNumber(clickPower)}</Text>
              <Tooltip label={`Upgrade to level ${clickPower + 1} (${formatNumber(clickPowerUpgradeCost)} points)`}>
                <Button
                  size="xs"
                  colorScheme="green"
                  variant="outline"
                  p={1}
                  height="20px"
                  minW="20px"
                  onClick={() => buyUpgrade('clickPower')}
                  opacity={canAffordUpgrade ? 1 : 0.4}
                  cursor={canAffordUpgrade ? 'pointer' : 'not-allowed'}
                  _hover={{ bg: 'green.800', opacity: canAffordUpgrade ? 1 : 0.4 }}
                >
                  <AddIcon boxSize={2} />
                </Button>
              </Tooltip>
            </Flex>
          </Box>

          <Divider orientation="vertical" h="40px" />

          {/* Level */}
          <Box textAlign="center" minW="80px">
            <Text fontSize="sm" fontWeight="bold">Level</Text>
            <Text fontSize="md">{playerLevel}</Text>
          </Box>

          {/* Progress to next level */}
          <Tooltip label={`${formatNumber(pointsPerSecond)}/${formatNumber(nextLevelPPS)} PPS`}>
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
      </Flex>
    </Box>
  )
} 