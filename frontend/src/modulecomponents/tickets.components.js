import React, { useState, useEffect } from "react";

import axios from "axios";

import { Button, Form, Container, Modal } from "react-bootstrap";

import Ticket from "./one-ticket.component";
import "./tickets.css";
const Tickets = () => {
  const [tickets, TicketSets] = useState([]);
  const [refreshData, setRefreshData] = useState(false);

  const [ticketChange, replaceTicketchange] = useState({
    change: false,
    id: 0,
  });
  const [changeWaiter, serverChange] = useState({ change: false, id: 0 });
  const [newWaiterName, setNewWaiterName] = useState("");

  const [ticketAdd, TicketSet] = useState(false);
  const [newTicket, TicketNew] = useState({
    Item: "",
    "Attendant ": "",
    Table: 0,
    itemprice: 0,
  });

  //gets run at initial loadup
  useEffect(() => {
    getAllTickets();
  }, []);

  //refreshes the page
  if (refreshData) {
    setRefreshData(false);
    getAllTickets();
  }

  return (
    <div>
      <div className="tickets-container">
        {/* add new order button */}
        <Container className="text-center mt-4">
          <Button onClick={() => TicketSet(true)} className="custom-button">
            Create New Order
          </Button>
        </Container>

        {/* list all current orders */}
        <Container className="mt-4">
          {tickets != null &&
            tickets.map((ticket, i) => (
              <Ticket
                key={i}
                ticketData={ticket}
                removeOneTicket={removeOneTicket}
                serverChange={serverChange}
                replaceTicketchange={replaceTicketchange}
              />
            ))}
        </Container>

        {/* popup for adding a new order */}
        <Modal
          show={ticketAdd}
          onHide={() => TicketSet(false)}
          centered
          className="custom-modal4"
        >
          <Modal.Header closeButton className="custom-modal-header">
            <Modal.Title>NEW ORDER</Modal.Title>
          </Modal.Header>

          <Modal.Body className="custom-modal-body">
            <Form.Group>
              <Form.Label>ITEM NAME</Form.Label>
              <Form.Control
                onChange={(event) => {
                  newTicket.Item = event.target.value;
                }}
              />
              <Form.Label>ATTENDANT</Form.Label>
              <Form.Control
                onChange={(event) => {
                  newTicket.Attendant = event.target.value;
                }}
              />
              <Form.Label>TABLE NO</Form.Label>
              <Form.Control
                onChange={(event) => {
                  newTicket.Table = event.target.value;
                }}
              />
              <Form.Label>PRICE</Form.Label>
              <Form.Control
                type="number"
                onChange={(event) => {
                  newTicket.itemprice = event.target.value;
                }}
              />
            </Form.Group>
            <Button onClick={() => TicketAddOne()} className="custom-button3">
              Add
            </Button>
            <Button onClick={() => TicketSet(false)} className="custom-button3">
              Cancel
            </Button>
          </Modal.Body>
        </Modal>

        {/* popup for changing a waiter */}
        <Modal
          show={changeWaiter.change}
          onHide={() => serverChange({ change: false, id: 0 })}
          centered
          className="custom-modal4"
        >
          <Modal.Header closeButton className="custom-modal-header">
            <Modal.Title>CHANGE ATTENDANT</Modal.Title>
          </Modal.Header>

          <Modal.Body className="custom-modal-body">
            <Form.Group>
              <Form.Label>NEW ATTENDANT</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setNewWaiterName(event.target.value);
                }}
              />
            </Form.Group>
            <Button
              onClick={() => attendantchangeforTicket()}
              className="custom-button3"
            >
              Change
            </Button>
            <Button
              onClick={() => serverChange({ change: false, id: 0 })}
              className="custom-button3"
            >
              Cancel
            </Button>
          </Modal.Body>
        </Modal>

        {/* popup for changing an order */}
        <Modal
          className="custom-modal4"
          show={ticketChange.change}
          onHide={() => replaceTicketchange({ change: false, id: 0 })}
          centered
        >
          <Modal.Header closeButton className="custom-modal-header">
            <Modal.Title>CHANGE ITEM</Modal.Title>
          </Modal.Header>

          <Modal.Body className="custom-modal-body">
            <Form.Group>
              <Form.Label>ITEM NAME</Form.Label>
              <Form.Control
                onChange={(event) => {
                  newTicket.Item = event.target.value;
                }}
              />
              <Form.Label>ATTENDANT</Form.Label>
              <Form.Control
                onChange={(event) => {
                  newTicket.Attendant = event.target.value;
                }}
              />
              <Form.Label>TABLE NO</Form.Label>
              <Form.Control
                onChange={(event) => {
                  newTicket.Table = event.target.value;
                }}
              />
              <Form.Label>PRICE</Form.Label>
              <Form.Control
                type="number"
                onChange={(event) => {
                  newTicket.itemprice = parseFloat(event.target.value);
                }}
              />
            </Form.Group>
            <Button
              onClick={() => changeSingleOrder()}
              className="custom-button3"
            >
              CHANGE
            </Button>
            <Button
              onClick={() => replaceTicketchange({ change: false, id: 0 })}
              className="custom-button3"
            >
              CANCEL
            </Button>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );

  //changes the waiter
  function attendantchangeforTicket() {
    changeWaiter.change = false;
    var url = "http://localhost:5000/attendant/edit/" + changeWaiter.id;
    axios
      .put(url, {
        Attendant: newWaiterName,
      })
      .then((response) => {
        console.log(response.status);
        if (response.status == 200) {
          setRefreshData(true);
        }
      });
  }

  //changes the order
  function changeSingleOrder() {
    ticketChange.change = false;
    var url = "http://localhost:5000/ticket/edit/" + ticketChange.id;
    axios.put(url, newTicket).then((response) => {
      if (response.status == 200) {
        setRefreshData(true);
      }
    });
  }

  //creates a new order
  function TicketAddOne() {
    TicketSet(false);
    var url = "http://localhost:5000/ticket/new";
    axios
      .post(url, {
        Attendant: newTicket.Attendant,
        Item: newTicket.Item,
        Table: newTicket.Table,
        itemprice: parseFloat(newTicket.itemprice),
      })
      .then((response) => {
        if (response.status == 200) {
          setRefreshData(true);
        }
      });
  }

  //gets all the orders
  function getAllTickets() {
    var url = "http://localhost:5000/tickets";
    axios
      .get(url, {
        responseType: "json",
      })
      .then((response) => {
        if (response.status == 200) {
          TicketSets(response.data);
        }
      });
  }

  //deletes a single order
  function removeOneTicket(id) {
    var url = "http://localhost:5000/ticket/remove/" + id;
    axios.delete(url, {}).then((response) => {
      if (response.status == 200) {
        setRefreshData(true);
      }
    });
  }
};

export default Tickets;
