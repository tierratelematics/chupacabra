import Notification from "./Notification";
import {Observable} from "rx";
import ModelContext from "../model/ModelContext";

interface INotificationManager {
    notificationsFor(context: ModelContext, notificationKey?: string): Observable<Notification>;
}

export default INotificationManager
