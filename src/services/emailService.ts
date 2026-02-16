import emailjs from '@emailjs/browser';

// Keys - Ideally these should be in .env, but for simplicity we'll keep them here with placeholders
// User needs to replace these with their actual EmailJS credentials
export const EMAILJS_CONFIG = {
    SERVICE_ID: 'YOUR_SERVICE_ID', // e.g., service_xg45h2
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // e.g., template_845g23
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY',   // e.g., user_84572057209
};

export interface EmailData {
    to_name: string;
    to_email: string;
    complaint_id: string;
    complaint_title: string;
    complaint_status: string;
    message?: string;
}

export const emailService = {
    sendComplaintConfirmation: async (data: EmailData) => {
        try {
            // Check if config is set
            if (EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID') {
                console.warn("EmailJS not configured. Skipping email send.");
                return { status: 'mocked', text: 'EmailJS not configured' };
            }

            const templateParams = {
                to_name: data.to_name,
                to_email: data.to_email,
                complaint_id: data.complaint_id,
                complaint_title: data.complaint_title,
                complaint_status: data.complaint_status,
                message: `Your complaint "${data.complaint_title}" has been successfully registered with ID: ${data.complaint_id}. We will keep you updated on its status.`,
            };

            const response = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams,
                EMAILJS_CONFIG.PUBLIC_KEY
            );

            console.log('SUCCESS!', response.status, response.text);
            return response;
        } catch (error) {
            console.error('FAILED...', error);
            throw error;
        }
    }, // Removed the extra '}' here
    sendBroadcast: async (recipients: { name: string; email: string }[], subject: string, message: string) => {
        try {
            if (EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID') {
                console.warn("EmailJS not configured. Skipping broadcast.");
                return { status: 'mocked', text: 'EmailJS not configured' };
            }

            // EmailJS doesn't support batch sending in free tier easily without loop
            // We'll loop through recipients. In production, this should be handled by backend.
            const promises = recipients.map(recipient => {
                if (!recipient.email) return Promise.resolve();

                return emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID, // We might need a generic template for this
                    {
                        to_name: recipient.name,
                        to_email: recipient.email,
                        complaint_title: subject, // Reusing template variable
                        message: message,
                        complaint_id: 'BROADCAST',
                        complaint_status: 'INFO'
                    },
                    EMAILJS_CONFIG.PUBLIC_KEY
                );
            });

            const results = await Promise.all(promises);
            console.log('Broadcast Sent!', results);
            return results;
        } catch (error) {
            console.error('Broadcast Failed...', error);
            throw error;
        }
    }
};
