import type { Credit } from "./work";

export function Credits({ credits, className = "" }: { credits: Credit[]; className?: string }) {
  return (
    <dl className={`credits ${className}`}>
      {credits.map(([role, names]) => (
        <div key={role}>
          <dt>{role}</dt> <dd>{names}</dd>
        </div>
      ))}
    </dl>
  );
}
