import test from 'ava';
import isPlainObj from 'is-plain-obj';
import isEqual from 'lodash.isequal';
import PixivAppApi from './';

const userId = 471355;
const illustId = 57907953;

test.beforeEach('new Pixiv()', t => {
	const username = process.env.USERNAME;
	const password = process.env.PASSWORD;
	t.context.m = new PixivAppApi(username, password);
});

test('expose a constructor', t => {
	t.true(typeof PixivAppApi === 'function');
});

test('auth', async t => {
	await t.context.m.login();
	const json = await t.context.m.authInfo();
	t.true(isPlainObj(json));
});

test('userDetail', async t => {
	await t.context.m.login();
	const json = await t.context.m.userDetail(userId);
	t.true(isPlainObj(json));
});

test('userIllusts', async t => {
	const json = await t.context.m.userIllusts(userId);
	t.true(isPlainObj(json));
});

test('userBookmarksIllust', async t => {
	const auth = await t.context.m.login();
	const json = await t.context.m.userBookmarksIllust(auth.user.id);
	t.true(isPlainObj(json));
});

test('userBookmarksIllust private', async t => {
	const auth = await t.context.m.login();
	const json = await t.context.m.userBookmarksIllust(auth.user.id, {restrict: 'private'});
	t.true(isPlainObj(json));
});

test('illustDetail', async t => {
	await t.context.m.login();
	const json = await t.context.m.illustDetail(illustId);
	t.true(isPlainObj(json));
});

test('illustFollow', async t => {
	await t.context.m.login();
	const json = await t.context.m.illustFollow(userId);
	t.true(isPlainObj(json));
});

test('illustComments', async t => {
	const json = await t.context.m.illustComments(illustId);
	t.true(isPlainObj(json));
});

test('illustRelated', async t => {
	const json = await t.context.m.illustRelated(illustId);
	t.true(isPlainObj(json));
});

test('illustRecommended', async t => {
	await t.context.m.login();
	const json = await t.context.m.illustRecommended();
	t.true(isPlainObj(json));
});

test('illustRanking', async t => {
	const json = await t.context.m.illustRanking();
	t.true(isPlainObj(json));
});

test('trendingTagsIllust', async t => {
	const json = await t.context.m.trendingTagsIllust();
	t.true(isPlainObj(json));
});

test('searchIllust', async t => {
	const json = await t.context.m.searchIllust('レム');
	t.true(isPlainObj(json));
});

test('illustBookmarkDetail', async t => {
	const json = await t.context.m.illustBookmarkDetail(illustId);
	t.true(isPlainObj(json));
});

test('error if params missing', async t => {
	async function macro(fn, message) {
		try {
			await fn();
		} catch (err) {
			t.is(err.message, message);
		}
	}

	macro(t.context.m.userDetail, 'user_id required');
	macro(t.context.m.userIllusts, 'user_id required');
	macro(t.context.m.userBookmarksIllust, 'user_id required');
	macro(t.context.m.illustComments, 'illust_id required');
	macro(t.context.m.illustRelated, 'illust_id required');
	macro(t.context.m.searchIllust, 'word required');
	macro(t.context.m.illustBookmarkDetail, 'illust_id required');
});

test('decamelize params', async t => {
	const json1 = await t.context.m.userIllusts(userId);
	const json2 = await t.context.m.userIllusts(userId, {userId: 2957827});
	t.false(isEqual(json1, json2));
});

test('camelcaseKeys', async t => {
	const json = await t.context.m.userIllusts(userId, {userId: 2957827});
	t.true({}.hasOwnProperty.call(json, 'nextUrl'));
});

test('not camelcaseKeys', async t => {
	const json = await t.context.m.userIllusts(userId, {userId: 2957827});
	t.false({}.hasOwnProperty.call(json, 'next_url'));
});
