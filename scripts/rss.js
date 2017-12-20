'use strict';

const DOMPARSER = new DOMParser().parseFromString.bind(new DOMParser());

fetch('urls.json')
  .then((res) => {
    res.text().then((data) => {
      var frag = document.createDocumentFragment();
      var hasBegun = true;
      JSON.parse(data).urls.forEach((u) => {
        try {
          var url = new URL(u)
        }
        catch (e) {
          console.error('URL invalid');
          return
        }

        fetch(url).then((res) => {
          res.text().then((xmlTxt) => {
            try {
              let doc = DOMPARSER(xmlTxt, "text/xml");
              let heading = document.createElement('h1');
              heading.textContent = url.hostname;
              frag.appendChild(heading);
              doc.querySelectorAll('item').forEach((item) => {
                let temp = document.importNode(document.querySelector('template').content, true);
                let i = item.querySelector.bind(item);
                let t = temp.querySelector.bind(temp);
                t('h2').textContent = !!i('title') ? i('title').textContent : '-';
                t('a').textContent = t('a').href = !!i('link') ? i('link').textContent : '#';
                t('p').innerHTML = !!i('description') ? i('description').textContent : '-';
                t('h3').textContent = url.hostname;
                frag.appendChild(temp);
              })
            } catch (e) {
              console.error('Error in parsing the feed');
            }
            if (hasBegun) {
              document.querySelector('output').textContent = '';
              hasBegun = false;
            }
            document.querySelector('output').appendChild(frag);
          })
        }).catch((err) => {
          console.error('Error in fetching the RSS feed', err);
        });

      })
    })
  }).catch((err) => {
    console.error('Error in fetching the URLs json', err);
  });
