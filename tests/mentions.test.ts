import {removeQuotes} from "../src/features/mentions.js";

// Run me with `npm test`.
const textWithBlockQuotes = ">quote\n\n> quote  \n>quote  \n> quote\n\n > quote\n\n  >quote\n\n   > quote\n\n    > quote\n\n     > quote\n \n> * > bullet\n\n* > bullet\n\n* bullet\n\n > quote\n >\n > * > bullet\n\n# >quote\n\n# > quote\n\n> # quote\n\n> # * quote\n\n> * #quote\n\n# > * quote\n\n# >quote\n\n# > quote\n\n> # quote\n\n> # * quote\n\n> * #quote\n\n# > * quote\n\n#>quote\n#> quote\n# >quote\n\n**>quote**\n\n* * a\n\n * * b\n\n   * * * > quote\n\n- > quote\n\n1. > quote\n\n2. >quote\n\n > 2. > qoute";
const textAfterQuoteRemoval = "\n\n\n\n\n\n\n\n\n\n\n\n* bullet\n\n\n\n\n# >quote\n\n# > quote\n\n\n\n\n# > * quote\n\n# >quote\n\n# > quote\n\n\n\n\n# > * quote\n\n#>quote\n#> quote\n# >quote\n\n**>quote**\n\n* * a\n\n * * b\n\n   * * * > quote\n\n\n\n";

test("removeQuotes", () => {
    expect(removeQuotes(textWithBlockQuotes)).toStrictEqual(textAfterQuoteRemoval);
});

// Add more tests here or make a new file named `<subject under test>.test.ts`.
