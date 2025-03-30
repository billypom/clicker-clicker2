import { 
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  IconButton,
  Tooltip
} from '@chakra-ui/react'
import React, { useRef } from 'react'
import { useGameStore } from '../store/gameStore'

export function ResetButton() {
  const { resetGame } = useGameStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleReset = () => {
    resetGame()
    onClose()
  }

  return (
    <>
      <Tooltip label="Reset Game">
        <IconButton
          aria-label="Reset Game"
          icon={<span>🔄</span>}
          onClick={onOpen}
          colorScheme="red"
          size="md"
          variant="ghost"
          borderRadius="full"
        />
      </Tooltip>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef as React.RefObject<any>}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800" color="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reset Game
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You will lose all progress and start from the beginning.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleReset} ml={3}>
                Reset
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
} 