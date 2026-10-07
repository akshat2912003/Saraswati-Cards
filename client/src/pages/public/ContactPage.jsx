import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { SHOP_CONFIG, buildWhatsAppUrl, buildGeneralWhatsAppMessage } from '../../config/shop'

const ContactPage = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = `Hello Saraswati Cards,
I am submitting an inquiry from your website contact form:

Name: ${name}
Phone: ${phone}
Message: ${message}`

    window.open(buildWhatsAppUrl(text), '_blank')
  }

  return (
    <>
      <Helmet>
        <title>Contact Us | Saraswati Cards Prayagraj</title>
        <meta name="description" content="Contact Saraswati Cards in Prayagraj. Call or WhatsApp us directly for custom wedding invitations, visiting cards and printing quotes." />
      </Helmet>

      <div className="py-6 sm:py-10 bg-[#FAF7F2] min-h-screen">
        <div className="container-page max-w-5xl">
          <Breadcrumb items={[{ label: 'Contact Us' }]} />

          <div className="my-6">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Get in Touch</h1>
            <p className="text-sm text-gray-500 mt-1">We would love to assist you with your wedding cards and printing needs.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
            
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 bg-gradient-to-br from-brand-800 to-brand-950 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-cream-100 mb-6">Contact Information</h2>

                <div className="space-y-6 text-sm">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-gold-400 text-lg flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-200">Shop Address</h4>
                      <p className="text-gray-300 text-xs sm:text-sm mt-0.5 leading-relaxed">{SHOP_CONFIG.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaPhone className="text-gold-400 text-lg flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-200">Phone Call</h4>
                      <a href={`tel:${SHOP_CONFIG.phone}`} className="text-gray-300 text-xs sm:text-sm hover:text-gold-300 transition-colors">
                        {SHOP_CONFIG.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaWhatsapp className="text-emerald-400 text-lg flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-200">WhatsApp</h4>
                      <a
                        href={buildWhatsAppUrl(buildGeneralWhatsAppMessage())}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-300 text-xs sm:text-sm hover:underline"
                      >
                        Click to chat on WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-gold-400 text-lg flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-200">Email</h4>
                      <a href={`mailto:${SHOP_CONFIG.email}`} className="text-gray-300 text-xs sm:text-sm hover:text-gold-300 transition-colors">
                        {SHOP_CONFIG.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-400">
                Shop Timing: 10:00 AM – 8:00 PM (Monday – Saturday)
              </div>
            </div>

            {/* Right: Quick Inquiry Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-gray-100">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Send an Inquiry</h2>
              <p className="text-xs text-gray-500 mb-6">Fill out this quick form to start a conversation on WhatsApp immediately.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Your Message or Requirement</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what card design or quantity you need..."
                    className="input"
                  ></textarea>
                </div>

                <button type="submit" className="btn-whatsapp w-full py-3.5 text-sm font-semibold shadow-md">
                  <FaWhatsapp className="text-xl" />
                  <span>Send Inquiry via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactPage
