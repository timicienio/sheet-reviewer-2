import React from 'react';
import { Modal } from 'react-bootstrap';

export default function InfoPopUp({ show, onHide, version }) {
	return (
		<Modal className='info-popup' show={show} onHide={onHide}>
			<Modal.Header>
				<Modal.Title>👓 Sheet Reviewer 2 </Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>Version {version}</p>
				<p>{'Fine work by timicienio.'}</p>
				<p>
					<a href='https://github.com/timicienio'>
						timicienio@github
					</a>
				</p>
			</Modal.Body>
		</Modal>
	);
}
