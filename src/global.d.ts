declare module "videojs-youtube";

interface GoogleTokenClient {
  requestAccessToken: (override?: { prompt?: string }) => void;
}

interface GoogleCodeClient {
  requestCode: () => void;
}

interface GoogleClientError {
  message?: string;
  type?: string;
}

interface Window {
  google?: {
    accounts: {
      oauth2: {
        initTokenClient: (config: {
          client_id: string;
          scope: string;
          hint?: string;
          callback: (resp: { access_token?: string; error?: string }) => void;
          error_callback?: (err: GoogleClientError) => void;
        }) => GoogleTokenClient;
        initCodeClient: (config: {
          client_id: string;
          scope: string;
          ux_mode?: "popup" | "redirect";
          include_granted_scopes?: boolean;
          select_account?: boolean;
          login_hint?: string;
          callback: (resp: { code?: string; error?: string }) => void;
          error_callback?: (err: GoogleClientError) => void;
        }) => GoogleCodeClient;
        revoke: (accessToken: string, done?: () => void) => void;
      };
    };
  };
}
