import IModelRetriever from "./IModelRetriever";
import {Observable} from "rx";
import INotificationManager from "../notifications/INotificationManager";
import {stringify} from "qs";
import ModelContext from "./ModelContext";
import IHttpClient from "../net/IHttpClient";
import {retrySequence} from "../util/TypesUtil";

class ModelRetriever implements IModelRetriever {

    constructor(private httpClient: IHttpClient,
                private notificationManager: INotificationManager) {

    }

    modelFor<T>(context: ModelContext, notificationKey?: string): Observable<T> {
        let qs = stringify(context.parameters);
        return this.notificationManager.notificationsFor(context, notificationKey)
            .let(retrySequence(error => null))
            .selectMany(notification => this.httpClient.get(notification.url + (qs ? `?${qs}` : "")))
            .map(response => <T>response.response);
    }
}

export default ModelRetriever
