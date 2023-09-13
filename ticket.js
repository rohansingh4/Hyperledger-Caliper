const { Contract } = require('fabric-contract-api');

class TravelerTicketContract extends Contract {
    async createTravelerTicket(ctx, id, trip_id, status, revenue, rapid, cm, bus, refund, check_in, check_out, traveller_id) {
        const exists = await this.ticketExists(ctx, id);
        if (exists) {
            throw new Error(`Ticket with ID ${id} already exists`);
        }

        const ticket = {
            id,
            trip_id,
            status,
            revenue,
            rapid,
            cm,
            bus,
            refund,
            check_in,
            check_out,
            traveller_id
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(ticket)));
    }

    async updateTravelerTicket(ctx, id, newStatus) {
        const ticket = await this.readTravelerTicket(ctx, id);
        if (!ticket) {
            throw new Error(`Ticket with ID ${id} does not exist`);
        }

        ticket.status = newStatus;

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(ticket)));
    }

    async readTravelerTicket(ctx, id) {
        const ticketJSON = await ctx.stub.getState(id);
        if (!ticketJSON || ticketJSON.length === 0) {
            throw new Error(`Ticket with ID ${id} does not exist`);
        }

        return JSON.parse(ticketJSON.toString());
    }

    async ticketExists(ctx, id) {
        const ticketJSON = await ctx.stub.getState(id);
        return ticketJSON && ticketJSON.length > 0;
    }
}

module.exports = TravelerTicketContract;
