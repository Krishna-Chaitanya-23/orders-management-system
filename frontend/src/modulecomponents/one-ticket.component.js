import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import {Button, Card, Row, Col} from 'react-bootstrap'

const Ticket = ({ticketData, serverChange, removeOneOrder, replaceTicketchange}) => {

    return (
        <Card>
            <Row>
                <Col>Dish:{ ticketData !== undefined && ticketData.item}</Col>
                <Col>Server:{ ticketData !== undefined && ticketData.attendant}</Col>
                <Col>Table:{ ticketData !== undefined && ticketData.table}</Col>
                <Col>Price: ${ticketData !== undefined && ticketData.itemprice}</Col>
                <Col><Button onClick={() => removeOneOrder(ticketData._id)}>delete order</Button></Col>
                <Col><Button onClick={() => replaceWaiter()}>change waiter</Button></Col>
                <Col><Button onClick={() => replaceTicket()}>change order</Button></Col>
            </Row>
        </Card>
    )

    function replaceWaiter(){
        console.log(ticketData);

        
        serverChange(
            {
                "change": true,
                "id": ticketData._id
            }
        )
    }

    function replaceTicket(){
        replaceTicketchange(
            {
                "change": true,
                "id": ticketData._id
            }
        )
    }

}

export default Ticket