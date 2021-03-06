const test = require("ava");
const merge = require("deepmerge");
const extractMatch = require("../lib/extractMatch.js");
const buildEmbed = require("../lib/buildEmbed.js");
const pluginDefaults = require("../lib/pluginDefaults.js");
const validStrings = require("./inc/validStrings.js");

/**
 * TEST: Build script returns expected HTML string, given valid input and default options
 */
validStrings.forEach(function(obj) {
	test(
		`${obj.type} default embed behavior`,
		(t) => {
			const idealCase = `<p>${obj.str}</p>`;
			const tweetObj = extractMatch(idealCase);
			const output = buildEmbed(tweetObj, pluginDefaults, 0);
			const expected = '<div class="eleventy-plugin-embed-twitter"><blockquote id="tweet-1289865845053652994" class="twitter-tweet"><a href="https://twitter.com/SaraSoueidan/status/1289865845053652994"></a></blockquote></div><script src="https://platform.twitter.com/widgets.js" charset="utf-8" async></script>';
			t.is(output, expected);
		},
	);
});

/**
 * TEST: Build script returns expected HTML string for NONZERO-INDEX entries, given valid input and default options
 */
validStrings.forEach(function(obj) {
	test(
		`${obj.type} default embed behavior, nonzero array index`,
		(t) => {
			const idealCase = `<p>${obj.str}</p>`;
			const tweetObj = extractMatch(idealCase);
			const output = buildEmbed(tweetObj, pluginDefaults, 1);
			const expected = '<div class="eleventy-plugin-embed-twitter"><blockquote id="tweet-1289865845053652994" class="twitter-tweet"><a href="https://twitter.com/SaraSoueidan/status/1289865845053652994"></a></blockquote></div>';
			t.is(output, expected);
		},
	);
});

/**
 * TEST: Build script returns expected HTML string, given valid input and async script option disabled
 */
validStrings.forEach(function(obj) {
	test(
		`${obj.type} default embed, synchronous twitter script`,
		(t) => {
			const twitterAsyncFalse = {
				twitterScript: {
					async: false,
				},
			};
			const customOpt = merge(pluginDefaults, twitterAsyncFalse);
			const idealCase = `<p>${obj.str}</p>`;
			const tweetObj = extractMatch(idealCase);
			const output = buildEmbed(tweetObj, customOpt, 0);
			const expected = '<div class="eleventy-plugin-embed-twitter"><blockquote id="tweet-1289865845053652994" class="twitter-tweet"><a href="https://twitter.com/SaraSoueidan/status/1289865845053652994"></a></blockquote></div><script src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
			t.is(output, expected);
		},
	);
});

/**
 * TEST: Build script returns expected HTML string, given valid input AND twitter script defer = true
 */
validStrings.forEach(function(obj) {
	test(
		`${obj.type} default embed, deferred twitter script`,
		(t) => {
			const twitterDeferTrue = {
				twitterScript: {
					defer: true,
				},
			};
			const customOpt = merge(pluginDefaults, twitterDeferTrue);
			const idealCase = `<p>${obj.str}</p>`;
			const tweetObj = extractMatch(idealCase);
			const output = buildEmbed(tweetObj, customOpt, 0);
			const expected = '<div class="eleventy-plugin-embed-twitter"><blockquote id="tweet-1289865845053652994" class="twitter-tweet"><a href="https://twitter.com/SaraSoueidan/status/1289865845053652994"></a></blockquote></div><script src="https://platform.twitter.com/widgets.js" charset="utf-8" async defer></script>';
			t.is(output, expected);
		},
	);
});

/**
 * TEST: Build script returns expected oEmbed HTML string, given valid input with oembed option active
 */
validStrings.forEach(function(obj) {
	test(
		`${obj.type} cached oembed behavior`,
		async (t) => {
			const oEmbedOption = merge(pluginDefaults, {cacheText: true});
			const idealCase = `<p>${obj.str}</p>`;
			const tweetObj = extractMatch(idealCase);
			const output = await buildEmbed(tweetObj, oEmbedOption, 0);
			const expected = '<div class="eleventy-plugin-embed-twitter"><blockquote class="twitter-tweet"><p lang="en" dir="ltr">I&#39;ve been increasingly feeling like Grid or Flex has become the new Tabs or Spaces.</p>&mdash; Sara Soueidan (@SaraSoueidan) <a href="https://twitter.com/SaraSoueidan/status/1289865845053652994?ref_src=twsrc%5Etfw">August 2, 2020</a></blockquote>\n<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>\n</div>';
			t.is(output, expected);
		},
	);
});
