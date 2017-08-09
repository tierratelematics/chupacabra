import ModelContext from "../model/ModelContext";

class ContextOperations {
    static keyFor(context: ModelContext, notificationKey?: string): string {
        let channel = `/${context.area}/${context.modelId}`.toLowerCase();
        if (notificationKey)
            channel += `/${notificationKey}`;
        return channel;
    }
}

export default ContextOperations
