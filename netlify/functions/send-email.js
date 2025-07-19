const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async function(event, context) {
    // We only care about POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
            headers: { 'Allow': 'POST' }
        };
    }

    try {
        // Parse the form data from the request body
        const data = JSON.parse(event.body);

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields.' })
            };
        }

        // Construct the email message
        const msg = {
            to: process.env.TO_EMAIL,       // Your verified recipient email address
            from: process.env.FROM_EMAIL,   // Your verified sender email address
            subject: `New Contact Form Submission from ${data.name}`,
            html: `
                <div style="font-family: sans-serif; font-size: 16px; color: #333;">
                    <h2>New Inquiry from your Website</h2>
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                    <hr>
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap;">${data.message}</p>
                    <hr>
                </div>
            `,
        };

        // Send the email using SendGrid
        await sgMail.send(msg);

        // Return a success response to the frontend
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Message sent successfully!' })
        };

    } catch (error) {
        console.error('Error sending email:', error);

        // Return an error response to the frontend
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error sending message.', error: error.message })
        };
    }
}; 