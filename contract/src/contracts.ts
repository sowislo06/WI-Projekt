/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Asset } from './models/asset';
import { Category } from './models/category';
import { contracts } from '.';
import { Station } from './models/station';

@Info({title: 'Contracts', description: 'All Smart Contract' })
export class Contracts extends Contract {


//START: ASSET

    @Transaction(false)
    @Returns('boolean')
    public async assetExists(ctx: Context, assetId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(assetId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createAsset(ctx: Context, assetId: string, name: string, categoryId: string): Promise<void> {
        const existsAsset = await this.assetExists(ctx, assetId);
        if (existsAsset) {
            throw new Error(`The my asset ${assetId} already exists`);
        }

        const asset = new Asset();
        const category = await this.readCategory(ctx, categoryId);

        asset.name = name;
        asset.category = category;
        const buffer = Buffer.from(JSON.stringify(asset));

        await ctx.stub.putState(assetId, buffer);
    }

    @Transaction(false)
    @Returns('Asset')
    public async readAsset(ctx: Context, assetId: string): Promise<Asset> {
        const exists = await this.assetExists(ctx, assetId);
        if (!exists) {
            throw new Error(`The my asset ${assetId} does not exist`);
        }
        const buffer = await ctx.stub.getState(assetId);
        const myAsset = JSON.parse(buffer.toString()) as Asset;
        return myAsset;
    }

//END: ASSET

//START: CATEGORY


    @Transaction(false)
    @Returns('Category')
    public async readCategory(ctx: Context, categoryId: string): Promise<Category> {
        const exists = await this.categoryExists(ctx, categoryId);
        if (!exists) {
            throw new Error(`The my asset ${categoryId} does not exist`);
        }
        const buffer = await ctx.stub.getState(categoryId);
        const category = JSON.parse(buffer.toString()) as Category;
        return category;
    }

    @Transaction(false)
    @Returns('boolean')
    public async categoryExists(ctx: Context, categoryId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(categoryId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createCategory(ctx: Context, categoryId: string, name: string): Promise<void> {
        const exists = await this.categoryExists(ctx, categoryId);
        if (exists) {
            throw new Error(`The my asset ${categoryId} already exists`);
        }
        const category = new Category();
        category.name = name;
        const buffer = Buffer.from(JSON.stringify(category));
        await ctx.stub.putState(categoryId, buffer);
    }
//END: CATEGORY

//START: STATION

    @Transaction()
    public async createStation(ctx: Context, stationId: string, name: string, assetId: string): Promise<void> {

        const asset = new Asset();

        const station = new Station();
        station.name = name;
        station.assets.push(asset);
        const buffer = Buffer.from(JSON.stringify(station));
        await ctx.stub.putState(stationId, buffer);
    }

//END: STATION

}