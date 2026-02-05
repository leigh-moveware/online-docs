'use client';

import { useEffect, useState } from 'react';
import { PageShell } from '@/lib/components/layout';
import { JobDetailsCard, InventoryTable, CostBreakdownCard } from '@/lib/components/quotes';
import { QuoteData } from '@/lib/types/quote';
import { Loader2, AlertCircle } from 'lucide-react';

export default function QuotePage() {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuoteData();
  }, []);

  const fetchQuoteData = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Get actual quote ID from URL params or context
      const quoteId = 'sample-quote-123';
      
      const response = await fetch(`/api/quotes/${quoteId}`);
      const result = await response.json();

      if (result.success && result.data) {
        setQuoteData(result.data);
      } else {
        setError(result.error || 'Failed to load quote data');
      }
    } catch (err) {
      console.error('Error fetching quote:', err);
      setError('An unexpected error occurred while loading the quote');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageShell includeHeader={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600">Loading quote details...</p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell includeHeader={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Quote</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchQuoteData}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!quoteData) {
    return (
      <PageShell includeHeader={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">No quote data available</p>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell includeHeader={false}>
      <div className="min-h-screen bg-white">
        {/* Cover Page */}
        <div className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white" style={{ minHeight: '50vh' }}>
          <div className="absolute inset-0 bg-blue-600 opacity-10"></div>
          <div className="relative max-w-4xl mx-auto px-8 py-16">
            <div className="mb-12">
              <div className="inline-block bg-white px-6 py-3 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-blue-900">MOVEWARE</h1>
              </div>
            </div>
            <div className="mt-20">
              <h2 className="text-5xl font-bold mb-4">Your Moving Quotation</h2>
              <p className="text-xl text-blue-100">Quote #{quoteData.jobDetails.quoteNumber}</p>
              <p className="text-lg text-blue-200 mt-2">Prepared for {quoteData.jobDetails.customer.name}</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="prose max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome</h3>
            <p className="text-gray-700 leading-relaxed">
              Thank you for choosing Moveware for your moving needs. We're pleased to provide you with this detailed quotation 
              for your upcoming move. Our team is committed to making your relocation as smooth and stress-free as possible.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              This quote includes all the services we discussed, a complete inventory of items to be moved, and a transparent 
              breakdown of costs. Please review the details carefully, and don't hesitate to contact us if you have any questions.
            </p>
          </div>
        </div>

        {/* Location Information */}
        <div className="max-w-4xl mx-auto px-8 py-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Location Information</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Origin */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Origin Address</h4>
              <div className="text-gray-700 space-y-1">
                <p>{quoteData.jobDetails.origin.street}</p>
                <p>{quoteData.jobDetails.origin.city}, {quoteData.jobDetails.origin.state} {quoteData.jobDetails.origin.postcode}</p>
                <p>{quoteData.jobDetails.origin.country}</p>
              </div>
            </div>

            {/* Destination */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Destination Address</h4>
              <div className="text-gray-700 space-y-1">
                <p>{quoteData.jobDetails.destination.street}</p>
                <p>{quoteData.jobDetails.destination.city}, {quoteData.jobDetails.destination.state} {quoteData.jobDetails.destination.postcode}</p>
                <p>{quoteData.jobDetails.destination.country}</p>
              </div>
            </div>
          </div>

          {/* Move Date */}
          <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Scheduled Move Date</h4>
            <p className="text-2xl font-bold text-blue-900">{quoteData.jobDetails.moveDate}</p>
          </div>
        </div>

        {/* Moving Options / Cost Breakdown */}
        <div className="max-w-4xl mx-auto px-8 py-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Moving Options</h3>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-900 text-white px-6 py-4">
              <div className="grid grid-cols-3 gap-4 font-semibold">
                <div className="col-span-2">Service</div>
                <div className="text-right">Price</div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {quoteData.costings.items.map((item) => (
                <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <p className="font-medium text-gray-900">{item.description}</p>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                    <div className="text-right font-semibold text-gray-900">
                      ${item.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-300">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">${quoteData.costings.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>GST ({(quoteData.costings.taxRate * 100).toFixed(0)}%)</span>
                  <span className="font-medium">${quoteData.costings.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-blue-900 pt-2 border-t border-gray-300">
                  <span>Total</span>
                  <span>${quoteData.costings.total.toFixed(2)} {quoteData.costings.currency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="max-w-4xl mx-auto px-8 py-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h3>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Review Your Quote</h4>
                  <p className="text-gray-700">Please review all details including the inventory list, services, and pricing.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Contact Us</h4>
                  <p className="text-gray-700">If you have any questions or need adjustments, our team is here to help.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Confirm Your Booking</h4>
                  <p className="text-gray-700">Once you're ready, confirm your booking to secure your move date.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Section */}
        <div className="max-w-4xl mx-auto px-8 py-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Inventory</h3>
          <InventoryTable items={quoteData.inventory} />
        </div>

        {/* Notes */}
        {quoteData.jobDetails.notes && (
          <div className="max-w-4xl mx-auto px-8 py-8">
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h4 className="font-semibold text-gray-900 mb-2">Special Notes</h4>
              <p className="text-gray-700">{quoteData.jobDetails.notes}</p>
            </div>
          </div>
        )}

        {/* Footer / Terms */}
        <div className="max-w-4xl mx-auto px-8 py-12 border-t border-gray-200 mt-12">
          <div className="prose max-w-none text-sm text-gray-600">
            <h4 className="text-base font-semibold text-gray-900 mb-3">Terms & Conditions</h4>
            <ul className="space-y-2">
              <li>This quote is valid for 30 days from the date of issue.</li>
              <li>All prices are in Australian Dollars (AUD) and include GST.</li>
              <li>Final pricing may vary based on actual inventory and conditions at pickup and delivery locations.</li>
              <li>Payment terms: 50% deposit required to confirm booking, balance due on completion.</li>
              <li>Cancellation policy: Full refund if cancelled more than 7 days before move date.</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-xl font-bold text-blue-900 mb-4">MOVEWARE</h3>
              <div className="space-y-2 text-gray-600">
                <p>Email: contact@moveware.com</p>
                <p>Phone: 1300 MOVEWARE</p>
                <p>Web: www.moveware.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
