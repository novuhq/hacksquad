import { Notifire } from '@notifire/core';
import { loadProviders } from './providers';
import { loadTemplates } from './templates';

export const notifire = new Notifire({
  channels: {
    email: {
      from: {
        email: 'support@notifire.co',
        name: 'Hacksquad Team',
      },
    },
  },
});

loadProviders(notifire);
loadTemplates(notifire);
