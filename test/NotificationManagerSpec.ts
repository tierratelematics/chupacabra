import "reflect-metadata";
import expect = require("expect.js");
import * as TypeMoq from "typemoq";
import NotificationManager from "../scripts/notifications/NotificationManager";

describe("NotificationManager, given an area and a model id", () => {

    let subject: NotificationManager;
    let client: TypeMoq.IMock<SocketIOClient.Socket>;

    beforeEach(() => {
        client = TypeMoq.Mock.ofType<SocketIOClient.Socket>();
        subject = new NotificationManager(client.object);
    });

    context("when the subscriber needs notifications about the model change", () => {
        it("should subscribe to the backend", () => {
            subject.notificationsFor({area: "Admin", modelId: "FakePage"});
            client.verify(c => c.emit('subscribe', TypeMoq.It.isValue({
                area: "Admin",
                modelId: "FakePage"
            })), TypeMoq.Times.once());
        });

        context("and custom parameters are needed on the backend side", () => {
            it("should also add these parameters to the subscription request", () => {
                subject.notificationsFor({area: "Admin", modelId: "FakePage", parameters: {id: 60}});
                client.verify(c => c.emit('subscribe', TypeMoq.It.isValue({
                    area: "Admin",
                    modelId: "FakePage",
                    parameters: {id: 60}
                })), TypeMoq.Times.once());
            });
        });
    });

    context("when a notifications is not needed anymore", () => {
        it("should dispose the subscription", () => {
            let subscription = subject.notificationsFor({
                area: "Admin",
                modelId: "FakePage",
                parameters: {id: 60}
            }).subscribe(null);
            subscription.dispose();
            client.verify(c => c.emit('unsubscribe', TypeMoq.It.isValue({
                area: "Admin",
                modelId: "FakePage",
                parameters: {id: 60}
            })), TypeMoq.Times.once());
        });
    });
});