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
import ScoreButtons from './ScoreButtons';
import { useState } from 'react';

export default function ScoreButtonConfigurator({ state, dispatch }) {
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

	return (
		<>
			<Modal show={showEdit}>
				<Modal.Header>
					<Modal.Title>
						Editing sub-score #{editingIndex + 1}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h5>Tag</h5>
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

					{state[editingIndex].type === 'Number' ? (
						<>
							<h5>Number range</h5>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
								}}
							>
								<ButtonGroup>
									<Button
										onClick={() =>
											onChangeRangeLower(
												editingIndex,
												state[editingIndex].lower + 1
											)
										}
										disabled={
											state[editingIndex].upper -
												state[editingIndex].lower ===
											1
										}
									>
										⬆
									</Button>

									<Button
										onClick={() =>
											onChangeRangeLower(
												editingIndex,
												state[editingIndex].lower - 1
											)
										}
										disabled={
											state[editingIndex].upper -
												state[editingIndex].lower >=
											10
										}
									>
										⬇
									</Button>
								</ButtonGroup>{' '}
								<ListGroup horizontal>
									<ListGroup.Item>
										{state[editingIndex].lower}
									</ListGroup.Item>
									<ListGroup.Item> to </ListGroup.Item>
									<ListGroup.Item>
										{state[editingIndex].upper}
									</ListGroup.Item>
								</ListGroup>{' '}
								<ButtonGroup>
									<Button
										onClick={() =>
											onChangeRangeUpper(
												editingIndex,
												state[editingIndex].upper + 1
											)
										}
										disabled={
											state[editingIndex].upper -
												state[editingIndex].lower >=
											10
										}
									>
										⬆
									</Button>
									<Button
										onClick={() =>
											onChangeRangeUpper(
												editingIndex,
												state[editingIndex].upper - 1
											)
										}
										disabled={
											state[editingIndex].upper -
												state[editingIndex].lower ===
											1
										}
									>
										⬇
									</Button>
								</ButtonGroup>{' '}
							</div>
						</>
					) : (
						<></>
					)}
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
									>
										Remove
									</Button>
								</ButtonGroup>
							</Col>
						</Row>
					</>
				))}
				<Row>
					<Button onClick={onAddScore}>+ Add a sub-score</Button>
				</Row>
			</Container>
		</>
	);
}
