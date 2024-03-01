<script lang="ts">
	import axios from 'axios';

	const sendTestEmail = async () => {
		const html = `
		<html>
			<body>
				<h1>This is a glue3 sendgrid email</h1>
				<p>Glue3 is a new web framework designed to simplify web development for developers. It aims to provide a faster and more efficient way to build web applications with ease. This open-source framework is written in the Go programming language and offers a wide range of features, including routing, middleware, and</p>
				<p>This email proves that your glue3 app was integrated to send notifications.</p>
				<p>If you think this is a mistake please contact support.</p>
				<p>Glue3 is a new web framework designed to simplify web development for developers. It aims to provide a faster and more efficient way to build web applications with ease. This open-source framework is written in the Go programming language and offers a wide range of features, including routing, middleware, and request handling. With its intuitive and minimalist design, Glue3 provides developers with a flexible and customizable environment to build web applications. It also boasts a strong focus on security, making it an ideal choice for developers who prioritize protecting their applications and users' data. Overall, Glue3 is a promising new entrant in the web development space that offers a fresh approach to building web applications.</p>
			</body>
		</html>
		`;
		const res = await axios.post('/api/email', {
			to: 'jj534@cornell.edu',
			subject: '[glue3] proof of integration',
			html
		});
		console.log('res', res);
	};
</script>

<button class="btn-primary btn" on:click={sendTestEmail}>Send test email</button>
