import { Box, Heading, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react'

interface BuildingInfoProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  production: {
    points?: number
  }
}

export const BuildingInfo = ({ isOpen, onClose, title, description, production }: BuildingInfoProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent bg="background.secondary" maxW="md" mx={4}>
        <ModalHeader color="text.secondary">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text color="text.primary" mb={4}>{description}</Text>
          
          <Box p={4} bg="background.card" borderRadius="md">
            <Heading as="h4" size="sm" mb={2} color="brand.300">Production:</Heading>
            {production.points && (
              <Text color="text.accent">+{production.points} points/s</Text>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
} 