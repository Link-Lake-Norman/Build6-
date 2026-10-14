export function escapeHtml(value: string) { return value.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!)); }
export function eligible(status: string, terms: string | null, expected: string) { return status === "ACTIVE" && terms === expected; }
export function validPayment(amount: number, reference: string) { return amount === 9900 && reference.trim().length >= 4 && reference.length <= 120; }
export function validEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254; }
