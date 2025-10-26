'use client'

import { useState } from 'react'
import { Check, X, Zap, Crown, Gift } from 'lucide-react'

interface SubscriptionTier {
  id: string
  name: string
  icon: React.ReactNode
  price: number
  period: string
  description: string
  features: { feature: string; included: boolean }[]
  popular?: boolean
  color: string
}

const tiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Starter',
    icon: <Gift size={24} />,
    price: 0,
    period: 'Free',
    description: 'Perfect for casual readers',
    color: 'from-blue-500 to-cyan-500',
    features: [
      { feature: 'Basic book search', included: true },
      { feature: 'Reading history', included: true },
      { feature: 'Basic recommendations', included: true },
      { feature: 'Community access', included: true },
      { feature: 'Ad-supported', included: true },
      { feature: 'Advanced search', included: false },
      { feature: 'AI features', included: false },
      { feature: 'Offline reading', included: false },
      { feature: 'Priority support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: <Zap size={24} />,
    price: 9.99,
    period: 'month',
    description: 'For serious book lovers',
    popular: true,
    color: 'from-purple-500 to-pink-500',
    features: [
      { feature: 'Advanced book search', included: true },
      { feature: 'Unlimited reading history', included: true },
      { feature: 'ML-powered recommendations', included: true },
      { feature: 'Full community access', included: true },
      { feature: 'Ad-free experience', included: true },
      { feature: 'AI features (summaries, Q&A)', included: true },
      { feature: 'Reading goals & tracking', included: true },
      { feature: 'Offline reading (100 books)', included: true },
      { feature: 'Email support', included: true },
      { feature: 'Priority support', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: <Crown size={24} />,
    price: 19.99,
    period: 'month',
    description: 'Ultimate reading experience',
    color: 'from-yellow-500 to-orange-500',
    features: [
      { feature: 'Everything in Pro', included: true },
      { feature: 'AI reading companion', included: true },
      { feature: 'Advanced analytics & insights', included: true },
      { feature: 'Unlimited offline reading', included: true },
      { feature: '1-on-1 book recommendations', included: true },
      { feature: 'API access for developers', included: true },
      { feature: 'Custom reading preferences', included: true },
      { feature: 'Early access to new features', included: true },
      { feature: '24/7 priority support', included: true },
      { feature: 'Exclusive member community', included: true },
    ],
  },
]

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const getDiscountedPrice = (basePrice: number) => {
    return billingCycle === 'annual' ? (basePrice * 12 * 0.8).toFixed(2) : basePrice.toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Unlock unlimited access to premium reading features
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-medium transition relative ${
                billingCycle === 'annual'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
              }`}
            >
              Annual
              <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map(tier => (
            <div
              key={tier.id}
              className={`relative rounded-2xl overflow-hidden transition transform hover:scale-105 ${
                tier.popular ? 'ring-2 ring-purple-600 md:scale-105 shadow-2xl' : 'shadow-lg'
              }`}
            >
              <div className={`bg-gradient-to-br ${tier.color} p-1`}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8">
                  {tier.popular && (
                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`bg-gradient-to-br ${tier.color} p-2 rounded-lg text-white`}>
                      {tier.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mb-6">{tier.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-5xl font-bold text-slate-900 dark:text-white">
                        ${getDiscountedPrice(tier.price)}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {tier.period === 'Free' ? '' : `/${billingCycle === 'annual' ? 'year' : 'month'}`}
                      </span>
                    </div>
                    {billingCycle === 'annual' && tier.price > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Only ${(parseFloat(getDiscountedPrice(tier.price)) / 12).toFixed(2)}/month
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedTier(tier.id)}
                    className={`w-full py-3 rounded-lg font-bold transition mb-6 ${
                      tier.popular || tier.id === 'pro'
                        ? 'bg-gradient-to-r ' + tier.color + ' text-white hover:shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tier.id === 'free' ? 'Current Plan' : 'Choose Plan'}
                  </button>

                  <div className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="text-green-500 flex-shrink-0" size={20} />
                        ) : (
                          <X className="text-slate-300 dark:text-slate-600 flex-shrink-0" size={20} />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included
                              ? 'text-slate-700 dark:text-slate-300'
                              : 'text-slate-400 dark:text-slate-500 line-through'
                          }`}
                        >
                          {feature.feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes! You can change your plan at any time. Changes take effect at the next billing cycle.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, Pro and Premium plans include a 7-day free trial. No credit card required.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. You can cancel your subscription at any time with no penalties.',
              },
              {
                q: 'What happens to my data?',
                a: 'Your reading history and preferences are always yours. They remain available even if you downgrade.',
              },
              {
                q: 'Do you offer discounts for annual billing?',
                a: 'Yes! Annual plans include a 20% discount compared to monthly billing.',
              },
            ].map((item, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.q}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Have questions?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Our support team is ready to help you choose the perfect plan
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
              Contact Sales
            </button>
            <button className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 transition">
              View Docs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
