import { useState } from 'react';
import {
	Card,
	Container,
	Row,
	Col,
	Dropdown,
	Button,
	ButtonGroup,
} from 'react-bootstrap';
import LayoutCardConfigurable from './LayoutCardConfigurable';
import RowSelector from './RowSelector';

export default function LayoutConfigurator({
	state,
	dispatch,
	sheetColumns,
	sheet,
}) {
	const onAddRow = () => {
		const payload = {};
		dispatch({ type: 'ADD_ROW', payload: payload });
	};

	const onAddColumn = rowIndex => {
		const payload = { rowIndex: rowIndex };
		console.log(payload);
		dispatch({ type: 'ADD_COLUMN', payload: payload });
	};

	const onDeleteRow = rowIndex => {
		const payload = { rowIndex: rowIndex };
		dispatch({ type: 'DELETE_ROW', payload: payload });
	};

	const onDeleteColumn = (rowIndex, colIndex) => {
		const payload = { rowIndex: rowIndex, colIndex: colIndex };
		dispatch({ type: 'DELETE_COLUMN', payload: payload });
	};

	const onModifyCell = (rowIndex, colIndex, newValue) => {
		const payload = {
			rowIndex: rowIndex,
			colIndex: colIndex,
			newValue: newValue,
		};
		dispatch({ type: 'MODIFY_CELL', payload: payload });
	};

	const [currentRowIndex, setCurrentRowIndex] = useState(0);

	return (
		<>
			<Container className='layout'>
				<Row>
					<h3>Step 2: Configure reviewer layout</h3>
				</Row>
				<RowSelector
					currentRowIndex={currentRowIndex}
					setCurrentRowIndex={setCurrentRowIndex}
					numberRows={sheet ? sheet.data.length : 0}
				/>
				{state.map((row, rowIndex) => (
					<Row>
						{row.map((col, colIndex) => (
							<Col>
								{col === '' ? (
									<Card>
										<Dropdown>
											<Dropdown.Toggle
												variant='secondary'
												id='dropdown-basic'
											>
												Select a sheet column to display
												here...
											</Dropdown.Toggle>
											<Dropdown.Menu>
												{sheetColumns.map(
													(item, index) => (
														<Dropdown.Item
															href={
																'#/sheetColumn-' +
																String(index)
															}
															onSelect={() =>
																onModifyCell(
																	rowIndex,
																	colIndex,
																	item
																)
															}
														>
															{item}
														</Dropdown.Item>
													)
												)}
											</Dropdown.Menu>
										</Dropdown>
									</Card>
								) : (
									<LayoutCardConfigurable
										title={col}
										text={sheet.data[currentRowIndex][col]}
										onDelete={() =>
											onDeleteColumn(rowIndex, colIndex)
										}
										deleteDisabled={row.length === 1}
									/>
								)}
							</Col>
						))}
						<Col xs={2}>
							<ButtonGroup vertical>
								<Button
									onClick={() => onAddColumn(rowIndex)}
									disabled={row.length >= 3}
								>
									+ Add a cell to this row
								</Button>
								<Button
									variant='danger'
									onClick={() => onDeleteRow(rowIndex)}
									disabled={state.length === 1}
								>
									Delete this row
								</Button>
							</ButtonGroup>
						</Col>
					</Row>
				))}
				<Row>
					<Button onClick={onAddRow}>+ Add a row</Button>
				</Row>
			</Container>
		</>
	);
}
