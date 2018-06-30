const algoliasearch = require('algoliasearch');
const client = algoliasearch('', '');
const index = client.initIndex('staging_ads');

index.search('*', {
  // numericFilters: ['category>=1000']
  facetFilters: ['countryCode:VN']
}, function searchDone(err, content) {
  if (err) {
    console.error(err);
    return;
  }

  console.log(content.hits);
  console.log(content.hits.map(hit => hit.objectID));
  // index.deleteObjects(content.hits.map(hit => hit.objectID), function(err, content) {
  //   console.log(content);
  // });
});
