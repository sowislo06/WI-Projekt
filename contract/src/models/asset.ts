/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';
import { Category } from './category';
import { Station } from './station';

@Object()
export class Asset {

    @Property()
    public name: string;

    @Property()
    public category: Category;

}
