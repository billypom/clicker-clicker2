import { motion, AnimatePresence } from 'framer-motion'

interface BuildingInfoProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  production: {
    points?: number
    techParts?: number
  }
}

export const BuildingInfo = ({ isOpen, onClose, title, description, production }: BuildingInfoProps) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <p className="text-gray-300 mb-4">{description}</p>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Production:</h4>
            {production.points && (
              <div className="text-green-400">+{production.points} points/s</div>
            )}
            {production.techParts && (
              <div className="text-blue-400">+{production.techParts} tech parts/s</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 