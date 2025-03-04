export interface Extent {
    crdt_unique_id: string;
    name: string;
    geometry_type: string;
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
    wkid: number;
}