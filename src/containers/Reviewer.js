import { Button, Modal, Container, Row, Col, Spinner } from 'react-bootstrap';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import React, { useState, useEffect } from 'react';
import LayoutCard from '../components/LayoutCard';
import { useHistory } from 'react-router';
import RowSelector from '../components/RowSelector';
import ScoreButtons from '../components/ScoreButtons';
import '../Reviewer.css';

export default function Reviewer({ config }) {
	const history = useHistory();

	const [layout, setLayout] = useState({});
	const [scoreButton, setScoreButton] = useState([]);
	const [rows, setRows] = useState([]);

	const [loading, setLoading] = useState(true);
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState({
		type: '',
		title: '',
		body: '',
	});

	const [currentRowIndex, setCurrentRowIndex] = useState(0);

	useEffect(() => {
		const initialize = async () => {
			try {
				// Parse
				const { layout, sheetIndex, scoreButton, sheetId } =
					JSON.parse(config);

				if (
					!(
						layout &&
						scoreButton &&
						sheetId &&
						sheetIndex !== undefined
					)
				)
					throw new SyntaxError('Wrong format');

				// Fetch
				const doc = new GoogleSpreadsheet(sheetId);
				await doc.useServiceAccountAuth({
					private_key: process.env.REACT_APP_PRIVATE_KEY.replace(
						/\\n/g,
						'\n'
					),
					client_email: process.env.REACT_APP_CLIENT_EMAIL,
				});
				await doc.loadInfo();

				// Update States
				setLayout(layout);
				setScoreButton(scoreButton);
				setRows(
					await (
						await doc.sheetsByIndex[sheetIndex].getRows()
					).filter(item => item !== undefined)
				);

				setLoading(false);

				// setError(true);
				// setErrorMessage({
				// 	type: 'FETCH',
				// 	title: '😕 There are some problem with your spreadsheet...',
				// 	body: e.message,
				// });
			} catch (e) {
				console.log(e);
				if (e instanceof SyntaxError) {
					setShowError(true);
					setErrorMessage({
						title: '😕 Incorrect configuration format...',
						body: 'Your configuration format seems to be incorrect. Check again then re-enter it from home page.',
					});
				} else {
					setShowError(true);
					setErrorMessage({
						type: 'FETCH',
						title: '😕 Error fetching the spreadsheet...',
						body: e.message,
					});
				}
			}
		};
		initialize();
	}, [config]);

	const errorFooter = type => {
		switch (type) {
			case 'PARSE':
				return (
					<Modal.Footer>
						<Button variant='danger' disabled>
							{/*TODO*/}
							Report a problem
						</Button>
						<Button
							onClick={() => {
								setShowError(false);
								history.push('/');
							}}
						>
							Back to home page
						</Button>
					</Modal.Footer>
				);
			case 'FETCH': {
				return (
					<Modal.Footer>
						<Button variant='danger' disabled>
							{/*TODO*/}
							Report a problem
						</Button>
						<Button
							onClick={() => {
								setShowError(false);
								history.push('/');
							}}
						>
							Back to home page
						</Button>
					</Modal.Footer>
				);
			}
			case 'SHEET': {
				return (
					<Modal.Footer>
						<Button variant='danger' disabled>
							{/*TODO*/}
							Report a problem
						</Button>
						<Button
							onClick={() => {
								setShowError(false);
								history.push('/');
							}}
						>
							Back to home page
						</Button>
					</Modal.Footer>
				);
			}
			default: {
				return <></>;
			}
		}
	};

	const onScore = async (newScore, column) => {
		const newRowValue = rows[currentRowIndex];
		newRowValue[column] = newScore;
		setRows(
			rows.map((item, index) =>
				index === currentRowIndex ? newRowValue : item
			)
		);
		await rows[currentRowIndex].save();
	};

	return (
		<>
			<Modal show={showError}>
				<Modal.Header>
					<Modal.Title>{errorMessage.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{errorMessage.body}</Modal.Body>
				{errorFooter(errorMessage.type)}
			</Modal>
			{loading && (
				<div className='loading'>
					<Spinner animation='border' show={loading} />{' '}
					<span>
						<br></br>Fetching spreadsheet...
					</span>
				</div>
			)}
			{!loading && !showError && (
				<Container className='layout'>
					<RowSelector
						currentRowIndex={currentRowIndex}
						setCurrentRowIndex={setCurrentRowIndex}
						numberRows={rows ? rows.length : 0}
					/>
					{scoreButton.map(
						({ type, tag, lower, upper, sheetColumn }, index) => (
							<Row>
								<ScoreButtons
									type={type}
									tag={tag}
									rangeLower={lower}
									rangeUpper={upper}
									onScore={newScore =>
										onScore(newScore, sheetColumn)
									}
									currentScore={
										type === 'Number'
											? Number(
													rows[currentRowIndex][
														sheetColumn
													]
											  )
											: rows[currentRowIndex][sheetColumn]
									}
								/>
							</Row>
						)
					)}
					<Container style={{ width: '70%' }}>
						{layout.map((row, rowIndex) => (
							<Row>
								{row.map((col, colIndex) => (
									<Col>
										<LayoutCard
											title={col}
											text={rows[currentRowIndex][col]}
										/>
									</Col>
								))}
							</Row>
						))}
					</Container>
				</Container>
			)}
		</>
	);
}
