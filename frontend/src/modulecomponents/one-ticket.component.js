import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";

import { Button, Card, Row, Col } from "react-bootstrap";

const Ticket = ({
  ticketData,
  serverChange,
  removeOneTicket,
  replaceTicketchange,
}) => {
  return (
    <div className="card-container">
      <Card className="mb-3 p-3">
        <Row>
          <Col xs={12} md={2} className="mb-2">
            <strong>Dish:</strong> {ticketData !== undefined && ticketData.item}
          </Col>
          <Col xs={12} md={2} className="mb-2">
            <strong>Server:</strong>{" "}
            {ticketData !== undefined && ticketData.attendant}
          </Col>
          <Col xs={12} md={1} className="mb-2">
            <strong>Table:</strong>{" "}
            {ticketData !== undefined && ticketData.table}
          </Col>
          <Col xs={12} md={1} className="mb-2">
            <strong>Price:</strong> $
            {ticketData !== undefined && ticketData.itemprice}
          </Col>
          <Col xs={12} md={2} className="mb-2">
            <Button
              className="custom-button2"
              onClick={() => removeOneTicket(ticketData._id)}
            >
              Delete Order
            </Button>
          </Col>
          <Col xs={12} md={2} className="mb-2">
            <Button className="custom-button2" onClick={() => replaceWaiter()}>
              Change Waiter
            </Button>
          </Col>
          <Col xs={12} md={2} className="mb-2">
            <Button className="custom-button2" onClick={() => replaceTicket()}>
              Change Order
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );

  function replaceWaiter() {
    console.log(ticketData);

    serverChange({
      change: true,
      id: ticketData._id,
    });
  }

  function replaceTicket() {
    replaceTicketchange({
      change: true,
      id: ticketData._id,
    });
  }
};

export default Ticket;
