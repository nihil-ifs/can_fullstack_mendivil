const mailhogUrl = process.env.NEXT_PUBLIC_MAILHOG_URL;
console.log('Mailhog URL:', mailhogUrl);
export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
  },
  prueba: {
    correo: mailhogUrl || 'http://127.0.0.1:9025',
    documentos: '/prueba/documentos',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
