(function () {
    for (const part in vocab) {
        let total = 0;
        for (const word in vocab[part]) {
            vocab[part][word] = {
                min: total,
                max: total + vocab[part][word] - 1,
            };
            total = vocab[part][word].max+1;
        }
        vocab[part]['__total__'] = total;
    }

    function chooseWord(kind) {
        const idx = Math.floor(Math.random() * vocab[kind]['__total__']);
        for (const word in vocab[kind]) {
            if (idx >= vocab[kind][word].min && idx <= vocab[kind][word].max)
                return word;
        }
        return '<empty>';
    }

    function joiner() {
        return ['and', 'yet', 'but'][Math.floor(Math.random()*3)];
    }

    function adverb_adj(s, num, i) {
        let adj = '';
        if (Math.random() < 0.25)
            adj += chooseWord('adverb') + '-';

        adj += chooseWord('adjective');
        if (num > 2 && i < num - 1)
            adj += ',';
        if (i == num - 2)
            adj += ' '+joiner();
        s.push(adj);
    }

    function standardCadence(s) {
        let adjs = Math.floor(Math.random()*4);
        for (let i = 0; i < adjs; i++)
            adverb_adj(s, adjs, i);
        s.push(chooseWord('noun'));
        s.push(chooseWord('preposition'));
        s.push(chooseWord('article'));
        adjs = Math.floor(Math.random()*4);
        for(let i = 0; i < adjs; i++)
            adverb_adj(s, adjs, i);
        s.push(chooseWord('noun'));
        if (Math.random() < 0.25)
            s.push(chooseWord('adverb'));
        s.push(chooseWord('verb'));
        s.push(chooseWord('article'));
        adjs = 1+Math.floor(Math.random()*2);
        for (let i = 0; i < adjs; i++)
            adverb_adj(s, adjs, i);
        s.push(chooseWord('noun')+'.');
    }

    function capitalize (word) {
        return word[0].toUpperCase()+word.substring(1);
    }

    /* This cadence isn't the absolute most natural, but it will do for this scope. */
    function cadence() {
        let s = [];
        s.push(capitalize(chooseWord('article')));
        standardCadence(s);
        s.push(capitalize(chooseWord('conjunction'))+',');
        standardCadence(s);
        s.push(capitalize(chooseWord('conjunction'))+',');
        standardCadence(s);
        return s.join(' ');
    }

    function loop() {
        document.getElementById('target').textContent += ' ' + cadence();
    }

    loop();
    setInterval(loop, 5000);
})();