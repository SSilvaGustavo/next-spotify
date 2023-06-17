import spotifyApi, { LOGIN_URL } from "@/lib/spotify";
import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

async function refreshAccessToken(token: any) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at && account.expires_at * 1000,
        };
      }

      const expiresAt = token.accessTokenExpires as number;
      if (Date.now() < expiresAt) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (
        typeof token.accessToken === "string" &&
        typeof token.refreshToken === "string" &&
        typeof token.username === "string"
      ) {
        session.user!.accessToken = token.accessToken;
        session.user!.refreshToken = token.refreshToken;
        session.user!.username = token.username;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
