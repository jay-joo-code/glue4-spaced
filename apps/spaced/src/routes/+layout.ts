import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { LayoutLoad } from './$types';
// import type { Database } from '../DatabaseDefinitions';

export const ssr = false;

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createSupabaseLoadClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});

	const fetchSession = async () => {
		const {
			data: { session }
		} = await supabase.auth.getSession();
		return session;
	};

	const fetchProfile = async () => {
		const {
			data: { session }
		} = await supabase.auth.getSession();

		if (!session) return null;

		const { data: profile } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', session?.user?.id)
			.single();

		if (profile) return profile;

		// automatic profile creation with provider data
		switch (session?.user?.app_metadata?.provider) {
			case 'google': {
				const { data: profile } = await supabase
					.from('profiles')
					.insert([
						{
							id: session?.user?.id,
							name: session?.user?.user_metadata?.full_name,
							avatarUrl: session?.user?.user_metadata?.avatar_url
						}
					])
					.select('*')
					.single();

				return profile;
			}

			// TODO: handle more providers

			default: {
				return null;
			}
		}
	};

	return {
		supabase,
		session: fetchSession(),
		profile: fetchProfile()
	};
};
