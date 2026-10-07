import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FaWhatsapp, FaCloudUploadAlt, FaCheck } from 'react-icons/fa'
import { HiSparkles, HiPencil, HiAdjustments, HiUserGroup, HiGift } from 'react-icons/hi'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { buildWhatsAppUrl, SHOP_CONFIG } from '../../config/shop'

const MAX_REFERENCE_SIZE = 10 * 1024 * 1024

const designBenefits = [
  { icon: HiPencil, title: 'Made for your idea' },
  { icon: HiAdjustments, title: 'Personalized details' },
  { icon: HiUserGroup, title: 'Every occasion' },
  { icon: HiSparkles, title: 'Carefully crafted' },
]

const CustomDesignPage = () => {
  const [referenceFile, setReferenceFile] = useState(null)
  const [fileError, setFileError] = useState('')

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    setFileError('')

    if (file && !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setReferenceFile(null)
      setFileError('Please choose a JPG, PNG, or PDF file.')
      event.target.value = ''
      return
    }

    if (file && file.size > MAX_REFERENCE_SIZE) {
      setReferenceFile(null)
      setFileError('Please choose a file smaller than 10 MB.')
      event.target.value = ''
      return
    }

    setReferenceFile(file || null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')
    const phone = formData.get('phone')
    const occasion = formData.get('occasion')
    const quantity = formData.get('quantity') || 'Not specified'
    const size = formData.get('size') || 'No preference'
    const paper = formData.get('paper') || 'No preference'
    const details = formData.get('details')

    const message = `Hello ${SHOP_CONFIG.name}, I would like to request a custom design.

Name: ${name}
WhatsApp number: ${phone}
Occasion / card type: ${occasion}
Approximate quantity: ${quantity}
Size preference: ${size}
Paper preference: ${paper}
Design details: ${details}
${referenceFile ? `Reference file: ${referenceFile.name}\n` : ''}${referenceFile ? 'I will attach my reference file in this chat.' : 'I do not have a reference file to attach.'}

Please share design options and pricing. Thank you!`

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <Helmet>
        <title>Custom Card Design | Saraswati Cards</title>
        <meta
          name="description"
          content="Share your idea for a personalized invitation or card design. Tell Saraswati Cards your requirements and continue the conversation on WhatsApp."
        />
      </Helmet>

      <div className="min-h-screen bg-[#FAF7F2] pb-12">
        <div className="container-page max-w-5xl px-4 py-5 sm:py-8">
          <Breadcrumb items={[{ label: 'Custom Design' }]} />

          <section className="relative isolate mt-5 overflow-hidden rounded-3xl bg-[#3F0F16] text-white shadow-lg">
            <div
              className="absolute inset-0 -z-20 bg-cover bg-center opacity-35"
              style={{ backgroundImage: "url('/images/Hero_section.jpeg')" }}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#2A080E]/95 via-[#3F0F16]/85 to-[#3F0F16]/40" />

            <div className="max-w-2xl px-5 py-10 sm:px-10 sm:py-14">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D49E43]/50 bg-black/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#F2C875]">
                <HiSparkles className="text-base" />
                Designed around you
              </div>
              <h1 className="font-serif text-3xl font-bold leading-tight sm:text-5xl">
                Your idea, <span className="text-[#E7B85F]">beautifully made.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                Tell us about the occasion, the look you love, and the little details that matter.
                We’ll help bring your custom card design to life.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                {designBenefits.map(({ icon: Icon, title }) => (
                  <div key={title} className="flex items-center gap-2 text-xs font-medium text-white/90">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D49E43]/20 text-[#F2C875]">
                      <Icon className="text-lg" />
                    </span>
                    {title}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-[#5C1622]/10 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <HiGift className="text-xl text-[#D49E43]" />
                <h2 className="font-serif text-2xl font-bold text-[#5C1622] sm:text-3xl">
                  Share your requirements
                </h2>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
                Fill in a few details and we’ll continue with you on WhatsApp to discuss design
                options and pricing.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="custom-name" className="mb-1.5 block text-sm font-semibold text-gray-800">
                    Your name <span className="text-red-600">*</span>
                  </label>
                  <input id="custom-name" name="name" type="text" autoComplete="name" required maxLength={100} placeholder="Enter your name" className="input" />
                </div>

                <div>
                  <label htmlFor="custom-phone" className="mb-1.5 block text-sm font-semibold text-gray-800">
                    WhatsApp number <span className="text-red-600">*</span>
                  </label>
                  <input id="custom-phone" name="phone" type="tel" autoComplete="tel" required maxLength={20} placeholder="Enter your WhatsApp number" className="input" />
                </div>

                <div>
                  <label htmlFor="custom-occasion" className="mb-1.5 block text-sm font-semibold text-gray-800">
                    Occasion / card type <span className="text-red-600">*</span>
                  </label>
                  <select id="custom-occasion" name="occasion" required defaultValue="" className="input">
                    <option value="" disabled>Select an occasion</option>
                    <option>Wedding invitation</option>
                    <option>Digital wedding invitation</option>
                    <option>Video wedding invitation</option>
                    <option>Birthday invitation</option>
                    <option>Welcome board</option>
                    <option>Gift envelope</option>
                    <option>Visiting card</option>
                    <option>Other occasion</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="custom-quantity" className="mb-1.5 block text-sm font-semibold text-gray-800">
                    Approximate quantity
                  </label>
                  <input id="custom-quantity" name="quantity" type="number" min="1" placeholder="e.g. 200" className="input" />
                </div>

                <div>
                  <label htmlFor="custom-size" className="mb-1.5 block text-sm font-semibold text-gray-800">
                    Size preference <span className="font-normal text-gray-500">(optional)</span>
                  </label>
                  <input id="custom-size" name="size" type="text" maxLength={80} placeholder="e.g. A5, square, custom size" className="input" />
                </div>

                <div>
                  <label htmlFor="custom-paper" className="mb-1.5 block text-sm font-semibold text-gray-800">
                    Paper / finish <span className="font-normal text-gray-500">(optional)</span>
                  </label>
                  <input id="custom-paper" name="paper" type="text" maxLength={100} placeholder="e.g. matte, glossy, textured" className="input" />
                </div>
              </div>

              <div>
                <label htmlFor="custom-details" className="mb-1.5 block text-sm font-semibold text-gray-800">
                  Design details <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="custom-details"
                  name="details"
                  rows={5}
                  required
                  maxLength={1000}
                  placeholder="Describe your theme, wording, colors, names, or anything else you have in mind..."
                  className="input resize-y"
                />
                <p className="mt-1 text-right text-xs text-gray-400">Up to 1,000 characters</p>
              </div>

              <div>
                <label htmlFor="custom-reference" className="mb-1.5 block text-sm font-semibold text-gray-800">
                  Reference image or file <span className="font-normal text-gray-500">(optional)</span>
                </label>
                <label
                  htmlFor="custom-reference"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#5C1622]/20 bg-[#FAF7F2] px-4 py-6 text-center transition-colors hover:border-[#D49E43] hover:bg-[#D49E43]/5"
                >
                  <FaCloudUploadAlt className="mb-2 text-3xl text-[#5C1622]" />
                  <span className="text-sm font-semibold text-[#5C1622]">
                    {referenceFile ? referenceFile.name : 'Choose a reference file'}
                  </span>
                  <span className="mt-1 text-xs text-gray-500">JPG, PNG, or PDF · up to 10 MB</span>
                  <input
                    id="custom-reference"
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                {fileError && <p role="alert" className="mt-2 text-sm text-red-600">{fileError}</p>}
                {referenceFile && (
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">
                    We can’t attach files to WhatsApp automatically. After WhatsApp opens, attach this file in the chat.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#159B55] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#118448] focus:outline-none focus:ring-2 focus:ring-[#159B55] focus:ring-offset-2"
              >
                <FaWhatsapp className="text-xl" />
                Send requirements on WhatsApp
                <FaCheck className="ml-1 text-sm" />
              </button>
              <p className="text-center text-xs leading-relaxed text-gray-500">
                Your details will be included in a WhatsApp message to Saraswati Cards. No payment is taken here.
              </p>
            </form>
          </section>
        </div>
      </div>
    </>
  )
}

export default CustomDesignPage
