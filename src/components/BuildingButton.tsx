import { 
  Box, 
  Button, 
  VStack,
  Text, 
  Badge,
  Tooltip
} from '@chakra-ui/react'
import { useGameStore } from '../store/gameStore'

interface BuildingButtonProps {
  title: string
  cost: number
  owned: number
  level: number
  onClick: () => void
  description: string
  production: {
    points?: number
    techParts?: number
  }
  buildingType: string
  levelRequirement: number
}

export function BuildingButton({
  title,
  cost,
  owned,
  level,
  onClick,
  description,
  production,
  buildingType,
  levelRequirement
}: BuildingButtonProps) {
  const { points, playerLevel } = useGameStore()
  const canAfford = points >= cost
  const meetsLevelRequirement = playerLevel >= levelRequirement
  const isDisabled = !canAfford || !meetsLevelRequirement

  const buttonContent = (
    <VStack align="stretch" spacing={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold">{title}</Text>
        <Badge colorScheme={level > 1 ? 'green' : 'gray'}>Level {level}</Badge>
      </Box>
      <Text fontSize="sm" color="gray.400">{description}</Text>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text>Owned: {owned}</Text>
        <Text>Cost: {cost} points</Text>
      </Box>
      <Box>
        <Text fontSize="sm">Production:</Text>
        {production.points && (
          <Text fontSize="sm">Points: {production.points}/s</Text>
        )}
        {production.techParts && (
          <Text fontSize="sm">Tech Parts: {production.techParts}/s</Text>
        )}
      </Box>
    </VStack>
  )

  return (
    <Tooltip
      label={
        !meetsLevelRequirement
          ? `Requires level ${levelRequirement}`
          : !canAfford
          ? 'Not enough points'
          : ''
      }
      isDisabled={!isDisabled}
    >
      <Button
        onClick={onClick}
        disabled={isDisabled}
        bg="gray.700"
        _hover={{ bg: 'gray.600' }}
        _disabled={{ bg: 'gray.800' }}
        p={4}
        height="auto"
        whiteSpace="normal"
        textAlign="left"
      >
        {buttonContent}
      </Button>
    </Tooltip>
  )
} 