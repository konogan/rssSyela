'use strict';

const DOMPARSER = new DOMParser().parseFromString.bind(new DOMParser());

fetch('urls.json')
  .then((jsonUrlContent) => {
    jsonUrlContent
      .text()
      .then((jsonUrlContentText) => {
        let frag = document.createDocumentFragment();
        let debut = true;
        JSON.parse(jsonUrlContentText).urls.forEach((u) => {
          try {
            var url = new URL(u)
          }
          catch (e) {
            console.error('URL invalid');
            return
          }

          fetch(url)
            .then((content) => {
              content
                .text()
                .then((contentXML) => {
                  try {
                    let doc = DOMPARSER(contentXML, 'text/xml');

                    let titre = document.createElement('h1');
                    titre.textContent = url.hostname;
                    frag.appendChild(titre);

                    doc
                      .querySelectorAll('item')
                      .forEach((item) => {
                        console.log(item);
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
                    console.error('Error in parsing the XML', e);
                  }
                  if (debut) {
                    document.querySelector('output').textContent = '';
                    debut = false;
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
