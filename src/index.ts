import { Hono } from 'hono';

type Bindings = {
	CLOUDFLARE_API_TOKEN: string;
	ZONEID: string;
	ACCOUNTID: string;
	IPTOBLOCK: string;
};

type filterType = {
	result: [
		{
			id: string;
			expression: string;
			paused: boolean;
		}
	];
	success: boolean;
	errors: [];
	messages: [];
};
const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
	if (!c.env.IPTOBLOCK) {
		return c.text('no IPs provided, update the variable: IPTOBLOCK', 400);
	}

	const ips = c.env.IPTOBLOCK.split(',');
	// test line
	//const ips = '5.5.5.5,6.6.6.6,7.7.7.7'.split(',');
	const base: string = `https://api.cloudflare.com/client/v4/zones/${c.env.ZONEID}`;
	const ruleURL: URL = new URL(base + '/firewall/rules');
	const filterURL: URL = new URL(base + '/filters');
	let conditions: string = '';
	for (const ip of ips) {
		// '(http.x_forwarded_for contains "1.1.1.1") or (http.x_forwarded_for contains "2.2.2.2")';
		if (!conditions) {
			conditions += `(http.x_forwarded_for contains "${ip}")`;
		} else {
			conditions += ` or (http.x_forwarded_for contains "${ip}")`;
		}
	}

	const expressionData = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + c.env.CLOUDFLARE_API_TOKEN,
		},
		body: JSON.stringify([{ expression: conditions }]),
	};
	console.log(expressionData);
	const filterRes = await fetch(filterURL, expressionData);
	const filterJson: filterType = await filterRes.json();

	const rules = [
		{
			filter: {
				id: filterJson.result[0].id,
			},
			action: 'block',
			description: 'BLOCK XFF IPS created by Workers',
		},
	];
	const ruleData = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + c.env.CLOUDFLARE_API_TOKEN,
		},
		body: JSON.stringify(rules),
	};
	return fetch(ruleURL, ruleData);
});

app.get('/filters/:id?', async (c) => {
	const header = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + c.env.CLOUDFLARE_API_TOKEN,
		},
	};
	const base: string = `https://api.cloudflare.com/client/v4/zones/${c.env.ZONEID}`;
	let url: URL;
	const id = c.req.param('id');
	if (!id) {
		url = new URL(base + `/filters`);
	} else {
		url = new URL(base + `/filters/${id}`);
	}
	return fetch(url, header);
});

app.get('/rules/:id?', async (c) => {
	const header = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + c.env.CLOUDFLARE_API_TOKEN,
		},
	};
	const base: string = `https://api.cloudflare.com/client/v4/zones/${c.env.ZONEID}`;
	let url: URL;
	const id = c.req.param('id');
	if (!id) {
		url = new URL(base + `/firewall/rules`);
	} else {
		url = new URL(base + `/firewall/rules/${id}`);
	}
	return fetch(url, header);
});

export default app;
