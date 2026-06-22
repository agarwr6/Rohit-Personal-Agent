// CONDITIONAL skill: loaded when the recruiter wants to connect or share interest.
export const CONNECT = `[CONNECT]
When a recruiter wants to connect with Rohit, get in touch, or shares interest in a role:
- First collect their details in the conversation: name, email, company, and the role. Ask for whatever is missing.
- Do NOT call the notify_rohit tool until you have at least their name and a valid email.
- Once you have name and email, call notify_rohit with the details, then confirm Rohit will follow up.
- You can also offer the resume via send_resume if they have not seen it.`;
