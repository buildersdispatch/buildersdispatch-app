import "./App.css";
import { CrossmintProvider, CrossmintHostedCheckout } from "@crossmint/client-sdk-react-ui";

export default function App() {
  const clientApiKey = import.meta.env.VITE_CROSSMINT_CLIENT_API_KEY;
  const collectionId = import.meta.env.VITE_CROSSMINT_COLLECTION_ID;

  if (!clientApiKey || !collectionId) {
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h2>Missing env vars</h2>
        <p>Set VITE_CROSSMINT_CLIENT_API_KEY and VITE_CROSSMINT_COLLECTION_ID in .env.local</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Crossmint Hosted Checkout Test</h1>

      <CrossmintProvider apiKey={clientApiKey}>
        <CrossmintHostedCheckout
          lineItems={{
            collectionLocator: `crossmint:${collectionId}`,
            callData: {
              totalPrice: "0.001",
              quantity: 1,
            },
          }}
          payment={{
            crypto: { enabled: true },
            fiat: { enabled: true },
          }}
        />
      </CrossmintProvider>
    </div>
  );
}
