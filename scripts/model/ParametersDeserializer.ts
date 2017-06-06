import ModelContext from "./ModelContext";

export interface IParametersDeserializer {
    deserialize(context: ModelContext): object;
}

export class NullParametersDeserializer implements IParametersDeserializer {

    deserialize(context: ModelContext): object {
        return null;
    }

}