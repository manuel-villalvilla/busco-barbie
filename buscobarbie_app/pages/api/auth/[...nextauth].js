import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
import authenticateUser from '../../../logic/authenticateUser'
import authenticateGoogleUser from "../../../logic/authenticateGoogleUser"
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET

export default NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {
                    label: 'email',
                    type: 'email',
                    placeholder: 'Introduce tu email',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                const data = await authenticateUser(credentials, req)
            
                if (data) return data
            }
        }),
        GoogleProvider({
            name: 'google',
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                if (account.provider === 'google') {
                    try {
                        const res = await authenticateGoogleUser(user)
                        token.tokenFromApi = res.data.token
                        token.role = 'google'
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    token.tokenFromApi = user.token
                    token.role = user.role
                }

            }
            return token;
        },

        async session({ session, token }) {
            session.tokenFromApi = token.tokenFromApi
            session.role = token.role
            return session;
        },

        async signIn({ account, profile }) {
            if (account.provider === "google") {
                if (!profile.email_verified) return false // return './unauthorized'
                // return profile.email_verified && profile.email.endsWith("@gmail.com")
            }
            return true // Do different verification for other providers that don't have `email_verified`
        },
    },

    // Enable debug messages in the console if you are having problems
    // debug: process.env.NODE_ENV === 'development',
});