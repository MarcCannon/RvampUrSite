// ============================================================================
// Ticket submission. Requires supabase-client.js to be loaded first.
//
// The public request form inserts here with the anon key. RLS allows INSERT for
// anon but not SELECT, so visitors can submit a lead without being able to read
// anyone else's. See supabase/schema.sql.
// ============================================================================

async function createTicket(ticketData) {
    try {
        const response = await sbFetch('/rest/v1/tickets', {
            method: 'POST',
            headers: { 'Prefer': 'return=minimal' },
            body: JSON.stringify(ticketData)
        });

        if (!response.ok) {
            console.error('Error creating ticket:', await response.text());
            return { success: false };
        }

        return { success: true };
    } catch (e) {
        console.error('Network error:', e);
        return { success: false };
    }
}
