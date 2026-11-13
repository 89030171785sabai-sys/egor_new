/**
 * Lead transport. Every form on the site submits through `submitLead`, so
 * wiring a real CRM later means replacing only the transport below — no form
 * component needs to change.
 */
export type LeadSource =
  | 'header-callback'
  | 'hero'
  | 'product'
  | 'calculator'
  | 'quiz'
  | 'contacts'
  | 'footer'

export interface Lead {
  source: LeadSource
  name?: string
  phone: string
  email?: string
  message?: string
  /** Product / configuration context, when the form is attached to one. */
  payload?: Record<string, string | number | boolean>
}

export type LeadResult = { ok: true; confirmed: boolean } | { ok: false; error: string }

const endpoint = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined

export async function submitLead(lead: Lead): Promise<LeadResult> {
  if (!endpoint) {
    // No CRM configured yet: succeed locally so the UI's success state is
    // exercised, and leave a trace for debugging.
    console.info('[lead] no VITE_LEADS_ENDPOINT configured, lead not sent', lead)
    await new Promise((resolve) => setTimeout(resolve, 400))
    return { ok: true, confirmed: false }
  }

  // The site server reads the Apps Script acknowledgment, which is hidden
  // from the browser when the request uses no-cors.
  const toGoogleScript = /^https:\/\/script\.google(usercontent)?\.com\//.test(endpoint)
  const url = toGoogleScript ? `${import.meta.env.BASE_URL}lead-receiver.php` : endpoint
  const body = JSON.stringify({ ...lead, sentAt: new Date().toISOString(), page: location.href })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    if (!response.ok) return { ok: false, error: `HTTP ${response.status}` }
    if (toGoogleScript && (await response.text()).trim() !== 'ok') {
      return { ok: false, error: 'Lead was not acknowledged' }
    }
    return { ok: true, confirmed: true }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'network' }
  }
}
