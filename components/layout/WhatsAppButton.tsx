import { MessageCircle } from "lucide-react";

type Props = {
  phone: string;
  label: string;
};

export function WhatsAppButton({ phone, label }: Props) {
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed bottom-6 right-6 z-50 grid place-items-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
