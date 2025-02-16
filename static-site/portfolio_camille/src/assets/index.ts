// Icons
import ArrowIcon from './icons/arrow.svg'
import MenuIcon from './icons/menu.svg'
import CloseIcon from './icons/close.svg'
import LinkedInIcon from './icons/linkedin.svg'
import EmailIcon from './icons/email.svg'

export const icons = {
  arrow: ArrowIcon,
  menu: MenuIcon,
  close: CloseIcon,
  linkedin: LinkedInIcon,
  email: EmailIcon
}

// Add any other asset exports here
export const getImageUrl = (path: string): string => {
  // Remove the 'projects/' prefix if it exists
  const cleanPath = path.replace('projects/', '')
  return new URL(`/images/${cleanPath}`, import.meta.url).href
} 