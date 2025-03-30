import { Box, Image } from '@chakra-ui/react'
import { useGameStore } from '../store/gameStore'

export function Mouse() {
  const { click } = useGameStore()

  return (
    <Box
      as="button"
      onClick={click}
      bg="gray.800"
      _hover={{ bg: 'gray.700' }}
      p={4}
      borderRadius="lg"
      cursor="pointer"
      transition="all 0.2s"
      _active={{ transform: 'scale(0.95)' }}
    >
      <Image
        src="/mouse.png"
        alt="Click me!"
        width="100px"
        height="100px"
        objectFit="contain"
      />
    </Box>
  )
} 