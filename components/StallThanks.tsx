import { EVENT } from "@/utils/event";
import { firstName, stallWhatsAppUrl, type Entry } from "@/utils/entry";

// Shown to the public after a stall registration. Stalls don't get a pass
// on the spot — they're pointed to the team to confirm their table.
export default function StallThanks({ entry }: { entry: Entry }) {
  const first = firstName(entry.name);
  const { contact } = EVENT;

  return (
    <div className="acard welcome">
      <p className="eyebrow eyebrow--red">Stall details received</p>
      <h2>Thank you{first ? `, ${first}` : ""}.</h2>
      <p>
        We&apos;ve got the details for <strong>{entry.stall_name}</strong>. To confirm your table, please get in touch
        with our point of contact.
      </p>

      <div className="contact">
        <p className="eyebrow">Point of contact</p>
        <p className="contact__name">{contact.name}</p>
        <a className="contact__phone" href={`tel:${contact.tel}`}>
          {contact.phone}
        </a>
        <a className="btn btn--block contact__wa" href={stallWhatsAppUrl(entry)} target="_blank" rel="noopener noreferrer">
          Message {contact.name} on WhatsApp
        </a>
        <p className="field-hint">
          The message is pre-filled with your stall details. Just hit send.
        </p>
      </div>

      <div className="when">
        <strong>
          {EVENT.dateShort} · {EVENT.hours}
        </strong>
        <p>
          {EVENT.venue}, {EVENT.city}
        </p>
      </div>
    </div>
  );
}
