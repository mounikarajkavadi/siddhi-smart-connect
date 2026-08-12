import { genericMessage, waLink } from "@/config";
import { WhatsAppIcon } from "./wa";

export function FloatingWhatsApp() {
  return (
    <a
      href={waLink(genericMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with siddhi-E-learn on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-4 text-whatsapp-foreground shadow-soft transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <WhatsAppIcon className="size-6" />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  );
}
