import IModelRetriever from "./IModelRetriever";
import {Observable} from "rx";
import INotificationManager from "../notifications/INotificationManager";
import {stringify} from "qs";
import ModelContext from "./ModelContext";
import IHttpClient from "../net/IHttpClient";
import {IdempotenceFilter} from "../notifications/IdempotenceFilter";
import {retrySequence} from "../util/TypesUtil";

class ModelRetriever implements IModelRetriever {

    constructor(private httpClient: IHttpClient,
                private notificationManager: INotificationManager) {

    }

    modelFor<T>(context: ModelContext, notificationKey?: string): Observable<T> {
        let idempotenceFilter = new IdempotenceFilter();
        let qs = stringify(context.parameters);
        return Observable.defer(() => this.notificationManager.notificationsFor(context, notificationKey))
            .let(retrySequence())
            .filter(notification => idempotenceFilter.filter(notification))
            .selectMany(notification => this.httpClient.get(notification.url + (qs ? `?${qs}` : "")))
            .map(response => <T>response.response);
    }
}

export default ModelRetriever
