class ModelContext {
    area: string;
    modelId: string;
    parameters?: object;

    constructor(area: string, modelId: string, parameters?: object) {
        this.area = area;
        this.modelId = modelId;
        this.parameters = parameters;
    }
}

export default ModelContext