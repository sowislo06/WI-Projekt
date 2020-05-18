/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Asset } from './asset';
import { Category } from './category';
import { contracts } from '.';
import { Station } from './station';
import { Activity } from './activity';

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

    @Transaction(false)
    @Returns('boolean')
    public async stationExcists(ctx: Context, stationId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(stationId);
        return (!!buffer && buffer.length > 0);
    }


    @Transaction(false)
    @Returns('Station')
    public async readStation(ctx: Context, stationId: string): Promise<Station> {
        const exists = await this.stationExcists(ctx, stationId);
        if (!exists) {
            throw new Error(`The station ${stationId} does not exist`);
        }
        const buffer = await ctx.stub.getState(stationId);
        const station = JSON.parse(buffer.toString()) as Station;
        return station;
    }

    @Transaction()
    public async createStation(ctx: Context, stationId: string, name: string): Promise<void> {

        const station = new Station();
        station.name = name;
        const buffer = Buffer.from(JSON.stringify(station));
        await ctx.stub.putState(stationId, buffer);
    }

//END: STATION

//START: Activity

    @Transaction(false)
    @Returns('boolean')
    public async activityExists(ctx: Context, activityId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(activityId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction(false)
    @Returns('Activity')
    public async readActivity(ctx: Context, activityId: string): Promise<Activity> {
        const exists = await this.activityExists(ctx, activityId);
        if (!exists) {
            throw new Error(`The activity ${activityId} does not exist`);
        }
        const buffer = await ctx.stub.getState(activityId);
        const activity = JSON.parse(buffer.toString()) as Activity;
        return activity;
    }

    @Transaction()
    public async createActivity(ctx: Context, activityId: string, name: string, assetId: string, stationId: string): Promise<void> {
        
        const existsActivity = await this.activityExists(ctx, activityId);
        if (existsActivity) {
            throw new Error(`The activity ${activityId} already exists`);
        }

        const activity = new Activity();
        const asset = await this.readAsset(ctx, assetId);
        const station = await this.readStation(ctx, stationId);


        activity.name = name;
        activity.asset = asset;
        activity.station = station;
        const buffer = Buffer.from(JSON.stringify(activity));

        await ctx.stub.putState(activityId, buffer);
    }

//END: STATION
}