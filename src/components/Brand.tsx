export const brandAssets = {
  markUrl: "/favicon.png",
  loaderUrl: "/loader.png",
  name: "Stream Clip",
};

export function BrandLockup() {
  return (
    <span className="brand-lockup">
      <img src={brandAssets.markUrl} alt="Stream Clip" className="brand-mark" />
      <span className="brand-wordmark">Stream Clip</span>
    </span>
  );
}

export function Loader({
  label = "Loading...",
  size = "md",
}: {
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className={`brand-loader size-${size}`} role="status" aria-live="polite">
      <img src={brandAssets.loaderUrl} alt="" />
      {label ? <span>{label}</span> : null}
    </div>
  );
}
