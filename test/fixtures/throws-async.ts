export async function throwsAsync<ThrownError extends Error>(promise: PromiseLike<any>): Promise<ThrownError> {
	try {
		return await promise;
	} catch (error) {
		return error;
	}
}
