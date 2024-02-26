import PocketBase from 'pocketbase';
import { json } from '@sveltejs/kit';
import { RESEND_API_KEY, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PWD } from '$env/static/private';
import { dev } from '$app/environment';
import { POCKETBASE_URL, pb } from '$lib/glue/pocketbase';
import { Resend } from 'resend';
import BookingStateChange from '$lib/emails/BookingStateChange.svelte';
import { render } from 'svelte-email';
import BookingCreate from '$lib/emails/BookingCreate.svelte';
import ChatMessage from '$lib/emails/ChatMessage.svelte';

const resend = new Resend(RESEND_API_KEY);

const VARIANT_TO_TEMPLATE = {
	BOOKING_STATE_CHANGE: BookingStateChange,
	BOOKING_CREATE: BookingCreate,
	CHAT_MESSAGE: ChatMessage
};

const getRawSubject = ({ variant, templateProps }) => {
	switch (variant) {
		case 'BOOKING_STATE_CHANGE': {
			return `[REVY] ${templateProps?.driverName} has ${templateProps?.newState} your carpool reservation`;
		}
		case 'BOOKING_CREATE': {
			return `[Action requested] Approve or decline ${templateProps?.requestorName}'s carpool reservation`;
		}
		case 'CHAT_MESSAGE': {
			return `[REVY] ${templateProps?.senderName} sent you a new message`;
		}
		default: {
			return '';
		}
	}
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { variant, templateProps, receiverId } = await request.json();

	try {
		const pbAdmin = new PocketBase(POCKETBASE_URL);
		await pbAdmin.admins.authWithPassword(POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PWD);
		await pbAdmin.collection('users').update(receiverId, {
			emailVisibility: true
		});

		const receiver = await pb.collection('users').getOne(receiverId);

		await pbAdmin.collection('users').update(receiverId, {
			emailVisibility: false
		});

		const html = await render({
			template: VARIANT_TO_TEMPLATE[variant],
			props: templateProps
		});

		const rawSubject = getRawSubject({ variant, templateProps });
		const emailParams = {
			to: dev ? 'jj534@cornell.edu' : receiver?.email,
			from: 'contact@revycarpool.com',
			subject: dev ? `intended: ${receiver?.email} ${rawSubject}` : rawSubject,
			html
		};

		const result = await resend.emails.send(emailParams);

		if (!dev) {
			await pb.collection('logs').create({
				variant: 'email-send',
				context: {
					variant,
					templateProps,
					receiverId,
					emailParams,
					result
				}
			});
		}

		return json({
			isSent: true
		});
	} catch (error) {
		if (!dev && error?.status !== 404) {
			await pb.collection('logs').create({
				variant: 'email-fail',
				context: {
					variant,
					templateProps,
					receiverId,
					error
				}
			});
		}
		return json({
			isSent: false
		});
	}
}
