export const handle = async ({ event, resolve, error }) => {
	console.time('handle');
	const response = await resolve(event);
	console.timeEnd('handle');

	return response;
};
