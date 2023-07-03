import spotifyApi, { LOGIN_URL } from "@/lib/spotify";
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";

async function refreshAccessToken(token: JWT) {
  try {
    spotifyApi.setAccessToken(token.accessToken!);
    spotifyApi.setRefreshToken(token.refreshToken!);

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
        clientId: process.env.SPOTIFY_CLIENT_ID!,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
        authorization: LOGIN_URL
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
      signIn: "/login"
  },
  callbacks: {
      async jwt({ token, account, user }) {
          // Persist the OAuth access_token to the token right after signin
          if (account && user) {
              return {
                ...token,
                accessToken : account.access_token,
                refreshToken : account.refresh_token,
                username: account.providerAccountId,
                accessTokenExpires : account.expires_at! * 1000,
              }
          }
          // access token has not expired
          if (Date.now() < token.accessTokenExpires!) {
              return token
          }

          // access token has expired
          return await refreshAccessToken(token)
      },
      async session({ session, token }) {
          // Send properties to the client, like an access_token from a provider.
          session.user!.accessToken = token.accessToken
          session.user!.refreshToken = token.refreshToken
          session.user!.username = token.username
          return session
      }
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
