import expect = require("expect.js");
import {IdempotenceFilter} from "../scripts/notifications/IdempotenceFilter";

describe("Given an idempotence filter", () => {

    let subject: IdempotenceFilter;

    beforeEach(() => {
        subject = new IdempotenceFilter();
    });

    context("when a notification has been already processed", () => {
        beforeEach(() => {
            subject.filter({
                url: "", notificationKey: "", eventId: "id-1", timestamp: null
            });
        });

        it("should not be processed", () => {
            expect(subject.filter({
                url: "", notificationKey: "", eventId: "id-1", timestamp: null
            })).to.be(false);
        });
    });

    context("when a notification has not been processed yet", () => {
        it("should be processed", () => {
            expect(subject.filter({
                url: "", notificationKey: "", eventId: "id-1", timestamp: null
            })).to.be(true);
        });
    });

    context("when a notification does not have an event id", () => {
        it("should be processed", () => {
            expect(subject.filter({
                url: "", notificationKey: "", timestamp: new Date(10)
            })).to.be(true);
            expect(subject.filter({
                url: "", notificationKey: "", timestamp: new Date(22)
            })).to.be(true);
        });
    });

    context("when an initial notification has already been processed", () => {
        it("should not process the subsequents initial notifications", () => {
            expect(subject.filter({
                eventId: null, url: "", notificationKey: "", timestamp: null
            })).to.be(true);
            expect(subject.filter({
                eventId: null, url: "", notificationKey: "", timestamp: null
            })).to.be(false);
        });
    });
});
