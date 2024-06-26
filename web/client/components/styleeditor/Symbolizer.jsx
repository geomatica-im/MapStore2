

/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Glyphicon, DropdownButton, MenuItem } from 'react-bootstrap';
import uuidv1 from 'uuid/v1';
import Message from '../I18N/Message';

const defaultGetOptions = ({ ruleBlock, symbolizerBlock, kind }) =>
    kind !== 'Raster'
        ? [
            {
                value: 'Simple',
                labelId: 'styleeditor.simpleStyle',
                onSelect: ({ ruleId, defaultProperties }) => ({
                    ruleId,
                    name: '',
                    symbolizers: [
                        {
                            ...defaultProperties,
                            symbolizerId: uuidv1()
                        }
                    ]
                })
            },
            {
                value: 'Classification',
                labelId: 'styleeditor.classificationStyle',
                onSelect: ({ ruleId, symbolizerKind, defaultProperties }) => {
                    return {
                        ...defaultProperties,
                        ...ruleBlock.Classification.defaultProperties,
                        ruleId,
                        symbolizerKind
                    };
                }
            },
            {
                value: 'Mark',
                labelId: 'styleeditor.patternMarkStyle',
                isVisible: ({ graphicKey }) => !!graphicKey,
                onSelect: ({ ruleId, defaultProperties, graphicKey }) => ({
                    ruleId,
                    name: '',
                    symbolizers: [
                        {
                            ...defaultProperties,
                            symbolizerId: uuidv1(),
                            fill: undefined,
                            [graphicKey]: {
                                ...symbolizerBlock.Mark.defaultProperties
                            }
                        }
                    ]
                })
            },
            {
                value: 'Icon',
                labelId: 'styleeditor.patternIconStyle',
                isVisible: ({ graphicKey }) => !!graphicKey,
                onSelect: ({ ruleId, defaultProperties, graphicKey }) => ({
                    ruleId,
                    name: '',
                    symbolizers: [
                        {
                            ...defaultProperties,
                            symbolizerId: uuidv1(),
                            fill: undefined,
                            [graphicKey]: {
                                ...symbolizerBlock.Icon.defaultProperties
                            }
                        }
                    ]
                })
            }
        ]
        : [
            {
                value: 'Gray',
                labelId: 'styleeditor.singleBand',
                onSelect: ({ ruleId }) => ({
                    ruleId,
                    name: '',
                    symbolizers: [
                        {
                            ...symbolizerBlock.Raster.defaultProperties,
                            symbolizerId: uuidv1()
                        }
                    ]
                })
            },
            {
                value: 'RGB',
                labelId: 'styleeditor.rgbaBands',
                onSelect: ({ ruleId }) => ({
                    ruleId,
                    name: '',
                    symbolizers: [
                        {
                            ...symbolizerBlock.Raster.defaultProperties,
                            channelSelection: {
                                redChannel: {
                                    sourceChannelName: undefined,
                                    contrastEnhancement: {}
                                },
                                greenChannel: {
                                    sourceChannelName: undefined,
                                    contrastEnhancement: {}
                                },
                                blueChannel: {
                                    sourceChannelName: undefined,
                                    contrastEnhancement: {}
                                }
                            },
                            symbolizerId: uuidv1()
                        }
                    ]
                })
            },
            {
                value: 'PseudoColor',
                labelId: 'styleeditor.pseudoColor',
                onSelect: ({ ruleId }) => ({
                    ...ruleBlock.Raster.defaultProperties,
                    ruleId
                })
            }
        ];

const defaultGetSelected = ({
    ruleKind,
    graphic,
    symbolizerKind,
    channelSelection
}) => {
    if (ruleKind === 'Raster') {
        return 'PseudoColor';
    }
    if (symbolizerKind === 'Raster') {
        return channelSelection?.redChannel
            ? 'RGB'
            : 'Gray';
    }
    return ruleKind !== undefined
        ? ruleKind
        :  graphic?.kind
            ? graphic?.kind
            : 'Simple';
};

export function SymbolizerMenu({
    ruleKind,
    symbolizerKind,
    ruleId,
    graphic,
    channelSelection,
    hide,
    ruleBlock,
    symbolizerBlock,
    getSelected = defaultGetSelected,
    getOptions = defaultGetOptions,
    onSelect,
    supportedOptions
}) {

    const options = getOptions({ ruleBlock, symbolizerBlock, kind: symbolizerKind }).filter(option => !supportedOptions || supportedOptions.includes(option.value));

    const { defaultProperties, params = {} } = symbolizerKind
        ? symbolizerBlock[symbolizerKind]
        : {};

    const graphicKey = params?.color?.config?.graphicKey;

    const selected = getSelected({ ruleKind, symbolizerKind, graphic, channelSelection });

    function handleSelect(key, properties) {
        if (key === selected) {
            return null;
        }
        return onSelect(properties);
    }

    if (hide) {
        return null;
    }

    return (
        <DropdownButton
            className="square-button-md no-border"
            noCaret
            pullRight
            title={<Glyphicon glyph="option-vertical"/>}>
            {options.map((option) => {
                return !option.isVisible || option.isVisible({ graphicKey })
                    ? (
                        <MenuItem
                            key={option.value}
                            active={selected === option.value}
                            onClick={() => handleSelect(
                                option.value,
                                option.onSelect({
                                    ruleId,
                                    ruleKind,
                                    symbolizerKind,
                                    defaultProperties,
                                    graphicKey
                                }))}>
                            <Message msgId={option.labelId} />
                        </MenuItem>
                    )
                    : null;
            })}
        </DropdownButton>
    );
}

function Symbolizer({
    className,
    glyph,
    tools,
    children
}) {
    const customClassName = className ? ' ' + className : '';
    return (
        <li className={`ms-symbolizer${customClassName}`}>
            <div className="ms-symbolizer-info">
                {glyph && <Glyphicon glyph={glyph} />}
                <div className="ms-symbolizer-tools">
                    {tools}
                </div>
            </div>
            {children}
        </li>
    );
}

export default Symbolizer;
