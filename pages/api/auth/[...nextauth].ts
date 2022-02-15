import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import SequelizeAdapter from '@next-auth/sequelize-adapter';

import sequelize from '@/lib/models/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adapter = SequelizeAdapter(sequelize);

  // TODO: remove this after development
  await sequelize.sync();

  return await NextAuth(req, res, {
    pages: {
      signOut: '/'
    },
    providers: [
      FacebookProvider({
        clientId: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      }),
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD
          }
        },
        from: process.env.EMAIL_FROM
      }),
    ],
    callbacks: {
      async session({ session, token, user }) {
        session.user.id = user.id;
        return session;
      },
    },
    adapter,
  });
}
