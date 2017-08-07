import expect = require("expect.js");
import {Observable} from "rx";
import {IMock, Mock, Times, It} from "typemoq";
import IModelRetriever from "../scripts/model/IModelRetriever";
import INotificationManager from "../scripts/notifications/INotificationManager";
import ModelRetriever from "../scripts/model/ModelRetriever";
import IHttpClient from "../scripts/net/IHttpClient";
import HttpResponse from "../scripts/net/HttpResponse";
import ModelContext from "../scripts/model/ModelContext";

describe("Model retriever, given an area and a model id", () => {

    let subject: IModelRetriever;
    let httpClient: IMock<IHttpClient>;
    let notificationManager: IMock<INotificationManager>;

    beforeEach(() => {
        httpClient = Mock.ofType<IHttpClient>();
        notificationManager = Mock.ofType<INotificationManager>();
        subject = new ModelRetriever(httpClient.object, notificationManager.object);
        notificationManager.setup(n => n.notificationsFor(It.isAny())).returns(context => {
            return Observable.just({
                url: "http://testurl/",
                notificationKey: context.parameters ? context.parameters.id : ""
            });
        });
        httpClient.setup(h => h.get("http://testurl/")).returns(() => Observable.just(new HttpResponse({count: 20}, 200)));
        httpClient.setup(h => h.get("http://testurl/?id=60")).returns(() => Observable.just(new HttpResponse({count: 60}, 200)));
        httpClient.setup(h => h.get("http://testurl/?id=60&test=50")).returns(() => Observable.just(new HttpResponse({count: 60}, 200)));
    });

    context("when requesting a context", () => {
        it("should load the data", () => {
            let modelState: any;
            subject.modelFor<any>(new ModelContext("Admin", "Bar")).take(1).subscribe(item => modelState = item);

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
            it("should pass those parameters in the query string", () => {
                subject.modelFor<any>(new ModelContext("Admin", "Bar", {id: 60, test: 50})).subscribe();

                httpClient.verify(h => h.get("http://testurl/?id=60&test=50"), Times.once());
            });
        });
    });
});
