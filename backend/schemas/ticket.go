package schemas

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Ticket struct {
	TicketID  primitive.ObjectID `bson:"_id"`
	Item      *string            `json:"item"`
	ItemPrice *float64           `json:"itemprice"`
	Attendant *string            `json:"attendant"`
	Table     *string            `json:"table"`
}
