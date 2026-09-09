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

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, sentAt: new Date().toISOString() }),
    })
    if (!response.ok) return { ok: false, error: `HTTP ${response.status}` }
    return { ok: true }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'network' }
  }
}
