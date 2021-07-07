import useGoogleSheets from 'use-google-sheets';

require('dotenv').config();

export default function Reviewer() {
	const { data, loading, error } = useGoogleSheets({
		apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
		sheetId: '1mAk682d8dRMqzRg-w9PUPa4XTRjphMc3w4CdkVRAofc',
	});

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error!</div>;
	}

	return <div>{JSON.stringify(data)}</div>;
}
