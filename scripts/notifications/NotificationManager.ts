import INotificationManager from "./INotificationManager";
import Notification from "./Notification";
import {Observable} from "rx";
import ModelContext from "../model/ModelContext";

class NotificationManager implements INotificationManager {

    private refCounts: { [key: string]: number } = {};

    constructor(private client: SocketIOClient.Socket) {
    }

    notificationsFor(context: ModelContext): Observable<Notification> {
        this.subscribeToChannel(context);
        return this.getNotificationStream(context).finally(() => this.unsubscribeFromChannel(context));
    }

    protected getNotificationStream(context: ModelContext): Observable<Notification> {
        return this.getConnectionObservable()
            .take(1)
            .flatMap(() => Observable.fromEvent<Notification>(this.client, keyFor(context)));
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

    private subscribeToChannel(context: ModelContext): void {
        this.operateOnChannel("subscribe", context);
        if (!this.refCounts[keyFor(context)]) this.refCounts[keyFor(context)] = 1;
        else this.refCounts[keyFor(context)]++;
    }

    private unsubscribeFromChannel(context: ModelContext): void {
        this.refCounts[keyFor(context)]--;
        if (this.refCounts[keyFor(context)] > 0) return;

        this.operateOnChannel("unsubscribe", context);
        delete this.refCounts[keyFor(context)];
    }

    private operateOnChannel(operation: string, context: ModelContext): void {
        this.client.emit(operation, context);
    }
}

function keyFor(context: ModelContext): string {
    return `${context.area}:${context.modelId}`;
}

export default NotificationManager;
