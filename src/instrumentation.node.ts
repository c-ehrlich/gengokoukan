import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";

console.log("axiom dataset", process.env.AXIOM_DATASET);

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "kaiwaclub",
  }),
  spanProcessor: new SimpleSpanProcessor(
    new OTLPTraceExporter({
      url: "https://api.axiom.co/v1/traces",
      headers: {
        Authorization: `Bearer ${process.env.AXIOM_API_TOKEN}`,
        "X-Axiom-Dataset": process.env.AXIOM_DATASET,
      },
    }),
  ),
});
sdk.start();
