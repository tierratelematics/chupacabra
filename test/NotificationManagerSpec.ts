import expect = require("expect.js");
import {IMock, Mock, Times, It} from "typemoq"
import NotificationManager from "../scripts/notifications/NotificationManager";
import ModelContext from "../scripts/model/ModelContext";

describe("NotificationManager, given an area and a model id", () => {

    let subject: NotificationManager;
    let client: IMock<SocketIOClient.Socket>;

    beforeEach(() => {
        client = Mock.ofType<SocketIOClient.Socket>();
        subject = new NotificationManager(client.object);
    });

    context("when the subscriber needs notifications about the model change", () => {
        it("should subscribe to the backend", () => {
            subject.notificationsFor(new ModelContext("Admin", "FakePage"));

            client.verify(c => c.emit('subscribe', It.isValue(new ModelContext("Admin", "FakePage"))), Times.once());
        });

        context("and custom parameters are needed on the backend side", () => {
            it("should also add these parameters to the subscription request", () => {
                subject.notificationsFor(new ModelContext("Admin", "FakePage", {id: 60}));

                client.verify(c => c.emit('subscribe', It.isValue(new ModelContext("Admin", "FakePage", {id: 60}))), Times.once());
            });
        });
    });

    context("when a notifications is not needed anymore", () => {
        it("should dispose the subscription", () => {
            let subscription = subject.notificationsFor(new ModelContext("Admin", "FakePage", {id: 60})).subscribe();
            subscription.dispose();

            client.verify(c => c.emit('unsubscribe', It.isValue(new ModelContext("Admin", "FakePage", {id: 60}))), Times.once());
        });
    });
});