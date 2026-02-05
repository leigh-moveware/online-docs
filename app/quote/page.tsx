'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageShell } from '@/lib/components/layout';
import { Loader2, AlertCircle } from 'lucide-react';

interface Job {
  id: number;
  titleName?: string;
  firstName?: string;
  lastName?: string;
  estimatedDeliveryDetails?: string;
  jobValue?: number;
  brandCode?: string;
  branchCode?: string;
  
  // Addresses
  upliftLine1?: string;
  upliftLine2?: string;
  upliftCity?: string;
  upliftState?: string;
  upliftPostcode?: string;
  upliftCountry?: string;
  
  deliveryLine1?: string;
  deliveryLine2?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryPostcode?: string;
  deliveryCountry?: string;
  
  // Measures
  measuresVolumeGrossM3?: number;
  measuresWeightGrossKg?: number;
  
  branding?: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}

interface InventoryItem {
  id: number;
  description?: string;
  room?: string;
  quantity?: number;
  cube?: number;
  typeCode?: string;
}

function QuotePageContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const companyId = searchParams.get('coId');
  
  const [job, setJob] = useState<Job | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobId && companyId) {
      fetchJobData(jobId, companyId);
    } else {
      setError('Missing required parameters: jobId and coId are required');
      setLoading(false);
    }
  }, [jobId, companyId]);

  const fetchJobData = async (jobIdParam: string, coIdParam: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch job details with company ID
      const jobResponse = await fetch(`/api/jobs/${jobIdParam}?coId=${coIdParam}`);
      const jobResult = await jobResponse.json();

      if (!jobResponse.ok || !jobResult.success) {
        throw new Error(jobResult.error || 'Failed to load job');
      }

      // Fetch inventory with company ID
      const inventoryResponse = await fetch(`/api/jobs/${jobIdParam}/inventory?coId=${coIdParam}`);
      const inventoryResult = await inventoryResponse.json();

      setJob(jobResult.data);
      setInventory(inventoryResult.data || []);
    } catch (err) {
      console.error('Error fetching job data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load job data');
    } finally {
      setLoading(false);
    }
  };

  const syncFromMoveware = async () => {
    if (!jobId || !companyId) return;
    
    try {
      setSyncing(true);
      
      const syncResponse = await fetch(`/api/jobs/${jobId}/sync?coId=${companyId}`, {
        method: 'POST',
      });
      
      const syncResult = await syncResponse.json();

      if (!syncResponse.ok || !syncResult.success) {
        throw new Error(syncResult.error || 'Failed to sync data');
      }

      // Refresh the page data
      await fetchJobData(jobId, companyId);
    } catch (err) {
      console.error('Error syncing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync data from Moveware');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <PageShell includeHeader={false}>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600">Loading quote details...</p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (error || !job) {
    return (
      <PageShell includeHeader={false}>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Quote</h2>
            <p className="text-gray-600 mb-6">{error || 'Job not found'}</p>
            <button
              onClick={() => jobId && companyId && fetchJobData(jobId, companyId)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  const customerName = `${job.titleName || ''} ${job.firstName || ''} ${job.lastName || ''}`.trim();
  const companyName = job.branding?.companyName || 'MOVEWARE';
  const logoUrl = job.branding?.logoUrl;
  const primaryColor = job.branding?.primaryColor || '#1E40AF';
  const totalCube = inventory.reduce((sum, item) => sum + (item.cube || 0), 0);

  return (
    <PageShell includeHeader={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Quote Header with Logo and Banner */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Left - Logo and Title */}
              <div>
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={companyName}
                    style={{ maxWidth: '250px' }}
                    className="w-auto object-contain mb-6"
                  />
                ) : (
                  <h1 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>{companyName}</h1>
                )}
                <h2 className="text-3xl font-bold text-gray-900">Your Moving Quote</h2>
                <div className="mt-4 space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Prepared For:</span> {customerName}</p>
                  <p><span className="font-medium">Reference:</span> #{job.id}</p>
                  <p><span className="font-medium">Quote Date:</span> {new Date().toLocaleDateString()}</p>
                  <p><span className="font-medium">Expiry Date:</span> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Right - Banner Image */}
              <div className="hidden md:block">
                <div className="rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=450&fit=crop" 
                    alt="Professional moving services"
                    className="w-full h-full object-cover aspect-video"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-8 py-8">
          
          {/* Location Information */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Location Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Origin */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Origin Address</h4>
                <div className="text-gray-600 text-sm space-y-1">
                  <p>{job.upliftLine1}</p>
                  {job.upliftLine2 && <p>{job.upliftLine2}</p>}
                  <p>{job.upliftCity}, {job.upliftState} {job.upliftPostcode}</p>
                  <p>{job.upliftCountry}</p>
                </div>
              </div>

              {/* Destination */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Destination Address</h4>
                <div className="text-gray-600 text-sm space-y-1">
                  <p>{job.deliveryLine1}</p>
                  {job.deliveryLine2 && <p>{job.deliveryLine2}</p>}
                  <p>{job.deliveryCity}, {job.deliveryState} {job.deliveryPostcode}</p>
                  <p>{job.deliveryCountry}</p>
                </div>
              </div>
            </div>

            {/* Move Date */}
            {job.estimatedDeliveryDetails && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Scheduled Move Date</h4>
                <p className="text-2xl font-bold" style={{ color: primaryColor }}>{job.estimatedDeliveryDetails}</p>
              </div>
            )}
          </div>

          {/* Quote Summary */}
          {job.jobValue && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quote Summary</h3>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Volume</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCube.toFixed(2)} m³</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                  <p className="text-2xl font-bold text-green-600">${job.jobValue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Section */}
          {inventory.length > 0 && (
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Complete Inventory</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Volume (m³)</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{item.description}</div>
                          {item.room && <div className="text-xs text-gray-500">Room: {item.room}</div>}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900">{item.quantity || 1}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900">{item.cube?.toFixed(2) || '0.00'}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            {item.typeCode || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                    <tr>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">Total</td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        {inventory.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        {totalCube.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h3>
            <ol className="space-y-3">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mr-3">1</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Review Your Quote</h4>
                  <p className="text-sm text-gray-600">Please review all details including the inventory list, services, and pricing.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mr-3">2</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Contact Us</h4>
                  <p className="text-sm text-gray-600">If you have any questions or need adjustments, our team is here to help.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mr-3">3</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Confirm Your Booking</h4>
                  <p className="text-sm text-gray-600">Once you're ready, confirm your booking to secure your move date.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Terms & Contact */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions</h3>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>• This quote is valid for 30 days from the date of issue.</li>
              <li>• All prices are in Australian Dollars (AUD) and include GST.</li>
              <li>• Final pricing may vary based on actual inventory and conditions.</li>
              <li>• Payment: 50% deposit to confirm, balance due on completion.</li>
              <li>• Cancellation: Full refund if cancelled 7+ days before move date.</li>
            </ul>

            <div className="pt-6 border-t border-gray-200 text-center">
              <h4 className="font-bold text-gray-900 mb-3">{companyName}</h4>
              <div className="text-sm text-gray-600 space-y-1">
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

export default function QuotePage() {
  return (
    <Suspense fallback={
      <PageShell includeHeader={false}>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600">Loading quote...</p>
          </div>
        </div>
      </PageShell>
    }>
      <QuotePageContent />
    </Suspense>
  );
}
