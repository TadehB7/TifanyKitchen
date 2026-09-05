const { app } = require('@azure/functions');
const sgMail = require('@sendgrid/mail');

const REQUIRED_FIELDS = ['firstName', 'url', 'email', 'message'];

app.http('submitReview', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'submitReview',
    handler: async (request, context) => {
        const form = await request.formData();
        const data = Object.fromEntries(form.entries());

        const missing = REQUIRED_FIELDS.find((field) => !data[field]?.trim());
        if (missing) {
            return { status: 200, body: `${missing} is required` };
        }

        const apiKey = process.env.SENDGRID_API_KEY;
        const fromAddress = process.env.CONTACT_FROM_EMAIL;
        const toAddress = process.env.REVIEW_TO_EMAIL || 'info@tiffanykitchen.com';

        if (!apiKey || !fromAddress) {
            context.error('submitReview: SendGrid is not configured (SENDGRID_API_KEY / CONTACT_FROM_EMAIL).');
            return { status: 200, body: 'Something went wrong :(' };
        }

        sgMail.setApiKey(apiKey);

        try {
            await sgMail.send({
                to: toAddress,
                from: fromAddress,
                replyTo: data.email,
                subject: 'Enquiry from TiffanyKitchen Website',
                html: [
                    `<strong>Name:</strong> ${data.firstName}<br>`,
                    `<strong>Email:</strong> ${data.email}<br>`,
                    `<strong>URL:</strong> ${data.url}<br>`,
                    `<strong>Message:</strong> ${data.message.replace(/\n/g, '<br>')}<br>`
                ].join('')
            });
            return { status: 200, body: 'success' };
        } catch (err) {
            context.error('submitReview: SendGrid send failed', err);
            return { status: 200, body: 'Something went wrong :(' };
        }
    }
});
