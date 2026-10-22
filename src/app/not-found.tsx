import Link from "next/link";

export default function NotFound() {
  return (
    <section className="narrow">
      <h1>Page not found</h1>
      <p className="muted">That page is not on Stream Clip.</p>
      <Link className="btn" href="/">
        Browse clips
      </Link>
    </section>
  );
}
