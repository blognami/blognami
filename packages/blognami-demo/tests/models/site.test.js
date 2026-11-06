
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`site`, () => Workspace.run(async function() {
    const { site, sites } = this.database;

    const { title } = await site;

    assert.equal(title, '');

    assert.equal(await sites.count(), 1);
}));

test(`site logoImage`, () => Workspace.run(async function() {
    const { images } = this.database;

    assert.equal(await this.database.site.logoImage, undefined);

    const image = await images.insert({ file: { filename: 'logo.png', mimeType: 'image/png', data: Buffer.from('logo') } });

    await this.database.site.update({ logoImageId: image.id });

    assert.equal((await this.database.site.logoImage).id, image.id);

    await this.database.site.update({ logoImageId: null });

    assert.equal(await this.database.site.logoImage, undefined);
}));

const logoFile = (filename = 'logo.png', mimeType = 'image/png') => ({ filename, mimeType, data: Buffer.from(filename) });

async function getBlob(blobId){
    return (await this.blobStore).get(blobId);
}

test(`site logo set`, () => Workspace.run(async function() {
    await this.database.site.update({ logo: logoFile() });

    const { logoImageId } = await this.database.site;
    const image = await this.database.images.where({ id: logoImageId }).first();

    assert.ok(image);
    assert.equal(image.title, 'logo.png');
    assert.deepEqual(await getBlob.call(this, image.blobId), Buffer.from('logo.png'));
}));

test(`site logo replace`, () => Workspace.run(async function() {
    await this.database.site.update({ logo: logoFile('old.png') });
    const oldImage = await this.database.site.logoImage;

    await this.database.site.update({ logo: logoFile('new.png') });
    const newImage = await this.database.site.logoImage;

    assert.equal(newImage.title, 'new.png');
    assert.notEqual(newImage.id, oldImage.id);
    assert.equal(await this.database.images.where({ id: oldImage.id }).first(), undefined);
    assert.equal(await getBlob.call(this, oldImage.blobId), null);
    assert.equal(await this.database.images.count(), 1);
}));

test(`site logo remove`, () => Workspace.run(async function() {
    await this.database.site.update({ logo: logoFile() });
    const image = await this.database.site.logoImage;

    await this.database.site.update({ removeLogo: true });

    assert.equal((await this.database.site).logoImageId, null);
    assert.equal(await this.database.images.where({ id: image.id }).first(), undefined);
    assert.equal(await getBlob.call(this, image.blobId), null);
}));

test(`site logo file wins over removeLogo`, () => Workspace.run(async function() {
    await this.database.site.update({ logo: logoFile('old.png') });

    await this.database.site.update({ logo: logoFile('new.png'), removeLogo: true });

    assert.equal((await this.database.site.logoImage).title, 'new.png');
    assert.equal(await this.database.images.count(), 1);
}));

test(`site logo empty file`, () => Workspace.run(async function() {
    await this.database.site.update({ logo: logoFile() });
    const image = await this.database.site.logoImage;

    await this.database.site.update({ title: 'New title', logo: { filename: '', mimeType: 'application/octet-stream', data: Buffer.alloc(0) } });

    const site = await this.database.site;
    assert.equal(site.title, 'New title');
    assert.equal(site.logoImageId, image.id);
    assert.equal(await this.database.images.count(), 1);
    assert.deepEqual(await getBlob.call(this, image.blobId), Buffer.from('logo.png'));
}));

test(`site logo non-image file`, () => Workspace.run(async function() {
    const site = await this.database.site;

    await assert.rejects(site.update({ title: 'New title', logo: logoFile('notes.txt', 'text/plain') }));

    assert.equal(site.validationErrors.logo, 'Must be png, jpeg, gif, svg, webp, avif or tiff');
    assert.equal(await this.database.images.count(), 0);
    assert.equal((await this.database.site).title, '');
    assert.equal((await this.database.site).logoImageId, null);
}));

test(`site coverImage`, () => Workspace.run(async function() {
    const { images } = this.database;

    assert.equal(await this.database.site.coverImage, undefined);

    const image = await images.insert({ file: { filename: 'cover.png', mimeType: 'image/png', data: Buffer.from('cover') } });

    await this.database.site.update({ coverImageId: image.id });

    assert.equal((await this.database.site.coverImage).id, image.id);

    await this.database.site.update({ coverImageId: null });

    assert.equal(await this.database.site.coverImage, undefined);
}));

