import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { Twemoji } from 'react-emoji-render';

export default function RowSelector({
	currentRowIndex,
	setCurrentRowIndex,
	numberRows,
}) {
	return (
		<Row>
			<Col>
				<ButtonGroup>
					<Button
						variant='secondary'
						onClick={() =>
							setCurrentRowIndex(currentRowIndex - 100)
						}
						disabled={currentRowIndex - 100 < 0}
					>
						<Twemoji text='⏪ 100' />
					</Button>
					<Button
						variant='secondary'
						onClick={() => setCurrentRowIndex(currentRowIndex - 10)}
						disabled={currentRowIndex - 10 < 0}
					>
						<Twemoji text='⏪ 10' />
					</Button>
					<Button
						variant='primary'
						onClick={() => setCurrentRowIndex(currentRowIndex - 1)}
						disabled={currentRowIndex - 1 < 0}
					>
						Prev
					</Button>
				</ButtonGroup>
			</Col>
			<Col xs={4}>
				<h4>
					Row #{currentRowIndex + 1} of {numberRows}
				</h4>
			</Col>
			<Col>
				<ButtonGroup>
					<Button
						variant='primary'
						onClick={() => setCurrentRowIndex(currentRowIndex + 1)}
						disabled={currentRowIndex + 1 >= numberRows}
					>
						Next
					</Button>

					<Button
						variant='secondary'
						onClick={() => setCurrentRowIndex(currentRowIndex + 10)}
						disabled={currentRowIndex + 10 >= numberRows}
					>
						<Twemoji text='10 ⏩' />
					</Button>

					<Button
						variant='secondary'
						onClick={() =>
							setCurrentRowIndex(currentRowIndex + 100)
						}
						disabled={currentRowIndex + 100 >= numberRows}
					>
						<Twemoji text='100 ⏩' />
					</Button>
				</ButtonGroup>
			</Col>
		</Row>
	);
}
