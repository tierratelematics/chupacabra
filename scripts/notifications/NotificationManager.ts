import INotificationManager from "./INotificationManager";
import Notification from "./Notification";
import {Observable} from "rx";
import {injectable, inject} from "inversify";
import ModelContext from "../model/ModelContext";

@injectable()
class NotificationManager implements INotificationManager {

    constructor(@inject("SocketIOClient.Socket") private client: SocketIOClient.Socket) {

    }

    notificationsFor(context: ModelContext): Observable<Notification> {
        this.subscribeToChannel(context);
        return this.getNotificationStream(context).finally(() => this.unsubscribeFromChannel(context));
    }

    protected getNotificationStream(context: ModelContext): Observable<Notification> {
        return Observable.fromEvent<Notification>(this.client, `${context.area}:${context.modelId}`);
    }

    private subscribeToChannel(context: ModelContext): void {
        this.operateOnChannel('subscribe', context);
    }

    private unsubscribeFromChannel(context: ModelContext): void {
        this.operateOnChannel('unsubscribe', context);
    }

    private operateOnChannel(operation: string, context: ModelContext): void {
        this.client.emit(operation, context);
    }
}

export default NotificationManager