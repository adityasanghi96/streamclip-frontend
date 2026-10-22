import type { ReactNode } from "react";
import Link from "next/link";

function LegalDoc({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="legal">
      <h1>{title}</h1>
      <p className="legal-updated">Last updated October 21, 2026</p>
      {children}
    </article>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalDoc title="Privacy Policy">
      <p>
        Stream Clip helps streamers capture and watch livestream clips from YouTube, Twitch, and Kick.
        This policy explains what information we collect, why we collect it, and the choices you have.
      </p>

      <h2>Information we collect</h2>
      <p>When you sign in with Google we receive your Google account id, name, email address, and profile picture.</p>
      <p>If you connect a streaming platform from the dashboard, we also store:</p>
      <ul>
        <li>YouTube, Twitch, or Kick account and channel details needed to identify your streams</li>
        <li>OAuth tokens so we can keep those accounts linked, read live status, and create clips for you</li>
        <li>Webhook configuration used to receive clip events</li>
      </ul>
      <p>
        When a clip is created we store its title, source (Nightbot or native), platform, video id, timestamp,
        thumbnail, the chat name of the person who requested it, and a game match when we can identify one.
      </p>

      <h2>How we use information</h2>
      <ul>
        <li>Create and maintain your Stream Clip account</li>
        <li>Link channels, create clips, and show them in your dashboard</li>
        <li>Publish a public catalog of channels, users, games, and clips on the site</li>
        <li>Identify games from clip titles and platform APIs so people can filter by game</li>
        <li>Keep the service secure and diagnose problems</li>
      </ul>

      <h2>Public clips</h2>
      <p>
        Clips, channel names, profile images, and related metadata shown on Stream Clip are public. Anyone can
        browse the home page, open a channel or user, and watch a clip without signing in. New clips are also posted
        to the Stream Clip Discord community. If you save your own Discord webhook, we send the same clip embed there
        after posting it to the Stream Clip server.
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        We store a sign-in token in your browser so you stay logged in, and we remember your theme preference in
        local storage. We do not use advertising cookies or sell personal information.
      </p>

      <h2>Sharing</h2>
      <p>
        We share information with Google, YouTube, Twitch, Kick, and Discord only as needed to sign you in, link
        accounts, create clips, and post public clip embeds. We do not sell your personal information. We may
        disclose information if required by law or to protect the service and its users.
      </p>

      <h2>Retention and your choices</h2>
      <p>
        You can unlink YouTube, Twitch, and Kick accounts from the dashboard at any time, which removes those
        connection tokens. You can sign out to clear the token stored in your browser.
      </p>
      <p>
        Stream Clip does not currently offer self-serve account deletion. To request deletion of your account and
        associated personal data, contact us from the email address on your Stream Clip account. Public clips that
        were already created may remain if they are part of the public catalog, unless we agree to remove them as
        part of that request.
      </p>

      <h2>Children</h2>
      <p>
        Stream Clip is not directed at children under 13, and we do not knowingly collect personal information from
        children.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy as the product changes. The “Last updated” date at the top of this page will
        change when we do. Continued use of Stream Clip after an update means you accept the revised policy.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent from the email address on your Stream Clip account. You can review
        connected accounts any time on the <Link href="/dashboard">Dashboard</Link>.
      </p>
    </LegalDoc>
  );
}

export function TermsOfService() {
  return (
    <LegalDoc title="Terms of Service">
      <p>
        These terms govern your use of Stream Clip. By creating an account or using the site, you agree to them.
        If you do not agree, do not use Stream Clip.
      </p>

      <h2>The service</h2>
      <p>
        Stream Clip lets you sign in with Google, connect YouTube, Twitch, or Kick channels, capture livestream
        clips (including through Nightbot commands and native platform clips), and watch a public library of those
        clips.
      </p>

      <h2>Accounts</h2>
      <p>
        You must use a Google account you are allowed to use. You are responsible for activity under your account.
        Keep access to that Google account secure. We may suspend or remove access if we believe these terms are
        being violated.
      </p>

      <h2>Connected platforms</h2>
      <p>
        YouTube, Twitch, Kick, Nightbot, and Google are third-party services. Their terms and privacy policies also
        apply. You must have the right to connect a channel and to create clips from its livestreams. We are not
        responsible for outages, policy changes, or actions those platforms take on your account.
      </p>

      <h2>Clips and content</h2>
      <p>
        Clips you create may appear publicly on Stream Clip, including titles, thumbnails, channel names, and the
        chat name of the person who requested the clip. New clips are also posted to the Stream Clip Discord
        community, and to a Discord webhook you configure. You grant Stream Clip a non-exclusive license to host,
        display, and distribute that content as part of the service.
      </p>
      <p>
        You remain responsible for the underlying stream content. Do not use Stream Clip to capture or share
        material you do not have the right to use, including content that infringes someone else’s rights.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Abuse, overload, or attempt to break the service or other users’ accounts</li>
        <li>Use Stream Clip for harassment, illegal activity, or to capture content you are not allowed to clip</li>
        <li>Scrape, resell, or automate access in a way that interferes with the site</li>
        <li>Misrepresent who you are or which channels you control</li>
      </ul>

      <h2>Availability</h2>
      <p>
        We provide Stream Clip as-is. Features, uptime, and clip quality can change. Live video, thumbnails, and
        platform APIs are outside our control, so clips may fail, be delayed, or become unavailable.
      </p>

      <h2>Disclaimers</h2>
      <p>
        To the fullest extent allowed by law, Stream Clip is provided without warranties of any kind, including
        implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent allowed by law, Stream Clip and its operators are not liable for indirect, incidental,
        special, consequential, or lost-profit damages, or for loss of clips, data, or platform access, arising from
        your use of the service.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms as the product changes. The “Last updated” date at the top of this page will
        change when we do. Continued use after an update means you accept the revised terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent from the email address on your Stream Clip account. Related details
        about data we store are in the <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </LegalDoc>
  );
}
