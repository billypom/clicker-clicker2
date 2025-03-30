import { 
  Box, 
  VStack,
  Text, 
  Badge,
  Tooltip
} from '@chakra-ui/react'
import { useGameStore } from '../store/gameStore'
import { BUILDING_INFO } from '../store/gameStore'

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

  const [id, info] = nextBuilding as [string, BuildingInfo]

  return (
    <Tooltip label={`Requires level ${info.levelRequirement}`}>
      <Box
        bg="gray.800"
        p={4}
        borderRadius="lg"
        border="1px"
        borderColor="gray.700"
        opacity={0.7}
        cursor="not-allowed"
      >
        <VStack align="stretch" spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold">{info.title}</Text>
            <Badge colorScheme="red">Locked</Badge>
          </Box>
          <Text fontSize="sm" color="gray.400">{info.description}</Text>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text>Cost: {info.cost} points</Text>
            <Text>Level Required: {info.levelRequirement}</Text>
          </Box>
          <Box>
            <Text fontSize="sm">Production:</Text>
            {info.production.points && (
              <Text fontSize="sm">Points: {info.production.points}/s</Text>
            )}
            {info.production.techParts && (
              <Text fontSize="sm">Tech Parts: {info.production.techParts}/s</Text>
            )}
          </Box>
        </VStack>
      </Box>
    </Tooltip>
  )
} 