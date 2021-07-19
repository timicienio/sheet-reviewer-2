import React from 'react';
import { Row, Col, Dropdown, Button, ButtonGroup, Card } from 'react-bootstrap';
import LayoutCard from './LayoutCard';
import LayoutCardConfigurable from './LayoutCardConfigurable';

export default function ReviewerLayout({ layout }) {
	return (
		<>
			{layout.map((row, rowIndex) => (
				<Row>
					{row.map((col, colIndex) => (
						<Col>
							{col === '' ? (
								<Card>
									<Dropdown>
										<Dropdown.Toggle variant='secondary'>
											Select a sheet column to display
											here...
										</Dropdown.Toggle>
										<Dropdown.Menu>
											{sheetColumns.map((item, index) => (
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
											))}
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
		</>
	);
}
