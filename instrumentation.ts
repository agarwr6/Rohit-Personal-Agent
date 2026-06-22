import { registerOTel } from '@vercel/otel';
import { LangfuseSpanProcessor } from '@langfuse/otel';

// Exports AI SDK telemetry traces to Langfuse via the latest OTEL span processor.
export function register() {
  registerOTel({
    serviceName: 'rohit-recruiter-agent',
    spanProcessors: [new LangfuseSpanProcessor()],
  });
}