test(`site cover set`, () => Workspace.run(async function() {
    await this.database.site.update({ cover: logoFile('cover.png') });

    const { coverImageId } = await this.database.site;
    const image = await this.database.images.where({ id: coverImageId }).first();

    assert.ok(image);
    assert.equal(image.title, 'cover.png');
    assert.deepEqual(await getBlob.call(this, image.blobId), Buffer.from('cover.png'));
}));

test(`site cover replace`, () => Workspace.run(async function() {
    await this.database.site.update({ cover: logoFile('old.png') });
    const oldImage = await this.database.site.coverImage;

    await this.database.site.update({ cover: logoFile('new.png') });
    const newImage = await this.database.site.coverImage;

    assert.equal(newImage.title, 'new.png');
    assert.notEqual(newImage.id, oldImage.id);
    assert.equal(await this.database.images.where({ id: oldImage.id }).first(), undefined);
    assert.equal(await getBlob.call(this, oldImage.blobId), null);
    assert.equal(await this.database.images.count(), 1);
}));

test(`site cover remove`, () => Workspace.run(async function() {
    await this.database.site.update({ cover: logoFile('cover.png') });
    const image = await this.database.site.coverImage;

    await this.database.site.update({ removeCover: true });

    assert.equal((await this.database.site).coverImageId, null);
    assert.equal(await this.database.images.where({ id: image.id }).first(), undefined);
    assert.equal(await getBlob.call(this, image.blobId), null);
}));

test(`site cover file wins over removeCover`, () => Workspace.run(async function() {
    await this.database.site.update({ cover: logoFile('old.png') });

    await this.database.site.update({ cover: logoFile('new.png'), removeCover: true });

    assert.equal((await this.database.site.coverImage).title, 'new.png');
    assert.equal(await this.database.images.count(), 1);
}));

test(`site cover empty file`, () => Workspace.run(async function() {
    await this.database.site.update({ cover: logoFile('cover.png') });
    const image = await this.database.site.coverImage;

    await this.database.site.update({ title: 'New title', cover: { filename: '', mimeType: 'application/octet-stream', data: Buffer.alloc(0) } });

    const site = await this.database.site;
    assert.equal(site.title, 'New title');
    assert.equal(site.coverImageId, image.id);
    assert.equal(await this.database.images.count(), 1);
    assert.deepEqual(await getBlob.call(this, image.blobId), Buffer.from('cover.png'));
}));

test(`site cover non-image file`, () => Workspace.run(async function() {
    const site = await this.database.site;

    await assert.rejects(site.update({ title: 'New title', cover: logoFile('notes.txt', 'text/plain') }));

    assert.equal(site.validationErrors.cover, 'Must be png, jpeg, gif, svg, webp, avif or tiff');
    assert.equal(await this.database.images.count(), 0);
    assert.equal((await this.database.site).title, '');
    assert.equal((await this.database.site).coverImageId, null);
}));

test(`site cover leaves the logo alone`, () => Workspace.run(async function() {
    await this.database.site.update({ logo: logoFile('logo.png') });
    const logoImage = await this.database.site.logoImage;

    await this.database.site.update({ cover: logoFile('cover.png') });
    assert.equal((await this.database.site).logoImageId, logoImage.id);
    assert.ok(await this.database.images.where({ id: logoImage.id }).first());

    await this.database.site.update({ removeCover: true });
    assert.equal((await this.database.site).coverImageId, null);
    assert.equal((await this.database.site).logoImageId, logoImage.id);
    assert.ok(await this.database.images.where({ id: logoImage.id }).first());
    assert.deepEqual(await getBlob.call(this, logoImage.blobId), Buffer.from('logo.png'));
}));

if(process.env.TENANCY === 'multi'){
    test(`site with multi-tenancy and tenant exists`, () => Workspace.run(async function() {
        const { tenant, site, sites } = this.database;

        assert.equal(typeof await tenant, 'object');

        assert.equal(typeof await site, 'object');

        assert.equal(await sites.count(), 1);

        assert.equal(await this.database.run(`select * from sites`).length, 1);
    }));
    

    test(`site with multi-tenancy and tenant does not exist`, () => Workspace.run(async function() {
        this.initialParams._headers.host = 'example.com';
        
        const { tenant, site, sites } = this.database;

        assert.equal(typeof await tenant, 'undefined');

        assert.equal(typeof await site, 'undefined');

        assert.equal(await sites.count(), 0);

        assert.equal(await this.database.run(`select * from sites`).length, 0);
    }));
}