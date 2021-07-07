import {
	Modal,
	Alert,
	Col,
	Row,
	Form,
	Button,
	Dropdown,
	Spinner,
} from 'react-bootstrap';
import LayoutConfigurator from '../components/LayoutConfigurator';
import ScoreButtonsConfigurator from '../components/ScoreButtonsConfigurator';
import DoneConfigure from '../components/DoneConfigure';
import { useState, useEffect, useReducer } from 'react';
import useGoogleSheets from 'use-google-sheets';
import { Route, Switch, useHistory } from 'react-router';
export default function Configure() {
	const history = useHistory();
	const [hasError, setHasError] = useState(false);
	const [selectSheet, setSelectSheet] = useState(false);
	const [selectedSheetIndex, setSelectedSheetIndex] = useState(-1);
	const [sheetId, setSheetId] = useState('');
	const [sheetColumns, setSheetColumns] = useState([]);

	const layoutReducer = (state, action) => {
		switch (action.type) {
			case 'ADD_ROW':
				return state.concat([['']]);
			case 'ADD_COLUMN':
				return state.map((row, index) =>
					index === action.payload.rowIndex ? row.concat(['']) : row
				);
			case 'DELETE_ROW':
				return state.filter(
					(item, index) => index !== action.payload.rowIndex
				);
			case 'DELETE_COLUMN':
				return state.map((row, index) =>
					index === action.payload.rowIndex
						? row.filter(
								(col, index) =>
									index !== action.payload.colIndex
						  )
						: row
				);
			case 'MODIFY_CELL':
				return state.map((row, index) =>
					index === action.payload.rowIndex
						? row.map((col, index) =>
								index === action.payload.colIndex
									? action.payload.newValue
									: col
						  )
						: row
				);
			default:
				return state;
		}
	};

	const scoreButtonReducer = (state, action) => {
		switch (action.type) {
			case 'ADD_SCORE':
				return state.concat([
					{
						type: 'Number',
						tag: 'New Sub-score',
						lower: 0,
						upper: 10,
					},
				]);

			case 'MODIFY_SCORE':
				return state.map((item, index) =>
					index === action.payload.index
						? {
								...item,
								[action.payload.key]: action.payload.value,
						  }
						: item
				);
			case 'DELETE_SCORE':
				return state.filter(
					(_, index) => index !== action.payload.index
				);
			default:
				return state;
		}
	};

	const [layoutState, layoutDispatch] = useReducer(layoutReducer, [['']]);
	const [scoreButtonState, scoreButtonDispatch] = useReducer(
		scoreButtonReducer,
		[
			{ type: 'Number', tag: 'Overall Score', lower: 0, upper: 10 },
			// { type: 'number', tag: 'Overall Score', lower: 0, upper: 10 },
		]
	);

	const { data, loading, error } = useGoogleSheets({
		apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
		sheetId: sheetId,
	});

	const onPasteSheetId = e => {
		setSheetId(e.target.value);
		if (error) setHasError(true);
	};

	const onConfirmLayout = () => {
		history.push('/configure/score');
	};

	const onBackFromScore = () => {
		history.push('/configure/layout');
	};

	const onConfirmScore = () => {
		history.push('/configure/done');
	};

	const onBackFromDone = () => {
		history.push('/configure/score');
	};

	const onGoToHome = () => {
		history.push('/start');
	};

	// console.log(layoutState);

	useEffect(() => {
		if (data.length > 1 && selectedSheetIndex === -1) setSelectSheet(true);
	}, [data, selectedSheetIndex]);

	return (
		<>
			<Row>
				<Modal show={error}>
					<Modal.Header>
						<Modal.Title>
							Step 1: Connect to your Google Sheet
						</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Alert key={0} variant='warning' show={hasError}>
							There is an error fetching your sheet - try again!
							<br></br>
							{/* {error.status}: {error.statusText} */}
						</Alert>
						<ol>
							<li>Go to your Google Sheet spreadsheet page</li>
							<li>
								Share it with "Anyone with this link can view"
							</li>
							<li>
								Get "sheet id" from url of the sheet:
								<br></br>
								<code>
									https://docs.google.com/spreadsheets/d/
									<span style={{ fontWeight: 'bold' }}>
										[THIS-IS-THE-SHEET-ID]
									</span>
									/...
								</code>
								<br></br>
								For example, if the spreadsheet url is <br></br>
								<code>
									https://docs.google.com/spreadsheets/d/1mAk682d8dRMqzRg-w9PUPa4XTRjphMc3w4CdkVfdfaas/edit#gid=0
								</code>
								<br></br> then the sheet ID is <br></br>
								<code>
									1mAk682d8dRMqzRg-w9PUPa4XTRjphMc3w4CdkVfdfaas
								</code>
							</li>
							<li>Paste it here</li>
						</ol>
						<Form>
							<Form.Group controlId='formSheetID'>
								<Form.Control
									placeholder='Paste sheet ID'
									value={sheetId}
									onChange={e => onPasteSheetId(e)}
								/>
							</Form.Group>
						</Form>
					</Modal.Body>
				</Modal>

				<Modal show={selectSheet}>
					<Modal.Header>
						<Modal.Title>Select a sheet</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						There are multiple sheets in your spreadsheet. Select
						one to continue.
					</Modal.Body>
					<Modal.Footer>
						<Dropdown>
							<Dropdown.Toggle
								variant='primary'
								id='dropdown-basic'
							>
								{selectedSheetIndex === -1
									? 'Select...'
									: data[selectedSheetIndex].id}
							</Dropdown.Toggle>

							<Dropdown.Menu>
								{data.map((item, index) => (
									<Dropdown.Item
										href={'#/action-' + String(index)}
										onSelect={() => {
											setSelectedSheetIndex(index);
											setSheetColumns(
												Object.keys(data[index].data[0])
											);
											history.push('/configure/layout');
										}}
									>
										{item.id}
									</Dropdown.Item>
								))}
							</Dropdown.Menu>
						</Dropdown>
						<Button
							variant='success'
							disabled={selectedSheetIndex === -1}
							onClick={() => setSelectSheet(false)}
						>
							Continue
						</Button>
					</Modal.Footer>
				</Modal>
				<Col>
					{error ? (
						<></>
					) : loading ? (
						<>
							<Spinner animation='border' show={loading} />{' '}
							<span>
								<br></br>Fetching spreadsheet...
							</span>
						</>
					) : (
						<Switch>
							<Route path='/configure/layout'>
								<>
									<LayoutConfigurator
										state={layoutState}
										dispatch={layoutDispatch}
										sheetColumns={sheetColumns}
										sheet={data[selectedSheetIndex]}
									/>
									<div id='configurator-confirm'>
										<Button
											variant='success'
											disabled={
												// any empty row
												layoutState.reduce(
													(acc, row) =>
														row.reduce(
															(acc, col) =>
																col === '' ||
																acc,
															false
														) || acc,
													false
												)
											}
											onClick={onConfirmLayout}
										>
											Continue
										</Button>
									</div>
								</>
							</Route>
							<Route path='/configure/score'>
								<>
									<ScoreButtonsConfigurator
										state={scoreButtonState}
										dispatch={scoreButtonDispatch}
									/>
									<div id='configurator-confirm'>
										<Button
											variant='secondary'
											onClick={onBackFromScore}
										>
											Previous step
										</Button>{' '}
										<Button
											variant='success'
											onClick={onConfirmScore}
										>
											Next step
										</Button>
									</div>
								</>
							</Route>
							<Route path='/configure/done'>
								<DoneConfigure
									config={{
										sheetId: sheetId,
										scoreButton: scoreButtonState,
										layout: layoutState,
									}}
								></DoneConfigure>
								<div id='configurator-confirm'>
									<Button
										variant='secondary'
										onClick={onBackFromDone}
									>
										Previous step
									</Button>{' '}
									<Button
										variant='success'
										onClick={onGoToHome}
									>
										Back to Home page
									</Button>
								</div>
							</Route>
						</Switch>
					)}
				</Col>
			</Row>
		</>
	);
}
