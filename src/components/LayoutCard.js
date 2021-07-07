import { Card } from 'react-bootstrap';
function linesToParagraphs(lines) {
	return lines.split('\n').map(text => (
		<>
			{text}
			<br />
		</>
	));
}
export default function LayoutCard({ title, text }) {
	console.log(text);
	return (
		<Card className='layout-card'>
			<Card.Title>{title}</Card.Title>
			<Card.Text>
				{text === undefined ? '' : linesToParagraphs(text)}
			</Card.Text>
		</Card>
	);
}
