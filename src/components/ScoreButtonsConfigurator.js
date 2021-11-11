import {
	Container,
	Row,
	Col,
	FormControl,
	InputGroup,
	Button,
	ButtonGroup,
	DropdownButton,
	Dropdown,
	Modal,
	ListGroup,
} from 'react-bootstrap';
import { BsInfoCircleFill } from 'react-icons/bs';
import ReactTooltip from 'react-tooltip';
import ScoreButtons from './ScoreButtons';
import { useState } from 'react';

export default function ScoreButtonConfigurator({
	state,
	dispatch,
	sheetColumns,
}) {
	const [currentScores, setCurrentScores] = useState([-9999]);

	const [showEdit, setShowEdit] = useState(false);

	const [editingIndex, setEditingIndex] = useState(0);
	const [editingTagValue, setEditingTagValue] = useState('');

	const onAddScore = () => {
		dispatch({ type: 'ADD_SCORE', payload: {} });
		setCurrentScores(currentScores.concat([-9999]));
	};

	const onChangeType = (index, value) => {
		dispatch({
			type: 'MODIFY_SCORE',
			payload: { index: index, key: 'type', value: value },
		});
	};

	const onChangeRangeLower = (index, value) => {
		dispatch({
			type: 'MODIFY_SCORE',
			payload: { index: index, key: 'lower', value: value },
		});
	};

	const onChangeRangeUpper = (index, value) => {
		dispatch({
			type: 'MODIFY_SCORE',
			payload: { index: index, key: 'upper', value: value },
		});
	};

	const onChangeTag = (index, value) => {
		dispatch({
			type: 'MODIFY_SCORE',
			payload: { index: index, key: 'tag', value: value },
		});
	};

	const onChangeSheetColumn = (index, value) => {
		dispatch({
			type: 'MODIFY_SCORE',
			payload: { index: index, key: 'sheetColumn', value: value },
		});
	};

	const onRemoveScore = index => {
		dispatch({ type: 'DELETE_SCORE', payload: { index: index } });
	};

	return (
		<>
			<Modal show={showEdit}>
				<Modal.Header>
					<Modal.Title>
						Editing sub-score #{editingIndex + 1}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h5>
						Label{' '}
						<BsInfoCircleFill
							data-tip
							data-for='label-tooltip'
							style={{ fontSize: '0.8rem' }}
						/>
						<ReactTooltip id='label-tooltip'>
							<span>Name of the sub-score</span>
						</ReactTooltip>
					</h5>

					<InputGroup className='mb-3'>
						<FormControl
							placeholder="Recipient's username"
							value={editingTagValue}
							onChange={e => setEditingTagValue(e.target.value)}
						/>
						<InputGroup.Append>
							<Button
								onClick={() =>
									onChangeTag(editingIndex, editingTagValue)
								}
							>
								Save
							</Button>
						</InputGroup.Append>
					</InputGroup>

					{state[editingIndex]?.type === 'Number' && (
						<>
							<h5>
								Number range{' '}
								<BsInfoCircleFill
									data-tip
									data-for='range-tooltip'
									style={{ fontSize: '0.8rem' }}
								/>
								<ReactTooltip id='range-tooltip'>
									<span>
										Max. and min. value of number score;
										largest range: 10
									</span>
								</ReactTooltip>
							</h5>

							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									marginBottom: '20px',
								}}
							>
								<ButtonGroup>
									<Button
										onClick={() =>
											onChangeRangeLower(
												editingIndex,
												state[editingIndex]?.lower + 1
											)
										}
										disabled={
											state[editingIndex]?.upper -
												state[editingIndex]?.lower ===
											1
										}
									>
										⬆
									</Button>

									<Button
										onClick={() =>
											onChangeRangeLower(
												editingIndex,
												state[editingIndex]?.lower - 1
											)
										}
										disabled={
											state[editingIndex]?.upper -
												state[editingIndex]?.lower >=
											10
										}
									>
										⬇
									</Button>
								</ButtonGroup>{' '}
								<ListGroup
									horizontal
									style={{ margin: '0 10px 0 10px' }}
								>
									<ListGroup.Item>
										{state[editingIndex]?.lower}
									</ListGroup.Item>
									<ListGroup.Item> to </ListGroup.Item>
									<ListGroup.Item>
										{state[editingIndex]?.upper}
									</ListGroup.Item>
								</ListGroup>{' '}
								<ButtonGroup>
									<Button
										onClick={() =>
											onChangeRangeUpper(
												editingIndex,
												state[editingIndex]?.upper + 1
											)
										}
										disabled={
											state[editingIndex]?.upper -
												state[editingIndex]?.lower >=
											10
										}
									>
										⬆
									</Button>
									<Button
										onClick={() =>
											onChangeRangeUpper(
												editingIndex,
												state[editingIndex]?.upper - 1
											)
										}
										disabled={
											state[editingIndex]?.upper -
												state[editingIndex]?.lower ===
											1
										}
									>
										⬇
									</Button>
								</ButtonGroup>{' '}
							</div>
						</>
					)}
					<h5>
						Sheet column{' '}
						<BsInfoCircleFill
							data-tip
							data-for='column-tooltip'
							style={{ fontSize: '0.8rem' }}
						/>
						<ReactTooltip id='column-tooltip'>
							<span>
								The reviewer will post the scores on the
								selected column. Select 'None' if not needed.
							</span>
						</ReactTooltip>
						<Dropdown style={{ marginTop: '10px' }}>
							<Dropdown.Toggle variant='secondary'>
								{state[editingIndex]?.sheetColumn
									? state[editingIndex]?.sheetColumn
									: 'None'}
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item
									onSelect={() =>
										onChangeSheetColumn(editingIndex, null)
									}
								>
									None
								</Dropdown.Item>
								{sheetColumns.map((item, index) => (
									<Dropdown.Item
										onSelect={() =>
											onChangeSheetColumn(
												editingIndex,
												item
											)
										}
									>
										{item}
									</Dropdown.Item>
								))}
							</Dropdown.Menu>
						</Dropdown>
					</h5>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant='success'
						onClick={() => {
							onChangeTag(editingIndex, editingTagValue);
							setShowEdit(false);
						}}
					>
						Done
					</Button>
				</Modal.Footer>
			</Modal>

			<Container className='layout'>
				<Row>
					<h3>🎖 Step 3: Configure scoring methods</h3>
				</Row>
				{state.map(({ type, tag, lower, upper }, index) => (
					<>
						<Row>
							<Col
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
								xs={1}
							>
								<h4>#{index + 1}</h4>
							</Col>
							<Col xs={8}>
								<ScoreButtons
									type={type}
									tag={tag}
									rangeLower={lower}
									rangeUpper={upper}
									onScore={newScore =>
										setCurrentScores(
											currentScores.map(
												(score, scoreIndex) =>
													index === scoreIndex
														? newScore
														: score
											)
										)
									}
									currentScore={currentScores[index]}
								/>
							</Col>

							<Col>
								<ButtonGroup>
									<DropdownButton
										as={ButtonGroup}
										variant={'secondary'}
										title={'Type'}
										onSelect={value =>
											onChangeType(index, value)
										}
									>
										{['Number', 'Yes-no'].map(
											(buttonType, buttonIndex) => (
												<Dropdown.Item
													eventKey={buttonType}
													active={type === buttonType}
												>
													{buttonType}
												</Dropdown.Item>
											)
										)}
									</DropdownButton>
									<Button
										variant='primary'
										onClick={() => {
											setEditingTagValue(tag);
											setEditingIndex(index);
											setShowEdit(true);
										}}
									>
										Edit
									</Button>
									<Button
										variant='danger'
										disabled={currentScores.length === 1}
										onClick={() => {
											onRemoveScore(index);
										}}
									>
										Remove
									</Button>
								</ButtonGroup>
							</Col>
						</Row>
					</>
				))}
				<Row>
					<Button onClick={onAddScore}>+ Add a scoring method</Button>
				</Row>
			</Container>
		</>
	);
}
