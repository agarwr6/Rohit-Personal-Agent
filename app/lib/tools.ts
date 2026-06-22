import { tool } from 'ai';
import { z } from 'zod';
import { Resend } from 'resend';

const RESUME_PATH = '/Rohit-Agarwal-Resume.pdf';

export const tools = {
  // Action tool: returns a download link to Rohit's resume. No email service needed.
  send_resume: tool({
    description:
      "Provide a download link to Rohit's resume. Use when the recruiter asks for his resume, CV, or to download/see it.",
    inputSchema: z.object({}),
    execute: async () => {
      return { url: RESUME_PATH, message: 'Resume download link ready.' };
    },
  }),

  // Action tool: email Rohit when a recruiter is interested, so he can follow up fast.
  notify_rohit: tool({
    description:
      'Notify Rohit by email that a recruiter is interested or wants to connect. Use when the recruiter expresses interest, mentions a specific role, or asks to get in touch. Pass a short reason and any contact details the recruiter shared.',
    inputSchema: z.object({
      reason: z.string().describe('Short summary of the recruiter interest or the role'),
      contact: z
        .string()
        .optional()
        .describe('Recruiter name, email, company, or how to reach them, if shared'),
    }),
    execute: async ({ reason, contact }) => {
      const apiKey = process.env.RESEND_API_KEY;
      const to = process.env.ROHIT_NOTIFY_EMAIL;
      if (!apiKey || !to) {
        return { ok: false, message: 'Notification channel not configured.' };
      }
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: 'Rohit Assistant <onboarding@resend.dev>',
        to,
        subject: 'New recruiter interest from your AI assistant',
        text: `A recruiter engaged your assistant.\n\nReason: ${reason}\nContact: ${contact ?? 'not provided'}`,
      });
      if (error) {
        return { ok: false, message: 'Could not send the notification.' };
      }
      return { ok: true, message: 'Rohit has been notified and will follow up.' };
    },
  }),
};
