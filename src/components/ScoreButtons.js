import { ListGroup } from 'react-bootstrap';

export default function ScoreButtons({
	type,
	tag,
	rangeLower,
	rangeUpper,
	currentScore,
	onScore,
}) {
	switch (type) {
		case 'Yes-no':
			return (
				<div className='score-buttons'>
					<ListGroup horizontal>
						<ListGroup.Item>
							<span>{tag}</span>
						</ListGroup.Item>
						<ListGroup.Item
							as='li'
							onClick={() => onScore('Yes')}
							active={currentScore === 'Yes'}
						>
							Yes
						</ListGroup.Item>
						<ListGroup.Item
							as='li'
							onClick={() => onScore('No')}
							active={currentScore === 'No'}
						>
							No
						</ListGroup.Item>
					</ListGroup>
				</div>
			);
		case 'Number':
			return (
				<div className='score-buttons'>
					<ListGroup horizontal>
						<ListGroup.Item>
							<span>{tag}</span>
						</ListGroup.Item>
						{[...Array(rangeUpper - rangeLower + 1).keys()].map(
							e => (
								<ListGroup.Item
									as='li'
									onClick={() => onScore(e + rangeLower)}
									active={currentScore === e + rangeLower}
								>
									{String(e + rangeLower)}
								</ListGroup.Item>
							)
						)}
					</ListGroup>
				</div>
			);
		case 'Text':
			return (
				<div className='score-buttons'>
					<ListGroup horizontal>
						<ListGroup.Item>
							<span>{tag}</span>
						</ListGroup.Item>
					</ListGroup>
				</div>
			);

		default:
			return <></>;
	}
}
