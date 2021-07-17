import { Row, Container, Form } from 'react-bootstrap';

export default function DoneConfigure({ config }) {
	return (
		<Container className='layout'>
			<Row>
				<h3>Step 4: Done!</h3>
				<span>
					Copy the reviewer configuration, paste it on the Sheet
					Reviewer 2.0 home page ("Use existing configuration"), and
					start reviewing!
				</span>

				<span>
					You can share this configuration with trusted person.{' '}
				</span>
			</Row>
			<Row>
				<Form>
					<Form.Control
						value={JSON.stringify(config)}
						as='textarea'
						rows={5}
					></Form.Control>
				</Form>
			</Row>
		</Container>
	);
}
