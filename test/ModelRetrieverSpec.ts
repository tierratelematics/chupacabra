import "reflect-metadata";
import expect = require("expect.js");
import {Observable} from "rx";
import {IMock, Mock, Times, It} from "typemoq";
import IModelRetriever from "../scripts/model/IModelRetriever";
import INotificationManager from "../scripts/notifications/INotificationManager";
import ModelRetriever from "../scripts/model/ModelRetriever";
import {IParametersDeserializer} from "../scripts/model/ParametersDeserializer";
import IHttpClient from "../scripts/net/IHttpClient";
import HttpResponse from "../scripts/net/HttpResponse";

describe("Model retriever, given an area and a model id", () => {

    let subject: IModelRetriever;
    let httpClient: IMock<IHttpClient>;
    let notificationManager: IMock<INotificationManager>;
    let parametersDeserializer: IMock<IParametersDeserializer>;

    beforeEach(() => {
        httpClient = Mock.ofType<IHttpClient>();
        notificationManager = Mock.ofType<INotificationManager>();
        parametersDeserializer = Mock.ofType<IParametersDeserializer>();
        subject = new ModelRetriever(httpClient.object, notificationManager.object, parametersDeserializer.object);
        notificationManager.setup(n => n.notificationsFor(It.isAny())).returns(context => {
            return Observable.just({url: 'http://testurl/' + (context.parameters ? context.parameters.id : "")});
        });
        httpClient.setup(h => h.get("http://testurl/")).returns(() => Observable.just(new HttpResponse({count: 20}, 200)));
        httpClient.setup(h => h.get("http://testurl/60")).returns(() => Observable.just(new HttpResponse({count: 60}, 200)));
        httpClient.setup(h => h.get("http://testurl/60?id=60")).returns(() => Observable.just(new HttpResponse({count: 60}, 200)));
    });

    context("when requesting a context", () => {
        it("should load the data", () => {
            let modelState: any;
            subject.modelFor<any>({area: "Admin", modelId: "Bar"}).take(1).subscribe(item => modelState = item);

            expect(modelState.count).to.be(20);
        });

        context("and some parameters are needed to construct the model", () => {
            it("should append those parameters when requesting the model", () => {
                let modelState: any;
                subject.modelFor<any>({
                    area: "Admin",
                    modelId: "Bar",
                    parameters: {id: 60}
                }).take(1).subscribe(item => modelState = item);

                expect(modelState.count).to.be(60);
            });
        });

        context("and some parameters are needed on the backend side", () => {
            beforeEach(() => {
                parametersDeserializer
                    .setup(p => p.deserialize(It.isValue({area: "Admin", modelId: "Bar", parameters: {id: 60}})))
                    .returns(() => {
                        return {id: 60};
                    });
            });
            it("should pass those parameters in the query string", () => {
                subject.modelFor<any>({area: "Admin", modelId: "Bar", parameters: {id: 60}}).subscribe();

                httpClient.verify(h => h.get("http://testurl/60?id=60"), Times.once());
            });
        });

        context("and parameters aren't needed on the backend side", () => {
            beforeEach(() => {
                parametersDeserializer
                    .setup(p => p.deserialize(It.isValue({
                        area: "Admin",
                        modelId: "NoParameter",
                        parameters: {id: 60}
                    })))
                    .returns(() => null);
            });
            it("should keep the query string empty", () => {
                subject.modelFor<any>({
                    area: "Admin",
                    modelId: "NoParameter",
                    parameters: {id: 60}
                }).subscribe();

                httpClient.verify(h => h.get("http://testurl/60"), Times.once());
            });
        });
    });
});