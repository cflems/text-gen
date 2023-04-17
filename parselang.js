const fs = require('fs').promises;
const langfile = 'langdata.txt';
const outfile = 'english.js';
const dict = {};

(async function () {
    const f = await fs.open(langfile);
    for await (const line of f.readLines()) {
        const chunks = line.split('\\');
        const [word, type] = line.split('\\');
        for (let i = 0; i < 1 /* type.length */; i++) {
            if (type[i] in dict)
                dict[type[i]].push(word);
            else
                dict[type[i]] = [word];
        }
    }

    /* Re-map to human-readable tags. */
    dict['adjective'] = dict['A'];
    /* Nouns, plural nouns, and noun phrases respectively. */
    dict['noun'] = dict['N'].concat(dict['p']).concat(dict['h']);
    dict['adverb'] = dict['v'];
    /* Verbs, intransitive verbs, and transitive verbs respectively. */
    dict['verb'] = dict['V'].concat(dict['i']).concat(dict['t']);
    dict['preposition'] = dict['P'];
    dict['conjunction'] = dict['C'];
    dict['interjection'] = dict['!'];
    dict['pronoun'] = dict['r'];
    dict['article'] = dict['D'];


    delete dict['N'];
    delete dict['A'];
    delete dict['v'];
    delete dict['V'];
    delete dict['P'];
    delete dict['p'];
    delete dict['C'];
    delete dict['!'];
    delete dict['i'];
    delete dict['t'];
    delete dict['r'];
    delete dict['h'];
    delete dict['D'];

    await fs.writeFile(outfile, '/* Generated using `node parselang.js`. */\nmodule.exports = '+JSON.stringify(dict)+';\n');
})();