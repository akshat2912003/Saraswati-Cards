import React from 'react'
import { Helmet } from 'react-helmet-async'
import { FaStore, FaStar, FaShieldAlt } from 'react-icons/fa'
import Breadcrumb from '../../components/ui/Breadcrumb'

const faqs = [
  {
    question: 'Can I customize a card design?',
    answer: 'Yes. You can customize the card with your name, date, photos, colors, text, and other details. You can also use our Custom Design option to share your requirements.',
  },
  {
    question: 'What is the payment process for an order?',
    answer: 'For customized or bulk orders, 65% advance payment is required to confirm the order. After the design is finalized and approved, we will proceed with printing. Once your cards are printed and packed, the remaining 35% payment must be completed before dispatch. After receiving the remaining payment, we will dispatch your order.',
  },
  {
    question: 'Can I see proof that my cards are printed and packed before making the remaining payment?',
    answer: 'Yes. If you would like confirmation before paying the remaining 35%, we can share a video of your printed cards and packed order with you on WhatsApp. This allows you to check the order before the final payment and dispatch.',
  },
  {
    question: 'What if a few cards are missing from my order?',
    answer: 'We take proper care while counting and packing your order. However, we cannot guarantee that there will never be a shortage of 3–4 cards due to counting or packing variations. We recommend checking the quantity carefully after receiving the order.',
  },
  {
    question: 'Can I return the cards or get a refund after receiving the order?',
    answer: 'No. There is NO RETURN and NO REFUND policy after the order has been printed or delivered. Since these are customized/printed products, we will share the design and other details with you for confirmation before printing. Once you approve the design and printing starts, the order cannot be cancelled, returned, or refunded.',
  },
  {
    question: 'Can I send my own design?',
    answer: 'Yes. You can send your own design, reference image, or PDF through WhatsApp. We can use it according to your requirements.',
  },
  {
    question: 'How can I place an order?',
    answer: 'Simply click Order on WhatsApp on the product page and send us your requirements. Our team will confirm the details, quantity, pricing, and payment process with you.',
  },
  {
    question: 'Can I order a small quantity?',
    answer: 'Yes, depending on the product. The minimum order quantity may vary for different designs and products. You can contact us on WhatsApp to confirm.',
  },
  {
    question: 'Can I change names, dates, photos, or other details?',
    answer: 'Yes. Most of our designs can be customized according to your requirements. The final details will be confirmed before printing.',
  },
  {
    question: 'Will I see the design before printing?',
    answer: 'Yes. For customized orders, we will share the design/details with you for confirmation before proceeding with printing.',
  },
  {
    question: 'How long does an order take?',
    answer: 'The time depends on the product, quantity, customization, and current workload. We will provide you with an estimated timeline when your order is confirmed.',
  },
  {
    question: 'Do you provide delivery outside Prayagraj?',
    answer: 'Yes, delivery availability and charges depend on your location, order size, and delivery method. Please contact us on WhatsApp for delivery details.',
  },
  {
    question: 'Do you provide digital and video wedding invitations?',
    answer: 'Yes. We provide Digital Wedding Cards and Video Wedding Invitations that can be easily shared through WhatsApp and other platforms.',
  },
  {
    question: 'Can I order wedding cards in bulk?',
    answer: 'Yes. We accept bulk orders for wedding cards and other printed products. Contact us on WhatsApp for quantity-based pricing.',
  },
  {
    question: "What if I don't find the design I want on the website?",
    answer: 'No problem. You can send us your reference design or requirements through our Custom Design option or WhatsApp, and we can discuss the available customization options.',
  },
  {
    question: 'How can I contact Saraswati Cards?',
    answer: 'You can contact us directly through WhatsApp for product enquiries, customization, pricing, order confirmation, and delivery-related questions.',
  },
  {
    question: 'Are the prices shown on the website final?',
    answer: 'Prices may vary depending on quantity, customization, paper type, printing, finishing, and other requirements. Please confirm the final price with us on WhatsApp before placing your order.',
  },
  {
    question: 'Who is responsible for checking the final design before printing?',
    answer: 'Before printing, we will share the final design with you for approval. Please carefully check names, dates, phone numbers, spelling, photos, addresses, and other details before giving approval. Once the design is approved and printing begins, changes may not be possible.',
  },
  {
    question: 'Can I cancel my order after approving the design?',
    answer: 'Orders can only be cancelled before printing begins, subject to the order status. Once printing has started, the order cannot be cancelled because the product is customized specifically for you.',
  },
  {
    question: 'Will the printed colors look exactly the same as they appear on my phone or computer?',
    answer: 'There may be slight differences in color between the design shown on a screen and the final printed product because screens and printing processes display colors differently. We try our best to maintain the approved design and color appearance.',
  },
  {
    question: 'What if my order is damaged during delivery?',
    answer: 'Please check the package when you receive it. If you notice any visible damage, take photos/videos of the package and products and contact us as soon as possible so we can review the issue and guide you accordingly.',
  },
  {
    question: 'Can I change my delivery address after placing the order?',
    answer: 'Please provide the correct delivery address before dispatch. If you need to change the address after placing the order, contact us as soon as possible. Changes may not be possible once the order has been dispatched.',
  },
  {
    question: 'How will I know when my order is dispatched?',
    answer: 'Once your remaining payment is received and the order is ready for dispatch, we will share the dispatch/courier details with you on WhatsApp whenever available.',
  },
  {
    question: 'What happens if I am not available when the courier arrives?',
    answer: 'The courier may attempt delivery again according to their delivery process. Please make sure that someone is available to receive the order at the provided address.',
  },
  {
    question: 'Can I request changes to a digital or video invitation?',
    answer: 'Yes. You can discuss your required changes with us before final approval. The number of revisions and any additional charges, if applicable, will be confirmed before proceeding.',
  },
  {
    question: 'Do you provide a physical sample before a bulk order?',
    answer: 'Sample availability depends on the product and order requirements. Please contact us on WhatsApp to discuss sample options and applicable charges.',
  },
  {
    question: 'What happens if I provide incorrect information for my order?',
    answer: 'We will use the information and details approved by you for printing. Please carefully verify all content before giving final approval, as mistakes in customer-provided or customer-approved information may not be eligible for reprinting, return, or refund.',
  },
  {
    question: 'How should I contact you for an order-related issue?',
    answer: 'For faster assistance, please contact us through WhatsApp with your order details, name, and relevant photos/videos if required. Our team will check the issue and guide you accordingly.',
  },
  {
    question: 'Will the color of the card be exactly the same as shown on the website?',
    answer: 'The color of the card shown in the product images may slightly vary from the actual product. This can happen because the product photographs are taken with a camera and the color may also appear different depending on your phone or computer screen, lighting, and display settings. We always try our best to represent the actual product accurately, and you will receive the best-quality product as shown in the approved design.',
  },
]

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Saraswati Cards Prayagraj</title>
        <meta name="description" content="Learn about Saraswati Cards, Prayagraj's premier invitation card shop for weddings, digital invites, birthday cards and commercial printing." />
      </Helmet>

      <div className="py-6 sm:py-10 bg-[#FAF7F2] min-h-screen">
        <div className="container-page max-w-4xl">
          <Breadcrumb items={[{ label: 'About Us' }]} />

          {/* Banner */}
          <div className="bg-gradient-to-r from-brand-800 to-brand-950 text-white rounded-2xl p-8 sm:p-12 my-6 text-center shadow-md">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-cream-100 mb-3">
              About Saraswati Cards
            </h1>
            <p className="text-sm sm:text-base text-gray-200 font-light max-w-xl mx-auto">
              A trusted 30-year-old shop in Prayagraj, crafting cards for every occasion with elegance and care.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-card space-y-8 border border-gray-100 text-gray-700 leading-relaxed text-sm sm:text-base">
            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FaStore className="text-brand-700" /> Welcome to Our Shop
              </h2>
              <p>
                <strong>Saraswati Cards</strong> is a premier invitation card design studio and printing firm based in
                Prayagraj, Uttar Pradesh, with 30 years of experience serving the community. We specialize in traditional wedding cards,
                modern laser-cut cards, digital animated invitations, visiting cards and welcome boards.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FaStar className="text-brand-700" /> Our Mission
              </h2>
              <p>
                Every celebration is unique, and your invitation is the first impression your guests receive. 
                Our mission is to combine traditional Indian warmth with modern aesthetic designs to create 
                unforgettable wedding and event invitations that fit every budget.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FaShieldAlt className="text-brand-700" /> Why Order via WhatsApp?
              </h2>
              <p>
                We believe in personalized customer service. Instead of complex online checkouts with rigid forms, 
                ordering on WhatsApp allows us to interact directly with you, understand your exact text printing requirements, 
                share sample proofs for approval, and answer all your questions in real-time.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-2">
                FAQs — Frequently Asked Questions
              </h2>
              <p className="text-sm text-gray-600 mb-5">
                Find answers to common questions about our designs, orders, payments, and delivery.
              </p>
              <div className="space-y-3">
                {faqs.map(({ question, answer }, index) => (
                  <details
                    key={question}
                    className="group rounded-xl border border-gray-200 bg-[#FAF7F2]/60"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-4 font-semibold text-gray-900 marker:content-none">
                      <span>
                        <span className="text-brand-700">{index + 1}. </span>
                        {question}
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-brand-700 transition-transform group-open:rotate-180"
                      >
                        ↓
                      </span>
                    </summary>
                    <p className="px-4 pb-4 text-sm leading-relaxed text-gray-700">
                      {answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutPage
