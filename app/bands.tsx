const BAND_COUNT = 10;

export function Bands() {
  return (
    <span className="bands" aria-hidden="true">
      {Array.from({ length: BAND_COUNT }, (_, index) => (
        <span key={index} className="band" />
      ))}
    </span>
  );
}
