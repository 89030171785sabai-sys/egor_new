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

export type LeadResult = { ok: true } | { ok: false; error: string }

const endpoint = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined

export async function submitLead(lead: Lead): Promise<LeadResult> {
  if (!endpoint) {
    // No CRM configured yet: succeed locally so the UI's success state is
    // exercised, and leave a trace for debugging.
    console.info('[lead] no VITE_LEADS_ENDPOINT configured, lead not sent', lead)
    await new Promise((resolve) => setTimeout(resolve, 400))
    return { ok: true }
  }

  // A Google Apps Script web app does not answer the pre-flight request a JSON
  // POST triggers, so the lead goes as plain text with no custom headers and
  // the answer is opaque. A network failure is still reported; a script that
  // rejected the row is not, which is why the script itself is kept trivial.
  const toGoogleScript = /^https:\/\/script\.google(usercontent)?\.com\//.test(endpoint)
  const body = JSON.stringify({ ...lead, sentAt: new Date().toISOString(), page: location.href })

  try {
    if (toGoogleScript) {
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', body })
      return { ok: true }
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    if (!response.ok) return { ok: false, error: `HTTP ${response.status}` }
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'network' }
  }
}
