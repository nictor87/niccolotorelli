import { Fragment } from "react";

type SplitTextProps = {
  text: string;
  delay?: number;
};

export function SplitText({ text, delay = 0 }: SplitTextProps) {
  let index = 0;
  const words = text.split(" ");

  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="split" aria-hidden="true">
        {words.map((word, wordIndex) => (
          <Fragment key={`${word}-${wordIndex}`}>
            {wordIndex > 0 ? " " : null}
            <span className="split-word">
              {Array.from(word).map((char, charIndex) => {
                const order = index++;
                return (
                  <span
                    key={`${char}-${charIndex}`}
                    className="split-char"
                    style={
                      {
                        "--order": order,
                        "--delay": `${delay}ms`,
                      } as React.CSSProperties
                    }
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  );
}
