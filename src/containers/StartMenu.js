import { Card, Col, Row, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router';

export default function StartMenu({ config, setConfig }) {
	const history = useHistory();

	return (
		<Row className='start-menu'>
			<Col className='start-menu-col'>
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
			<Col className='start-menu-col'>
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
									value={config}
									onChange={e => setConfig(e.target.value)}
									rows={3}
								/>
							</Form.Group>
						</Form>
						<Button
							variant='primary'
							onClick={() => history.push('/reviewer')}
						>
							Submit
						</Button>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	);
}
