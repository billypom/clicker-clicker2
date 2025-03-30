import { IconButton, Tooltip, useBoolean } from '@chakra-ui/react'
import { toggleSound, isSoundEnabled, initAudio } from '../utils/soundUtils'
import { useEffect, useState } from 'react'

export function SoundToggleButton() {
  // Initialize the state with the current sound enabled state
  const [soundOn, setSoundOn] = useState(isSoundEnabled())
  
  const handleToggle = () => {
    // Initialize audio when toggling (helps with browser autoplay policies)
    initAudio();
    const newState = toggleSound()
    setSoundOn(newState)
  }
  
  return (
    <Tooltip label={soundOn ? 'Mute sounds' : 'Enable sounds'}>
      <IconButton
        aria-label="Toggle sound"
        icon={<span>{soundOn ? '🔊' : '🔇'}</span>}
        onClick={handleToggle}
        variant="ghost"
        colorScheme="cyan"
        size="md"
      />
    </Tooltip>
  )
} 