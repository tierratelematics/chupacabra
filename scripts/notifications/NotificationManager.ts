import INotificationManager from "./INotificationManager";
import Notification from "./Notification";
import {Observable} from "rx";
import ModelContext from "../model/ModelContext";
import ContextOperations from "../util/ContextOperations";

class NotificationManager implements INotificationManager {

    private refCounts: { [key: string]: number } = {};

    constructor(private client: SocketIOClient.Socket) {
    }

    notificationsFor(context: ModelContext, notificationKey?: string): Observable<Notification> {
        this.subscribeToChannel(context, notificationKey);
        return this.getNotificationStream(context, notificationKey).finally(() => this.unsubscribeFromChannel(context, notificationKey));
    }

    protected getNotificationStream(context: ModelContext, notificationKey: string): Observable<Notification> {
        return this.getConnectionObservable()
            .take(1)
            .flatMap(() => Observable.fromEvent<Notification>(this.client, ContextOperations.keyFor(context, notificationKey)))
            .map(notification => {
                notification.timestamp = new Date(notification.timestamp);
                return notification;
            });
    }

    private getConnectionObservable(): Observable<void> {
        return Observable.create<void>((observer) => {
            if (this.client.connected) {
                observer.onNext(null);
            } else {
                this.client.on("connect", () => observer.onNext(null));
                this.client.on("connect_error", error => observer.onError(error));
                this.client.on("disconnect", error => observer.onError(error));
            }
        });
    }

    private subscribeToChannel(context: ModelContext, notificationKey: string): void {
        let room = ContextOperations.keyFor(context, notificationKey);
        this.operateOnChannel("subscribe", context);
        if (!this.refCounts[room]) this.refCounts[room] = 1;
        else this.refCounts[room]++;
    }

    private unsubscribeFromChannel(context: ModelContext, notificationKey: string): void {
        let room = ContextOperations.keyFor(context, notificationKey);
        this.refCounts[room]--;
        if (this.refCounts[room] > 0) return;

        this.operateOnChannel("unsubscribe", context);
        delete this.refCounts[room];
    }

    private operateOnChannel(operation: string, context: ModelContext): void {
        this.client.emit(operation, context);
    }
}

export default NotificationManager;
