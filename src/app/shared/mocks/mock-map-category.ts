import { MapCategory } from '../models/map-category';

export const MAP_CATEGORY: MapCategory[] = [
    {
        categoryId: 1,
        name: 'Demographics',
        mapVariables: [1,2]
    },
    {
        categoryId: 2,
        name: 'Economy',
        mapVariables: [3,4,5]
    },
    {
        categoryId: 3,
        name: 'Education',
        mapVariables: [6,7]
    },
    {
        categoryId: 4,
        name: 'Engagement',
        mapVariables: [8]
    },
    {
        categoryId: 5,
        name: 'Environment',
        mapVariables: [9,10,11]
    },
    {
        categoryId: 6,
        name: 'Health',
        mapVariables: [12,13,14]
    },
    {
        categoryId: 7,
        name: 'Housing',
        mapVariables: [15,16]
    },
    {
        categoryId: 8,
        name: 'Safety',
        mapVariables: [17,18]
    }, 
    {
        categoryId: 9,
        name: 'Transportation',
        mapVariables: [19,20,21]
    }
];