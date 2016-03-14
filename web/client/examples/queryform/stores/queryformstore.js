/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var DebugUtils = require('../../../utils/DebugUtils');

const {combineReducers} = require('redux');

const initialState = {
    seachURL: null,
    showGeneratedFilter: false,
    attributePanelExpanded: true,
    spatialPanelExpanded: true,
    showDetailsPanel: false,
    groupLevels: 5,
    useMapProjection: false,
    toolbarEnabled: true,
    groupFields: [
        {
            id: 1,
            logic: "OR",
            index: 0
        }
    ],
    filterFields: [],
    spatialField: {
        method: null,
        attribute: "the_geom",
        operation: "INTERSECTS",
        geometry: null
    },
    attributes: [
        {
            id: "ListAttribute",
            fieldName: "ListAttribute",
            type: "list",
            valueId: "id",
            valueLabel: "name",
            values: [
                {id: "value1", name: "value1"},
                {id: "value2", name: "value2"},
                {id: "value3", name: "value3"},
                {id: "value4", name: "value4"},
                {id: "value5", name: "value5"}
            ]
        },
        {
            id: "DateAttribute",
            fieldName: "DateAttribute",
            type: "date"
        }
    ]
};

 // reducers
const reducers = combineReducers({
    browser: require('../../../reducers/browser'),
    config: require('../../../reducers/config'),
    locale: require('../../../reducers/locale'),
    map: require('../../../reducers/map'),
    draw: require('../../../reducers/draw'),
    queryform: require('../../../reducers/queryform')
});

// export the store with the given reducers
module.exports = DebugUtils.createDebugStore(reducers, {queryform: initialState});
