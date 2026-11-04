import { EVENT } from "@/utils/event";
import { firstName, type Entry } from "@/utils/entry";

export default function WelcomeNote({ entry }: { entry: Entry }) {
  const first = firstName(entry.name);
  const isStall = entry.kind === "stall";

  return (
    <div className="acard welcome">
      <p className="eyebrow eyebrow--red">{isStall ? "Your stall is registered" : "You're on the guest list"}</p>
      <h2>
        {isStall
          ? `Welcome to ${EVENT.name}${first ? `, ${first}` : ""}.`
          : `See you at ${EVENT.name}${first ? `, ${first}` : ""}.`}
      </h2>
      <p>
        {isStall
          ? `We're so excited to see ${entry.stall_name || "your little founder's stall"} come to life. Save the pass below and show it when you arrive — one scan and you're set up. Parents are welcome at the stall.`
          : "We're so glad you're coming. Save the pass below and show it at the door — one scan and you're in."}
      </p>
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
