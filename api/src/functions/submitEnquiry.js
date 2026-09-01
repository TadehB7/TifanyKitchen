const { app } = require('@azure/functions');
const sgMail = require('@sendgrid/mail');

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'phone', 'message'];

app.http('submitEnquiry', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'submitEnquiry',
    handler: async (request, context) => {
        const form = await request.formData();
        const data = Object.fromEntries(form.entries());

        const missing = REQUIRED_FIELDS.find((field) => !data[field]?.trim());
        if (missing) {
            return { status: 200, body: `${missing} is required` };
        }

        const apiKey = process.env.SENDGRID_API_KEY;
        const fromAddress = process.env.CONTACT_FROM_EMAIL;
        const toAddress = process.env.CONTACT_TO_EMAIL || 'carrier@tiffanykitchenhtml.com';

        if (!apiKey || !fromAddress) {
            context.error('submitEnquiry: SendGrid is not configured (SENDGRID_API_KEY / CONTACT_FROM_EMAIL).');
            return { status: 200, body: 'Something went wrong :(' };
        }

        sgMail.setApiKey(apiKey);

        try {
            await sgMail.send({
                to: toAddress,
                from: fromAddress,
                replyTo: data.email,
                subject: 'Contact Inquiry from TiffanyKitchen Website',
                html: [
                    `<strong>Name:</strong> ${data.firstName} ${data.lastName}<br>`,
                    `<strong>Email:</strong> ${data.email}<br>`,
                    `<strong>Phone:</strong> ${data.phone}<br>`,
                    `<strong>Message:</strong> ${data.message.replace(/\n/g, '<br>')}<br>`
                ].join('')
            });
            return { status: 200, body: 'success' };
        } catch (err) {
            context.error('submitEnquiry: SendGrid send failed', err);
            return { status: 200, body: 'Something went wrong :(' };
        }
    }
});
