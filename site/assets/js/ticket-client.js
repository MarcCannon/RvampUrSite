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
