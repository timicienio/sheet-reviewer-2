import { Button, Card } from 'react-bootstrap';
function linesToParagraphs(lines) {
	return lines.split('\n').map(text => (
		<>
			{text}
			<br />
		</>
	));
}
export default function LayoutCardConfigurable({
	title,
	text,
	onDelete,
	deleteDisabled,
}) {
	return (
		<>
			<Card className='layout-card'>
				<Card.Body>
					<Card.Title>{title}</Card.Title>
					<Card.Text>
						{text === undefined ? '' : linesToParagraphs(text)}
					</Card.Text>

					<Button
						variant='danger'
						onClick={() => onDelete()}
						disabled={deleteDisabled}
					>
						Delete Cell
					</Button>
				</Card.Body>
			</Card>
		</>
	);
}
