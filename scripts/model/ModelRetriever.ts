import IModelRetriever from "./IModelRetriever";
import {Observable} from "rx";
import INotificationManager from "../notifications/INotificationManager";
import {stringify} from "qs";
import ModelContext from "./ModelContext";
import IHttpClient from "../net/IHttpClient";

class ModelRetriever implements IModelRetriever {

    constructor(private httpClient: IHttpClient,
                private notificationManager: INotificationManager) {

    }

    modelFor<T>(context: ModelContext): Observable<T> {
        let qs = stringify(context.parameters);
        return this.notificationManager.notificationsFor(context)
            .selectMany(notification => this.httpClient.get(notification.url + (qs ? `?${qs}` : "")))
            .map(response => <T>response.response);
    }
}

export default ModelRetriever
