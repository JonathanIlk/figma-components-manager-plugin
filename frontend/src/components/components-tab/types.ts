export interface IComponentListConfig {
    searchTerm: string;
    sortColumn: 'name' | 'instances';
    sortDirection: 'asc' | 'desc';
    groupByPage: boolean;
}
