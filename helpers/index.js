module.exports = {

	allowCors(callback) {
		return async (httpRequest, httpResponse) => {
			httpResponse.setHeader('Access-Control-Allow-Credentials', true);
			httpResponse.setHeader('Access-Control-Allow-Origin', '*');
			httpResponse.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELTE,OPTIONS');
			httpResponse.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
			if (httpRequest.method === 'OPTIONS') {
				return httpResponse.status(200).end();
			}
			return await callback(httpRequest, httpResponse);
		};
	}

};