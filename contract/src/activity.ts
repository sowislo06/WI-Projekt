/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';
import { Station } from './station';
import { Asset } from './asset';

@Object()
export class Activity {

    @Property()
    public name: string;

    @Property()
    public asset: Asset;

    @Property()
    public station: Station;

}
