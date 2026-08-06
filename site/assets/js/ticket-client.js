// A simple client wrapper for interacting with the backend (Supabase).
// Keys are safely exposed to the client because the database is secured with Row Level Security (RLS).

const SUPABASE_URL = 'https://frspfhhgptcmezvfucgj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyc3BmaGhncHRjbWV6dmZ1Y2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNDU3MTMsImV4cCI6MjEwMTYyMTcxM30.chcnE3pS-i0Nhm_beIjKWp6m5IrppBk4r-4ZeRw4zYM';

async function createTicket(ticketData) {
    console.log("Creating ticket in Supabase:", ticketData);
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(ticketData)
        });
        
        if (!response.ok) {
            console.error("Error creating ticket:", await response.text());
            return { success: false };
        }
        
        return await response.json();
    } catch (e) {
        console.error("Network error:", e);
        return { success: false };
    }
}
