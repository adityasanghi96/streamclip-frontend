export const GOOGLE_LOGIN_SCOPE = "openid email profile";
export const GOOGLE_YOUTUBE_SCOPE = "https://www.googleapis.com/auth/youtube.readonly";

function waitForGoogle(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (window.google?.accounts?.oauth2) {
        window.clearInterval(timer);
        resolve();
      } else if (Date.now() - started > 8000) {
        window.clearInterval(timer);
        reject(new Error("Google Sign-In failed to load"));
      }
    }, 50);
  });
}

export async function requestGoogleAccessToken(
  prompt = "",
  scope = GOOGLE_LOGIN_SCOPE,
  hint?: string
): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in streamclip-frontend/.env");
  }
  await waitForGoogle();

  return new Promise((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope,
      hint,
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          reject(new Error(resp.error || "Google sign-in was cancelled"));
          return;
        }
        resolve(resp.access_token);
      },
      error_callback: (err) => reject(new Error(err.message || "Google sign-in was cancelled")),
    });
    client.requestAccessToken({ prompt });
  });
}

export function requestYouTubeAccessToken(email?: string) {
  return requestGoogleAccessToken("consent", GOOGLE_YOUTUBE_SCOPE, email);
}
