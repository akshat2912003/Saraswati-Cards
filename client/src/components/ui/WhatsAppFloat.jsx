import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { buildWhatsAppUrl, buildGeneralWhatsAppMessage } from '../../config/shop'

const WhatsAppFloat = () => {
  const whatsappUrl = buildWhatsAppUrl(buildGeneralWhatsAppMessage())

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float shadow-xl flex items-center justify-center gap-2"
      aria-label="Chat with Saraswati Cards on WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
      <span className="whatsapp-label font-medium text-sm">Order on WhatsApp</span>
    </a>
  )
}

export default WhatsAppFloat
