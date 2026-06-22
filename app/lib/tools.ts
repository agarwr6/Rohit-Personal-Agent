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

  // Action tool: email Rohit when a recruiter wants to connect, with their details so he can reply.
  // Only call this AFTER collecting the recruiter's name and email (see the connect skill).
  notify_rohit: tool({
    description:
      "Notify Rohit by email that a recruiter wants to connect. Only call this once you have collected the recruiter's name and email. Include their company and the role if shared.",
    inputSchema: z.object({
      recruiterName: z.string().describe("The recruiter's name"),
      recruiterEmail: z.string().email().describe("The recruiter's email address"),
      company: z.string().optional().describe('The recruiter or hiring company'),
      role: z.string().optional().describe('The role they are hiring for'),
      message: z.string().optional().describe('Any additional context the recruiter shared'),
    }),
    execute: async ({ recruiterName, recruiterEmail, company, role, message }) => {
      const apiKey = process.env.RESEND_API_KEY;
      const to = process.env.ROHIT_NOTIFY_EMAIL;
      if (!apiKey || !to) {
        return { ok: false, message: 'Notification channel not configured.' };
      }
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: 'Rohit Assistant <onboarding@resend.dev>',
        to,
        replyTo: recruiterEmail,
        subject: `New recruiter: ${recruiterName}${company ? ` (${company})` : ''}${role ? ` — ${role}` : ''}`,
        text: [
          'A recruiter connected through your AI assistant.',
          '',
          `Name:    ${recruiterName}`,
          `Email:   ${recruiterEmail}`,
          `Company: ${company ?? 'not provided'}`,
          `Role:    ${role ?? 'not provided'}`,
          `Message: ${message ?? 'none'}`,
          '',
          'Reply to this email to reach them directly.',
        ].join('\n'),
      });
      if (error) {
        return { ok: false, message: 'Could not send the notification.' };
      }
      return { ok: true, message: 'Rohit has been notified and will follow up with you.' };
    },
  }),
};
