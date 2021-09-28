import { SendgridEmailProvider } from '@notifire/sendgrid';
import { Notifire } from '@notifire/core';

export async function loadProviders(notifire: Notifire) {
  return await notifire.registerProvider(
    new SendgridEmailProvider({
      apiKey: process.env.SENDGRID_API_KEY,
      from: 'support@notifire.dev',
    })
  );
}
