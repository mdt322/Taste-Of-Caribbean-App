const { updateMenuWithImages } = require('./src/utils/imageUpload');

// Run the update
updateMenuWithImages()
  .then(() => {
    console.log('Successfully updated menu items with images');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
