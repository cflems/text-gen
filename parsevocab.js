const fs = require('fs').promises;
const lang = require('./english.js');
const infile = 'writingsample.txt';
const outfile = 'vocab.js';
const wordPattern = /(([0-9]+,)*[0-9]+)|([a-z0-9\-\']+)/gi;
const quotePattern = /"[^"]+"/g;


(async function () {
    const vocab = {};

    function vocab_append(word, speechPart) {
        if (word in vocab[speechPart])
            vocab[speechPart][word]++;
        else
            vocab[speechPart][word] = 1;
    }

    for (const speechPart in lang) {
        vocab[speechPart] = {};
    }

    const corpus = (await fs.readFile(infile, {'encoding': 'utf8'})).replace(quotePattern, '');
    const matches = corpus.match(wordPattern);

    if (matches) {
        for (const word of corpus.match(wordPattern)) {
            let found = false;
            for (const speechPart in lang) {
                if (lang[speechPart].indexOf(word.toLowerCase()) != -1) {
                    found = true;
                    vocab_append(word.toLowerCase(), speechPart);
                } else if (lang[speechPart].indexOf(word) != -1) {
                    found = true;
                    vocab_append(word, speechPart);
                }
            }
            /* Assume all non-dictionary words are proper nouns. */
            if (!found) {
                /* [proper noun]'s becomes an adjective. */
                if (word.endsWith('\'s') || word.endsWith('s\''))
                    vocab_append(word, 'adjective');
                else
                    vocab_append(word, 'noun');
            }
        }
    }

    await fs.writeFile(outfile, '/* Generated via `node parsevocab.js`. */\nconst vocab = '+JSON.stringify(vocab)+';\n');
})();