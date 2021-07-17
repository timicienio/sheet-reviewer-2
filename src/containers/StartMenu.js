import { Card, Col, Row, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router';

export default function StartMenu() {
	const history = useHistory();
	return (
		<Row className='start-menu'>
			<Col>
				<Card className='start-menu-card'>
					<Card.Body className='start-menu-card-body'>
						<Card.Title>
							✨ Create new reviewer configuration
						</Card.Title>
						<Card.Subtitle className='mb-2 text-muted'>
							<p>
								Start with a new set of Google Sheet id, layout,
								and scoring method.
							</p>
						</Card.Subtitle>
						<Button
							variant='primary'
							onClick={() => {
								history.push('./configure');
							}}
						>
							Start
						</Button>
					</Card.Body>
				</Card>
			</Col>
			<Col>
				<Card className='start-menu-card'>
					<Card.Body className='start-menu-card-body'>
						<Card.Title>
							🎛 Use existing reviewer configuration
						</Card.Title>
						<Card.Subtitle className='mb-2 text-muted'>
							Start by pasting your reviewer configuration here.
						</Card.Subtitle>
						<Form>
							<Form.Group>
								<Form.Control
									// type='email'
									placeholder='Paste configuration (in JSON format)'
									as='textarea'
									rows={3}
								/>
							</Form.Group>
						</Form>
						<Button variant='primary'>Submit</Button>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	);
}
