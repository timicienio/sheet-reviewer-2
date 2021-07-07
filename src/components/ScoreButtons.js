import { ListGroup } from 'react-bootstrap';

export default function ScoreButton({
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
			);
		case 'Number':
			return (
				<ListGroup horizontal>
					<ListGroup.Item>
						<span>{tag}</span>
					</ListGroup.Item>
					{[...Array(rangeUpper - rangeLower + 1).keys()].map(e => (
						<ListGroup.Item
							as='li'
							onClick={() => onScore(e + rangeLower)}
							active={currentScore === e + rangeLower}
						>
							{String(e + rangeLower)}
						</ListGroup.Item>
					))}
				</ListGroup>
			);
		case 'Text':
			return (
				<ListGroup horizontal>
					<ListGroup.Item>
						<span>{tag}</span>
					</ListGroup.Item>
				</ListGroup>
			);

		default:
			return <></>;
	}
}
