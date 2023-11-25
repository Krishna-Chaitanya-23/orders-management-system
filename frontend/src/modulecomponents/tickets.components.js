import React, {useState, useEffect} from 'react';

import axios from "axios";

import {Button, Form, Container, Modal } from 'react-bootstrap'

import Ticket from './one-ticket.component';

const Tickets = () => {

    const [tickets, setOrders] = useState([])
    const [refreshData, setRefreshData] = useState(false)

    const [changeOrder, replaceTicketchange] = useState({"change": false, "id": 0})
    const [changeWaiter, serverChange] = useState({"change": false, "id": 0})
    const [newWaiterName, setNewWaiterName] = useState("")

    const [addNewOrder, setAddNewOrder] = useState(false)
    const [newOrder, setNewOrder] = useState({"Item": "", "Attendant ": "", "Table": 0, "itemprice": 0})

    //gets run at initial loadup
    useEffect(() => {
        getAllOrders();
    }, [])

    //refreshes the page
    if(refreshData){
        setRefreshData(false);
        getAllOrders();
    }

    return (
        <div>
            
            {/* add new order button */}
            <Container>
                <Button onClick={() => setAddNewOrder(true)}>Add new order</Button>
            </Container>

            {/* list all current orders */}
            <Container>
                {tickets != null && tickets.map((ticket, i) => (
                    <Ticket ticketData={ticket} removeOneOrder={removeOneOrder} serverChange={serverChange} replaceTicketchange={replaceTicketchange}/>
                ))}
            </Container>
            
            {/* popup for adding a new order */}
            <Modal show={addNewOrder} onHide={() => setAddNewOrder(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Order</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label >dish</Form.Label>
                        <Form.Control onChange={(event) => {newOrder.Item = event.target.value}}/>
                        <Form.Label>waiter</Form.Label>
                        <Form.Control onChange={(event) => {newOrder.Attendant = event.target.value}}/>
                        <Form.Label >table</Form.Label>
                        <Form.Control onChange={(event) => {newOrder.Table = event.target.value}}/>
                        <Form.Label >price</Form.Label>
                        <Form.Control type="number" onChange={(event) => {newOrder.itemprice = event.target.value}}/>
                    </Form.Group>
                    <Button onClick={() => addSingleOrder()}>Add</Button>
                    <Button onClick={() => setAddNewOrder(false)}>Cancel</Button>
                </Modal.Body>
            </Modal>
            
            {/* popup for changing a waiter */}
            <Modal show={changeWaiter.change} onHide={() => serverChange({"change": false, "id": 0})} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Change Waiter</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label >new waiter</Form.Label>
                        <Form.Control onChange={(event) => {setNewWaiterName(event.target.value)}}/>
                    </Form.Group>
                    <Button onClick={() => changeWaiterForOrder()}>Change</Button>
                    <Button onClick={() => serverChange({"change": false, "id": 0})}>Cancel</Button>
                </Modal.Body>
            </Modal>

            {/* popup for changing an order */}
            <Modal show={changeOrder.change} onHide={() => replaceTicketchange({"change": false, "id": 0})} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Change Order</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label >dish</Form.Label>
                        <Form.Control onChange={(event) => {newOrder.Item = event.target.value}}/>
                        <Form.Label>waiter</Form.Label>
                        <Form.Control onChange={(event) => {newOrder.Attendant = event.target.value}}/>
                        <Form.Label >table</Form.Label>
                        <Form.Control onChange={(event) => {newOrder.Table = event.target.value}}/>
                        <Form.Label >price</Form.Label>
                        <Form.Control type="number" onChange={(event) => {newOrder.itemprice = parseFloat(event.target.value)}}/>
                    </Form.Group>
                    <Button onClick={() => changeSingleOrder()}>Change</Button>
                    <Button onClick={() => replaceTicketchange({"change": false, "id": 0})}>Cancel</Button>
                </Modal.Body>
            </Modal>
        </div>
        
    );

    //changes the waiter
    function changeWaiterForOrder(){
        changeWaiter.change = false
        var url = "http://localhost:5000/attendant/edit/" + changeWaiter.id
        axios.put(url, {
            "Attendant": newWaiterName
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                setRefreshData(true)
            }
        })
        
    }

    //changes the order
    function changeSingleOrder(){
        changeOrder.change = false;
        var url = "http://localhost:5000/ticket/edit/" + changeOrder.id
        axios.put(url, newOrder)
            .then(response => {
            if(response.status == 200){
                setRefreshData(true)
            }
        })
    }

    //creates a new order
    function addSingleOrder(){
        setAddNewOrder(false)
        var url = "http://localhost:5000/ticket/new"
        axios.post(url, {
            "Attendant": newOrder.Attendant,
            "Item": newOrder.Item,
            "Table": newOrder.Table,
            "itemprice": parseFloat(newOrder.itemprice)
        }).then(response => {
            if(response.status == 200){
                setRefreshData(true)
            }
        })
    }

    //gets all the orders
    function getAllOrders(){
        var url = "http://localhost:5000/tickets"
        axios.get(url, {
            responseType: 'json'
        }).then(response => {
            if(response.status == 200){
                setOrders(response.data)
            }
        })
    }

    //deletes a single order
    function removeOneOrder(id){
        var url = "http://localhost:5000/ticket/remove/" + id
        axios.delete(url, {

        }).then(response => {
            if(response.status == 200){
                setRefreshData(true)
            }
        })
    }

}

export default Tickets