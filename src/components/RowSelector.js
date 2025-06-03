import { Row, Col, Button, ButtonGroup } from "react-bootstrap";

export default function RowSelector({
  currentRowIndex,
  setCurrentRowIndex,
  numberRows,
  minRowIndex = 0,
  maxRowIndex = null,
}) {
  // Calculate the effective max index
  const effectiveMax = maxRowIndex !== null ? maxRowIndex : numberRows - 1;

  return (
    <Row className="row-selector">
      <Col>
        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={() =>
              setCurrentRowIndex(Math.max(currentRowIndex - 100, minRowIndex))
            }
            disabled={currentRowIndex - 100 < minRowIndex}
          >
            ⏪ 100
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              setCurrentRowIndex(Math.max(currentRowIndex - 10, minRowIndex))
            }
            disabled={currentRowIndex - 10 < minRowIndex}
          >
            ⏪ 10
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              setCurrentRowIndex(Math.max(currentRowIndex - 1, minRowIndex))
            }
            disabled={currentRowIndex - 1 < minRowIndex}
          >
            Prev
          </Button>
        </ButtonGroup>
      </Col>
      <Col>
        <h4>
          Row #{currentRowIndex + 1 - minRowIndex} of{" "}
          {effectiveMax + 1 - minRowIndex}
        </h4>
      </Col>
      <Col>
        <ButtonGroup>
          <Button
            variant="primary"
            onClick={() =>
              setCurrentRowIndex(Math.min(currentRowIndex + 1, effectiveMax))
            }
            disabled={currentRowIndex + 1 > effectiveMax}
          >
            Next
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              setCurrentRowIndex(Math.min(currentRowIndex + 10, effectiveMax))
            }
            disabled={currentRowIndex + 10 > effectiveMax}
          >
            10 ⏩
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              setCurrentRowIndex(Math.min(currentRowIndex + 100, effectiveMax))
            }
            disabled={currentRowIndex + 100 > effectiveMax}
          >
            100 ⏩
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  );
}
