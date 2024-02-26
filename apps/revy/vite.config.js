import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
    plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "revy-gk",
            project: "javascript-sveltekit"
        }
    }), sveltekit()]
};

export default config;