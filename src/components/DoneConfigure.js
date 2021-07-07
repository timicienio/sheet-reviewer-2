import { useState } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';

export default function DoneConfigure({ config }) {
	return (
		<Container className='layout'>
			<Row>
				<h3>Step 4: Done!</h3>
				<span>
					Copy the configuration, paste it on the Sheet Reviewer 2.0
					home page, and start reviewing!
				</span>

				<span>
					You can share this configuration with trusted person.{' '}
				</span>
			</Row>
			<Row>
				<Card>
					<Card.Body>{JSON.stringify(config)} </Card.Body>
				</Card>
			</Row>
		</Container>
	);
}
