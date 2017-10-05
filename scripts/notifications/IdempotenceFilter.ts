import Notification from "./Notification";

const cbuffer = require("CBuffer");

export interface IIdempotenceFilter {
    filter(notification: Notification): boolean;
}

export class IdempotenceFilter implements IIdempotenceFilter {
    private ringBuffer = new cbuffer(100);

    filter(notification: Notification): boolean {
        if (!notification.eventId) return true;

        let filtered = this.ringBuffer.every(item => item.eventId !== notification.eventId, this);
        if (filtered) this.ringBuffer.push(notification);
        return filtered;
    }

}
