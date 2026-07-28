import {containsAllModsKeyword, extractUniqueUsernameMentions, normaliseMentionText, removeAllModsKeywords, removeQuotes} from "../src/features/mentions.js";

// Run me with `npm test`.
const textWithBlockQuotes = ">quote\n\n> quote  \n>quote  \n> quote\n\n > quote\n\n  >quote\n\n   > quote\n\n    > quote\n\n     > quote\n \n> * > bullet\n\n* > bullet\n\n* bullet\n\n > quote\n >\n > * > bullet\n\n# >quote\n\n# > quote\n\n> # quote\n\n> # * quote\n\n> * #quote\n\n# > * quote\n\n# >quote\n\n# > quote\n\n> # quote\n\n> # * quote\n\n> * #quote\n\n# > * quote\n\n#>quote\n#> quote\n# >quote\n\n**>quote**\n\n* * a\n\n * * b\n\n   * * * > quote\n\n- > quote\n\n1. > quote\n\n2. >quote\n\n > 2. > qoute";
const textAfterQuoteRemoval = "\n\n\n\n\n\n\n\n\n\n\n\n* bullet\n\n\n\n\n# >quote\n\n# > quote\n\n\n\n\n# > * quote\n\n# >quote\n\n# > quote\n\n\n\n\n# > * quote\n\n#>quote\n#> quote\n# >quote\n\n**>quote**\n\n* * a\n\n * * b\n\n   * * * > quote\n\n\n\n";

test("removeQuotes", () => {
    expect(removeQuotes(textWithBlockQuotes)).toStrictEqual(textAfterQuoteRemoval);
});

describe("normaliseMentionText", () => {
    test("unescapes markdown-escaped underscores", () => {
        expect(normaliseMentionText("ping u/rob\\_summers")).toStrictEqual("ping u/rob_summers");
    });

    test("lowercases a capitalised mention prefix", () => {
        expect(normaliseMentionText("U/robert can you look")).toStrictEqual("u/robert can you look");
        expect(normaliseMentionText("/U/robert can you look")).toStrictEqual("/u/robert can you look");
    });

    test("leaves a capital U inside a word alone", () => {
        expect(normaliseMentionText("see MENU/options")).toStrictEqual("see MENU/options");
        expect(normaliseMentionText("the EU/UK deal")).toStrictEqual("the EU/UK deal");
    });

    test("leaves ordinary text untouched", () => {
        expect(normaliseMentionText("ping u/robert can you look")).toStrictEqual("ping u/robert can you look");
    });
});

describe("extractUniqueUsernameMentions", () => {
    const cases: [string, string, string[]][] = [
        ["plain prefix", "ping u/robert please", ["robert"]],
        ["slash prefix", "ping /u/robert please", ["robert"]],
        ["capitalised prefix", "U/robert can you look at this", ["robert"]],
        ["capitalised slash prefix", "/U/robert can you look at this", ["robert"]],
        ["escaped underscore", "ping u/rob\\_summers please", ["rob_summers"]],
        ["capitalised prefix and escaped underscore", "U/rob\\_summers can you look", ["rob_summers"]],
        ["underscore without escaping", "ping u/rob_summers please", ["rob_summers"]],
        ["hyphenated username", "ping u/rob-summers please", ["rob-summers"]],
        ["bold wrapped", "ping **u/robert** please", ["robert"]],
        ["trailing punctuation", "ping u/robert, thanks", ["robert"]],
        ["deduplicates repeats", "u/robert and u/robert again", ["robert"]],
        ["lowercases the username", "ping u/RoBeRt please", ["robert"]],
        ["multiple mentions", "ping u/robert and u/sarah please", ["robert", "sarah"]],
        ["bare username is not a mention", "ping robert please", []],
        ["markdown link is not a mention", "ping [u/robert](https://www.reddit.com/user/robert) please", []],
        ["prefix with a space is not a mention", "ping u/ robert please", []],
        ["too short a username", "ping u/ab please", []],
    ];

    for (const [name, input, expected] of cases) {
        test(name, () => {
            expect(extractUniqueUsernameMentions(input)).toStrictEqual(expected);
        });
    }
});

describe("containsAllModsKeyword", () => {
    const keywords = ["@mods", "@all"];

    const matches: [string, string][] = [
        ["on its own", "@mods"],
        ["mid sentence", "can @mods take a look at this"],
        ["at the start", "@mods please look"],
        ["different case", "@MODS please look"],
        ["followed by punctuation", "@mods, please look"],
        ["second keyword in the list", "paging @all please"],
        ["inside a sentence with other mentions", "u/robert and @mods should see this"],
    ];

    const nonMatches: [string, string][] = [
        ["longer word", "paging @modsquad please"],
        ["preceded by a word character", "email someone@mods please"],
        ["not present", "can someone take a look at this"],
        ["substring of another word", "the @modserver is down"],
        ["bare word without the prefix", "can mods take a look"],
    ];

    for (const [name, input] of matches) {
        test(`matches ${name}`, () => {
            expect(containsAllModsKeyword(input, keywords)).toBe(true);
        });
    }

    for (const [name, input] of nonMatches) {
        test(`does not match ${name}`, () => {
            expect(containsAllModsKeyword(input, keywords)).toBe(false);
        });
    }

    test("is not affected by a previous call's regex state", () => {
        expect(containsAllModsKeyword("@mods one", keywords)).toBe(true);
        expect(containsAllModsKeyword("@mods two", keywords)).toBe(true);
        expect(containsAllModsKeyword("@mods three", keywords)).toBe(true);
    });

    test("no keywords configured matches nothing", () => {
        expect(containsAllModsKeyword("@mods please look", [])).toBe(false);
    });
});

describe("removeAllModsKeywords", () => {
    test("strips a keyword that would otherwise read as a username mention", () => {
        expect(extractUniqueUsernameMentions(removeAllModsKeywords("please check u/mods", ["u/mods"]))).toStrictEqual([]);
    });

    test("leaves genuine mentions alone", () => {
        expect(extractUniqueUsernameMentions(removeAllModsKeywords("@mods and u/robert", ["@mods"]))).toStrictEqual(["robert"]);
    });

    test("leaves text alone when no keywords are configured", () => {
        expect(removeAllModsKeywords("@mods please look", [])).toStrictEqual("@mods please look");
    });
});
