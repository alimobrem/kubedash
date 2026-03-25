/**
 * Renders text with **bold** segments highlighted in Pulse accent color.
 * Shared utility to avoid duplicating the split('**') pattern.
 */
export function PulseText({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 === 1 ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: static array from string split
          <strong key={i} className="font-semibold text-[var(--pulse-accent)]">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}
