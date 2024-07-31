import {
	SENDGRID_API_KEY,
	SENDGRID_VERIFIED_SENDER,
	SUPABSE_SERVICE_ROLE_KEY
} from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import sgMail from '@sendgrid/mail';
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { recipientUserId, ...emailConfig } = await request.json();

	sgMail.setApiKey(SENDGRID_API_KEY);

	if (recipientUserId) {
		const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABSE_SERVICE_ROLE_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		});

		const { data } = await supabase.auth.admin.getUserById(recipientUserId);

		await sgMail.send({
			...emailConfig,
			from: SENDGRID_VERIFIED_SENDER,
			to: data?.user?.email
		});
	} else {
		await sgMail.send({
			...emailConfig,
			from: SENDGRID_VERIFIED_SENDER
		});
	}

	return json({
		isSent: true
	});
}
