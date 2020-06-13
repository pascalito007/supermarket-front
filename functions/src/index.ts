import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.database();

import * as sgMail from '@sendgrid/mail';

const API_KEY: string = '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';
const TEMPLATE_ID: string = 'd-1da7fff0c01947e38f49de4ec6834434';
//console.log(db.app.auth().getUser())

sgMail.setApiKey(API_KEY);

export const shopping_confirmation = functions.database.instance('gostore-b24ab').ref('users/pasciano007@gmail,com' ).onUpdate(user => {
  const msg = {
    to: 'mosktmp+alcrb@gmail.com',
    from: '305028@supinfo.com',
    templateId: TEMPLATE_ID,
    dynamic_template_date:{
      subject: 'Sending with Twilio SendGrid is Fun',
    },
  };
  return sgMail.send(msg);
});
