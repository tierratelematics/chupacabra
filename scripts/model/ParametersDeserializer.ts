import ModelContext from "./ModelContext";

export interface IParametersDeserializer {
    deserialize(context: ModelContext): {};
}

export class NullParametersDeserializer implements IParametersDeserializer {

    deserialize(context: ModelContext): {} {
        return null;
    }

}