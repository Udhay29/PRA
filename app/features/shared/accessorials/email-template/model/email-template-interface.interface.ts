export interface FilterData {
    id: number;
    name: string;
    association?: string;
    invalid?: boolean;
}

export interface SubmitStatus {
    status: boolean;
    introParagraph: boolean;
    conclusionParagraph: boolean;
    signatureLine: boolean;
    introSave: boolean;
    conclusionSave: boolean;
    signatureSave: boolean;
    defaultSave: boolean;
    batchSave: boolean;
}

export interface EventQuery {
    query: string;
}
