type Info = {
    numberOfPages: number;
    numberOfItems: number;
    exceedsMaxItems: boolean;
    orderByProperty: string;
    orderByAscending: boolean;
    page: number;
    pageSize: number;
    searchTerm: string;
    selected: any[];
};

type Editable = {
    id: string;
};

type BusinessUnit = {
    id: string;
    name: string;
};

type Assortment = {
    id: string;
    name: string;
};

export type IProduct = {
    Number: string;
    Name: string;
    Unit: string;
    Editable: Editable[];
    ExternalId: string;
    BusinessUnit: BusinessUnit[];
    MainProductGroup: string;
    Price: string;
    Tags: any[];
    CreationDate: string;
    UpdateDate: string;
    Categories: any[];
    Assortments: Assortment[];
    OrderAssortments: any[];
    Components: any[];
    ProductDeclarations: any[];
    OrderAssortmentIds: any[];
    CanDelete: string;
    CanCopy: string;
    Id: string;
};

export type getProductsResponseType = {
    info: Info;
    data: IProduct[];
};