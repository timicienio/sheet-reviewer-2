import { Button, Card } from "react-bootstrap";

export default function LayoutCardConfigurable({
  title,
  onDelete,
  deleteDisabled,
}) {
  return (
    <>
      <Card className="layout-card">
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          {/* <Card.Text>
						{text === undefined ? '' : linesToParagraphs(text)}
					</Card.Text> */}

          <Button
            variant="danger"
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
