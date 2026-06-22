import { registerOTel } from '@vercel/otel';
import { LangfuseExporter } from 'langfuse-vercel';

// Exports AI SDK telemetry traces to Langfuse for every request.
export function register() {
  registerOTel({
    serviceName: 'rohit-recruiter-agent',
    traceExporter: new LangfuseExporter(),
  });
}
