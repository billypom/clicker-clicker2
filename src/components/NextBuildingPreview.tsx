import { 
  Box, 
  VStack,
  Text, 
  Badge,
  Tooltip
} from '@chakra-ui/react'
import { useGameStore } from '../store/gameStore'
import { BUILDING_INFO } from '../store/gameStore'
import { formatNumber } from '../utils/numberUtils'

interface BuildingInfo {
  cost: number
  levelRequirement: number
  title: string
  description: string
  production: {
    points?: number
    techParts?: number
  }
}

export function NextBuildingPreview() {
  const { playerLevel } = useGameStore()
  
  // Find the next building that's not yet available
  const nextBuilding = Object.entries(BUILDING_INFO)
    .find(([_, info]) => info.levelRequirement > playerLevel)

  if (!nextBuilding) return null

  const [id, info] = nextBuilding

  return (
    <Tooltip label={`Requires level ${info.levelRequirement}`}>
      <Box
        bg="background.card"
        p={4}
        borderRadius="lg"
        border="1px"
        borderColor="brand.800"
        opacity={0.7}
        cursor="not-allowed"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.14)"
      >
        <VStack align="stretch" spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold" color="brand.200">{info.title}</Text>
            <Badge colorScheme="brand" bg="brand.400" color="text.dark">Locked</Badge>
          </Box>
          <Text fontSize="sm" color="text.muted">{info.description}</Text>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text color="text.secondary">Cost: {formatNumber(info.cost)} points</Text>
            <Text color="brand.300">Level Required: {info.levelRequirement}</Text>
          </Box>
          <Box p={2} bg="background.secondary" borderRadius="md">
            <Text fontSize="sm" color="brand.300">Production:</Text>
            <Text fontSize="sm" color="text.secondary">Points: {formatNumber(info.production.points || 0)}/s</Text>
          </Box>
        </VStack>
      </Box>
    </Tooltip>
  )
} 